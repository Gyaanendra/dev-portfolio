import { Redis } from "@upstash/redis";

// Known automated scrapers, headless browsers, and bot user-agents
const BOT_USER_AGENTS = [
  "curl",
  "python-requests",
  "python-urllib",
  "aiohttp",
  "httpx",
  "go-http-client",
  "node-fetch",
  "axios",
  "headlesschrome",
  "puppeteer",
  "playwright",
  "selenium",
  "wget",
  "libwww-perl",
  "postmanruntime",
  "insomnia",
  "scrapy",
  "phantomjs",
  "mechanize",
];

// Single user & bot rate limits configuration
export const RATE_LIMIT_CONFIG = {
  // ─── Genuine / Human User Limits ───
  DEVICE_WINDOW_MS: 60_000, // 1 minute
  DEVICE_MAX_REQUESTS: 8, // 8 requests / minute per device
  DEVICE_DAILY_WINDOW_MS: 86_400_000, // 24 hours
  DEVICE_DAILY_MAX_REQUESTS: 25, // 25 requests / day per device

  // IP limits (protects against distributed multi-tabs / IP sharing)
  IP_WINDOW_MS: 60_000, // 1 minute
  IP_MAX_REQUESTS: 10, // 10 requests / minute per IP

  // Rapid burst protection
  BURST_WINDOW_MS: 5_000, // 5 seconds
  BURST_MAX_REQUESTS: 2, // Max 2 requests per 5 seconds

  // ─── Harsh Penalty for Bots & Automated Attacks (5 Hours) ───
  BOT_BAN_MS: 5 * 60 * 60 * 1000, // 5 hours (18,000,000 ms)
  BOT_BAN_SECONDS: 5 * 60 * 60, // 18,000 seconds

  // Escalation thresholds for automated flood attacks
  BURST_ATTACK_THRESHOLD: 4, // 4+ rapid requests in 5s triggers 5-hour ban
  IP_ATTACK_THRESHOLD: 20, // 20+ requests in 1m from same IP triggers 5-hour ban

  // User-requested custom rate limit response message
  RATE_LIMIT_MESSAGE: "hire me for higher limist",
};

// Check for Upstash Redis configuration
const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasUpstash ? Redis.fromEnv() : null;

// In-memory sliding window store for single-instance / local fallback
interface SlidingStoreItem {
  burst: number[];
  minute: number[];
  daily: number[];
}

const memoryStore = new Map<string, SlidingStoreItem>();

// In-memory persistent ban store for bots & automated attacks (5 hours)
const bannedEntities = new Map<string, { expiresAt: number; reason: string }>();

// Clean up stale entries periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    const dayAgo = now - RATE_LIMIT_CONFIG.DEVICE_DAILY_WINDOW_MS;

    // Prune expired rate limit timestamps
    for (const [key, item] of memoryStore.entries()) {
      item.daily = item.daily.filter((t) => t > dayAgo);
      if (item.daily.length === 0 && item.minute.length === 0 && item.burst.length === 0) {
        memoryStore.delete(key);
      }
    }

    // Prune expired bot bans
    for (const [key, ban] of bannedEntities.entries()) {
      if (ban.expiresAt <= now) {
        bannedEntities.delete(key);
      }
    }
  }, 300_000);

  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export interface AbuseCheckResult {
  allowed: boolean;
  status: number;
  message: string;
  retryAfter: number;
  reason?: string;
}

/**
 * Validates request for bot signatures, automated scrapers, and headless browsers.
 */
export function detectBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true; // Missing user-agent in browser requests is suspicious
  const lowerUa = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => lowerUa.includes(bot));
}

/**
 * Validates device visitor ID format.
 * Validates standard 32-character hexadecimal string.
 */
export function isValidVisitorId(visitorId: string | null | undefined): boolean {
  if (!visitorId || typeof visitorId !== "string") return false;
  return /^[a-f0-9]{32}$/i.test(visitorId);
}

/**
 * Checks if an entity (IP or device ID) is currently in the 5-hour ban list.
 */
async function checkActiveBan(key: string): Promise<{ isBanned: boolean; retryAfter: number; reason?: string }> {
  const now = Date.now();

  // Check Upstash Redis first if configured
  if (redis) {
    try {
      const banReason = await redis.get<string>(`ban:${key}`);
      if (banReason) {
        const ttlMs = await redis.pttl(`ban:${key}`);
        const retryAfter = Math.max(1, Math.ceil(ttlMs / 1000));
        return { isBanned: true, retryAfter, reason: banReason };
      }
    } catch (err) {
      console.warn("Upstash Redis checkActiveBan error:", err);
    }
  }

  // Check In-Memory Store
  const ban = bannedEntities.get(key);
  if (ban && ban.expiresAt > now) {
    const retryAfter = Math.max(1, Math.ceil((ban.expiresAt - now) / 1000));
    return { isBanned: true, retryAfter, reason: ban.reason };
  } else if (ban && ban.expiresAt <= now) {
    bannedEntities.delete(key);
  }

  return { isBanned: false, retryAfter: 0 };
}

/**
 * Applies a 5-hour harsh ban to a detected bot or automated attacker.
 */
async function applyHarshBotBan(key: string, reason: string): Promise<number> {
  const now = Date.now();
  const banDurationMs = RATE_LIMIT_CONFIG.BOT_BAN_MS;
  const expiresAt = now + banDurationMs;
  const retryAfter = RATE_LIMIT_CONFIG.BOT_BAN_SECONDS;

  // Persist to Upstash Redis if configured
  if (redis) {
    try {
      await redis.set(`ban:${key}`, reason, { px: banDurationMs });
    } catch (err) {
      console.warn("Upstash Redis applyHarshBotBan error:", err);
    }
  }

  // Persist to in-memory ban store
  bannedEntities.set(key, { expiresAt, reason });
  return retryAfter;
}

/**
 * Redis-based sliding window rate check using sorted sets or atomic counters.
 */
async function checkRedisSlidingLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfter: number; count: number }> {
  if (!redis) return { allowed: true, retryAfter: 0, count: 0 };
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    pipeline.zcard(key);
    pipeline.pexpire(key, windowMs + 1000);

    const results = await pipeline.exec<[number, number, number, number]>();
    const count = results[2] as number;

    if (count > limit) {
      const oldestEntries = await redis.zrange(key, 0, 0, { withScores: true });
      const oldestScore =
        oldestEntries && oldestEntries.length > 1
          ? Number(oldestEntries[1])
          : windowStart;
      const retryAfter = Math.max(
        1,
        Math.ceil((oldestScore + windowMs - now) / 1000)
      );
      return { allowed: false, retryAfter, count };
    }

    return { allowed: true, retryAfter: 0, count };
  } catch (err) {
    console.warn("Upstash Redis error in abuse protection, falling back:", err);
    return { allowed: true, retryAfter: 0, count: 0 };
  }
}

/**
 * In-memory sliding window rate check.
 */
function checkMemorySlidingLimit(
  key: string,
  burstLimit: number,
  burstWindowMs: number,
  minuteLimit: number,
  minuteWindowMs: number,
  dailyLimit: number,
  dailyWindowMs: number
): { allowed: boolean; retryAfter: number; reason?: string; burstCount: number; minuteCount: number } {
  const now = Date.now();
  let item = memoryStore.get(key);

  if (!item) {
    item = { burst: [], minute: [], daily: [] };
    memoryStore.set(key, item);
  }

  // 1. Check Burst
  item.burst = item.burst.filter((t) => t > now - burstWindowMs);
  item.burst.push(now);
  const burstCount = item.burst.length;

  if (burstCount > burstLimit) {
    const retryAfter = Math.max(
      1,
      Math.ceil((item.burst[0] + burstWindowMs - now) / 1000)
    );
    return {
      allowed: false,
      retryAfter,
      reason: "Burst rate limit exceeded. Please wait.",
      burstCount,
      minuteCount: item.minute.length,
    };
  }

  // 2. Check Minute Window
  item.minute = item.minute.filter((t) => t > now - minuteWindowMs);
  item.minute.push(now);
  const minuteCount = item.minute.length;

  if (minuteCount > minuteLimit) {
    const retryAfter = Math.max(
      1,
      Math.ceil((item.minute[0] + minuteWindowMs - now) / 1000)
    );
    return {
      allowed: false,
      retryAfter,
      reason: "Per-minute rate limit reached.",
      burstCount,
      minuteCount,
    };
  }

  // 3. Check Daily Quota
  item.daily = item.daily.filter((t) => t > now - dailyWindowMs);
  item.daily.push(now);

  if (item.daily.length > dailyLimit) {
    const retryAfter = Math.max(
      1,
      Math.ceil((item.daily[0] + dailyWindowMs - now) / 1000)
    );
    return {
      allowed: false,
      retryAfter,
      reason: "Daily message quota reached.",
      burstCount,
      minuteCount,
    };
  }

  return { allowed: true, retryAfter: 0, burstCount, minuteCount };
}

/**
 * Comprehensive Abuse Protection & Multi-Tiered Rate Limiting for Chat API:
 * - Real Genuine Users: Standard rate limits (8 req / 1 min, 25 req / day) with gentle 60s/daily resets.
 * - Bots & Automated Attacks: Harsh 5-hour ban (18,000s) on scrapers, token tampering, burst spam, and IP floods.
 */
export async function checkChatAbuseAndLimits(
  req: Request,
  providedVisitorId?: string | null
): Promise<AbuseCheckResult> {
  const userAgent = req.headers.get("user-agent");
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const headerVisitorId = req.headers.get("x-visitor-id");
  const visitorId = (headerVisitorId || providedVisitorId || "").trim();
  const effectiveDeviceId = isValidVisitorId(visitorId)
    ? `fp:${visitorId}`
    : `anon_ip:${ip}`;

  // ─── STEP 1: Check Active 5-Hour Harsh Ban List ───
  const ipBan = await checkActiveBan(`ip:${ip}`);
  if (ipBan.isBanned) {
    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter: ipBan.retryAfter,
      reason: ipBan.reason || "Automated attack / bot ban active (5 hours).",
    };
  }

  const deviceBan = await checkActiveBan(effectiveDeviceId);
  if (deviceBan.isBanned) {
    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter: deviceBan.retryAfter,
      reason: deviceBan.reason || "Automated attack / bot ban active (5 hours).",
    };
  }

  // ─── STEP 2: Bot & Scraper User-Agent Detection (5-Hour Penalty) ───
  if (detectBotUserAgent(userAgent)) {
    const banReason = "Automated scraper or bot user-agent detected.";
    const retryAfter = await applyHarshBotBan(`ip:${ip}`, banReason);
    await applyHarshBotBan(effectiveDeviceId, banReason);

    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter,
      reason: banReason,
    };
  }

  // ─── STEP 3: Tampered / Malformed Token Detection (5-Hour Penalty) ───
  if (visitorId && !isValidVisitorId(visitorId)) {
    const banReason = "Tampered / forged device fingerprint token detected.";
    const retryAfter = await applyHarshBotBan(`ip:${ip}`, banReason);

    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter,
      reason: banReason,
    };
  }

  // ─── STEP 4: Distributed Upstash Redis Check (if configured) ───
  if (hasUpstash && redis) {
    // 4a. Burst limit
    const burstRes = await checkRedisSlidingLimit(
      `ratelimit:burst:${effectiveDeviceId}`,
      RATE_LIMIT_CONFIG.BURST_MAX_REQUESTS,
      RATE_LIMIT_CONFIG.BURST_WINDOW_MS
    );
    if (!burstRes.allowed) {
      // If burst exceeds flood threshold (4+ requests in 5s), escalate to harsh 5-hour ban!
      if (burstRes.count >= RATE_LIMIT_CONFIG.BURST_ATTACK_THRESHOLD) {
        const attackReason = "Automated burst flood attack detected.";
        const retryAfter = await applyHarshBotBan(`ip:${ip}`, attackReason);
        await applyHarshBotBan(effectiveDeviceId, attackReason);
        return {
          allowed: false,
          status: 429,
          message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
          retryAfter,
          reason: attackReason,
        };
      }

      // Normal genuine user fast double-click (5s cooldown)
      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter: burstRes.retryAfter,
        reason: "Burst rate limit exceeded. Please wait a moment.",
      };
    }

    // 4b. Device minute limit (genuine user: 8 req / min -> 60s cooldown)
    const deviceMinRes = await checkRedisSlidingLimit(
      `ratelimit:device:${effectiveDeviceId}`,
      RATE_LIMIT_CONFIG.DEVICE_MAX_REQUESTS,
      RATE_LIMIT_CONFIG.DEVICE_WINDOW_MS
    );
    if (!deviceMinRes.allowed) {
      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter: deviceMinRes.retryAfter,
        reason: "Device rate limit reached (60s cooldown).",
      };
    }

    // 4c. Device daily quota (genuine user: 25 req / day -> 24h reset)
    const deviceDailyRes = await checkRedisSlidingLimit(
      `ratelimit:daily:${effectiveDeviceId}`,
      RATE_LIMIT_CONFIG.DEVICE_DAILY_MAX_REQUESTS,
      RATE_LIMIT_CONFIG.DEVICE_DAILY_WINDOW_MS
    );
    if (!deviceDailyRes.allowed) {
      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter: deviceDailyRes.retryAfter,
        reason: "Daily device message limit reached (24h reset).",
      };
    }

    // 4d. IP level limit
    const ipRes = await checkRedisSlidingLimit(
      `ratelimit:ip:${ip}`,
      RATE_LIMIT_CONFIG.IP_MAX_REQUESTS,
      RATE_LIMIT_CONFIG.IP_WINDOW_MS
    );
    if (!ipRes.allowed) {
      // If IP exceeds 20 requests/min (automated multi-tab flood attack), escalate to 5-hour ban!
      if (ipRes.count >= RATE_LIMIT_CONFIG.IP_ATTACK_THRESHOLD) {
        const attackReason = "Automated high-frequency IP flood attack detected.";
        const retryAfter = await applyHarshBotBan(`ip:${ip}`, attackReason);
        return {
          allowed: false,
          status: 429,
          message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
          retryAfter,
          reason: attackReason,
        };
      }

      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter: ipRes.retryAfter,
        reason: "IP rate limit reached.",
      };
    }

    return {
      allowed: true,
      status: 200,
      message: "OK",
      retryAfter: 0,
    };
  }

  // ─── STEP 5: In-Memory Sliding Window Check ───
  const deviceCheck = checkMemorySlidingLimit(
    effectiveDeviceId,
    RATE_LIMIT_CONFIG.BURST_MAX_REQUESTS,
    RATE_LIMIT_CONFIG.BURST_WINDOW_MS,
    RATE_LIMIT_CONFIG.DEVICE_MAX_REQUESTS,
    RATE_LIMIT_CONFIG.DEVICE_WINDOW_MS,
    RATE_LIMIT_CONFIG.DEVICE_DAILY_MAX_REQUESTS,
    RATE_LIMIT_CONFIG.DEVICE_DAILY_WINDOW_MS
  );

  if (!deviceCheck.allowed) {
    // If burst attack is detected (4+ rapid requests in 5s), escalate to 5-hour harsh ban!
    if (deviceCheck.burstCount >= RATE_LIMIT_CONFIG.BURST_ATTACK_THRESHOLD) {
      const attackReason = "Automated burst flood attack detected.";
      const retryAfter = await applyHarshBotBan(`ip:${ip}`, attackReason);
      await applyHarshBotBan(effectiveDeviceId, attackReason);

      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter,
        reason: attackReason,
      };
    }

    // Normal genuine user limit (60s cooldown for minute limit, 24h for daily quota, 5s for burst)
    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter: deviceCheck.retryAfter,
      reason: deviceCheck.reason,
    };
  }

  // In-memory IP level check
  const ipCheck = checkMemorySlidingLimit(
    `ip:${ip}`,
    RATE_LIMIT_CONFIG.BURST_MAX_REQUESTS + 1,
    RATE_LIMIT_CONFIG.BURST_WINDOW_MS,
    RATE_LIMIT_CONFIG.IP_MAX_REQUESTS,
    RATE_LIMIT_CONFIG.IP_WINDOW_MS,
    RATE_LIMIT_CONFIG.IP_MAX_REQUESTS * 4,
    RATE_LIMIT_CONFIG.DEVICE_DAILY_WINDOW_MS
  );

  if (!ipCheck.allowed) {
    // If IP attempts 20+ requests / min (automated scraper / flooding), escalate to 5-hour harsh ban!
    if (ipCheck.minuteCount >= RATE_LIMIT_CONFIG.IP_ATTACK_THRESHOLD) {
      const attackReason = "Automated high-frequency IP flood attack detected.";
      const retryAfter = await applyHarshBotBan(`ip:${ip}`, attackReason);

      return {
        allowed: false,
        status: 429,
        message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
        retryAfter,
        reason: attackReason,
      };
    }

    return {
      allowed: false,
      status: 429,
      message: RATE_LIMIT_CONFIG.RATE_LIMIT_MESSAGE,
      retryAfter: ipCheck.retryAfter,
      reason: "IP rate limit exceeded.",
    };
  }

  return {
    allowed: true,
    status: 200,
    message: "OK",
    retryAfter: 0,
  };
}
