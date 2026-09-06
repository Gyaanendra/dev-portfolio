# Security Architecture & Abuse Protection Specification

This document provides a comprehensive technical overview of the multi-layered security architecture, rate limiting engine, and abuse prevention systems implemented across the portfolio, with specific focus on the AI Chat Agent API (`/api/chat`).

---

## 1. Security Philosophy & Threat Model

The portfolio is protected against:
1. **Automated Scraping & Denial of Service (DoS)**: Scrapers attempting to exhaust Groq LLM API tokens or server resources.
2. **Botnets & Distributed Flood Attacks**: Multi-IP or rotating client scripts sending rapid concurrent requests.
3. **Out-of-Browser Clients**: Direct CLI or programmatic requests (`curl`, Python, Postman, automated HTTP clients).
4. **Incognito & VPN Bypassing**: Attackers attempting to evade simple IP-based rate limits by switching networks or wiping cookies.
5. **Prompt Injection & Instruction Extraction**: Malicious visitors attempting to extract system instructions or abuse the agent as a free code generator.

---

## 2. Multi-Layer Defense Matrix

```
[ Incoming Request ]
         │
         ▼
[ Layer 1: Content-Type & Origin Verification ]  ──(Failed)──► 429 "hire me for higher limist" (5h Ban)
         │
         ▼
[ Layer 2: Browser Metadata (Sec-Fetch-*) ]      ──(Failed)──► 429 "hire me for higher limist" (5h Ban)
         │
         ▼
[ Layer 3: Active 5-Hour Ban List Check ]        ──(Banned)──► 429 "hire me for higher limist" (Remaining TTL)
         │
         ▼
[ Layer 4: Bot & Headless UA Inspection ]        ──(Bot UA)──► 429 "hire me for higher limist" (5h Ban)
         │
         ▼
[ Layer 5: Device Fingerprint (FingerprintJS) ]   ──(Forged)──► 429 "hire me for higher limist" (5h Ban)
         │
         ▼
[ Layer 6: Payload & Role Sanitization ]         ──(Invalid)─► 400 Bad Request
         │
         ▼
[ Layer 7: Tiered Sliding-Window Rate Limiter ]  ──(Exceeded)► 429 "hire me for higher limist" (Cooldown)
         │
         ▼
[ Layer 8: Groq AI Stream & Tool Execution ]
```

---

## 3. Detailed Defense Implementations

### Layer 1: Content-Type & Origin Isolation
* **Source**: `app/api/chat/route.ts`
* **Content-Type**: Strictly requires `application/json`. Requests using `text/plain` or `multipart/form-data` are rejected with `415 Unsupported Media Type`, preventing simple cross-origin form POST exploits.
* **Origin Whitelist**: Browser `Origin` or `Referer` headers are strictly validated against:
  - `gyanendra.vihar.in` (Production domain)
  - `www.gyanendra.vihar.in`
  - `localhost` / `127.0.0.1` (Development)
  - `*.vercel.app` (Preview deployments)
* Direct requests omitting both `Origin` and `Referer` are flagged as non-browser calls and rejected with HTTP `429`.

---

### Layer 2: Browser Metadata (`Sec-Fetch-*`) Verification
* **Source**: `lib/chat/abuse-protection.ts` (`validateBrowserMetadata`)
* Modern browsers (Chrome 76+, Firefox 90+, Safari 16.4+, Edge 79+) automatically generate **forbidden request headers** that client-side scripts cannot forge:
  - `Sec-Fetch-Site: same-origin` (confirms the fetch originated directly from this website).
  - `Sec-Fetch-Mode: cors` (confirms standard browser fetch protocol).
  - `Sec-Fetch-Dest: empty`.
* **Out-of-Browser Blocking**: If `Sec-Fetch-Site` is `cross-site` or missing alongside a non-browser user-agent, the client is classified as an automated tool, banned for 5 hours, and returned HTTP `429`.

---

### Layer 3: Active 5-Hour Harsh Ban List
* **Source**: `lib/chat/abuse-protection.ts` (`checkActiveBan`, `applyHarshBotBan`)
* **Duration**: 5 hours (`18,000` seconds / `18,000,000` ms).
* **Dual Storage**:
  - **Upstash Redis**: Key `ban:<ip>` or `ban:fp:<visitorId>` with Redis `PX` (millisecond) TTL.
  - **In-Memory Store**: Local map `bannedEntities` storing absolute expiration timestamps with automated 5-minute garbage collection.
* **Immediate Short-Circuit**: Once banned, any subsequent request from that IP or device ID is rejected instantly at the edge without querying the LLM or Redis counters.

---

### Layer 4: Bot & Headless Client Detection
* **Source**: `lib/chat/abuse-protection.ts` (`detectBotUserAgent`)
* Scans the incoming `User-Agent` against known automation tools, scrapers, and headless testing frameworks:
  - `curl`, `wget`, `python-requests`, `aiohttp`, `httpx`, `go-http-client`, `node-fetch`, `axios`
  - `headlesschrome`, `puppeteer`, `playwright`, `selenium`, `phantomjs`
  - `postmanruntime`, `insomnia`, `scrapy`
* Detected bots are banned for 5 hours and returned HTTP `429`.

---

### Layer 5: Client Hardware Fingerprinting (`@fingerprintjs/fingerprintjs`)
* **Source**: `lib/chat/fingerprint.ts`, `components/chat/ChatWidget.tsx`
* **Mechanism**: Generates a high-entropy 32-character hexadecimal identifier based on client hardware and environment:
  - HTML5 Canvas rasterization
  - WebGL shader compilation & vendor strings
  - AudioContext frequency rendering
  - Screen dimensions, color depth, and hardware concurrency
* **Persistence**: Survives across:
  - Incognito / Private Browsing tabs
  - Clearing cookies and browser storage
  - IP address switching (VPNs, mobile networks)
* **Format Verification**: The server strictly enforces regex `^[a-f0-9]{32}$`. Malformed or forged tokens trigger an immediate 5-hour ban.

---

### Layer 6: Payload & Role Sanitization
* **Source**: `app/api/chat/route.ts` (`validateRequestBody`)
* **JSON Safe Parsing**: Returns `400 Bad Request` on malformed payloads rather than unhandled 500 runtime exceptions.
* **Role Whitelist**: Only `"user"` and `"assistant"` are permitted. Client-supplied `"system"` or `"developer"` roles are strictly rejected.
* **Caps & Constraints**:
  - Max messages: `40`
  - Max total conversation characters: `16,000`
  - Non-empty content validation for every message entry.

---

### Layer 7: Tiered Rate Limiting Specification

| Client Category | Threshold | Cooldown / Penalty | Action |
| :--- | :--- | :--- | :--- |
| **Genuine User (Per-Minute)** | > 8 requests / 60 seconds | **60 seconds** (sliding window) | Gentle reset |
| **Genuine User (Daily Quota)** | > 25 requests / 24 hours | **24 hours** (rolling reset) | Quota limit |
| **Rapid Human Double-Click** | 3 requests / 5 seconds | **5 seconds** | Momentary cooldown |
| **Automated Burst Flood Attack** | 4+ requests / 5 seconds | **5 HOURS (18,000s)** | Escalated Harsh Ban |
| **High-Frequency IP Flood** | 20+ requests / 1 minute | **5 HOURS (18,000s)** | Escalated Harsh Ban |
| **Bot / Scraper User-Agent** | Known automated client UA | **5 HOURS (18,000s)** | Immediate Harsh Ban |
| **Tampered Fingerprint Token** | Non-hex / malformed token | **5 HOURS (18,000s)** | Immediate Harsh Ban |
| **Out-of-Browser Client** | Missing browser headers / origin | **5 HOURS (18,000s)** | Immediate Harsh Ban |

---

### Layer 8: Response Standards & Error Masking
* **Status Code**: `429 Too Many Requests`
* **Response Body**:
  ```json
  {
    "error": "hire me for higher limist",
    "message": "hire me for higher limist",
    "reason": "..."
  }
  ```
* **Headers**:
  - `Retry-After: <remaining_seconds>`
  - `X-RateLimit-Limit: 8`
  - `X-RateLimit-Remaining: 0`
  - `X-RateLimit-Reset: <timestamp_ms>`
* **Frontend UI Behavior**: In `ChatWidget.tsx`, 429 errors display `"hire me for higher limist"` in high-contrast monospace typography with an interactive call-to-action linking directly to Gyanendra's Contact section and email.

---

### Layer 9: LLM Prompt Protection (F7 Defense)
* **Source**: `app/api/chat/route.ts` (`SYSTEM_PROMPT`)
* **Prompt Protection**: The AI strictly refuses any prompt-leaking, rule-inversion, or word-count probes. If asked about instructions, it responds:
  > *"I'm here to chat about Gyanendra — what would you like to know?"*
* **No Code Generator Abuse**: Rebuffs requests to generate external code or scripts, directing visitors to Gyanendra's GitHub repository.
* **Grounded Tool Schemas**: Restricts tools to reading static portfolio JSON records (`skills`, `work`, `projects`, `achievements`) without write or arbitrary execution access.

---

## 4. Environment Variables Configuration

| Variable Name | Purpose | Example / Notes |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Groq LLM Inference API Key | Required for chat agent |
| `UPSTASH_REDIS_REST_URL` | Distributed Redis REST Endpoint | Optional (in-memory fallback active if absent) |
| `UPSTASH_REDIS_REST_TOKEN` | Distributed Redis REST Auth Token | Optional (in-memory fallback active if absent) |

---

## 5. Verification Commands

To verify all security layers, run:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint check
npx eslint app/api/chat/route.ts lib/chat/abuse-protection.ts lib/chat/fingerprint.ts components/chat/ChatWidget.tsx

# 3. Production build
npm run build
```
