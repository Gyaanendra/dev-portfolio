---
name: Gyanendra Prakash Portfolio
description: Minimalist developer portfolio
colors:
  primary: "#00a65a"
  primary-dark: "#00ff88"
  neutral-bg: "#fcfcfc"
  neutral-bg-dark: "#0a0a0a"
  neutral-fg: "#111111"
  neutral-fg-dark: "#f0f0f0"
  border: "#e5e5e5"
  border-dark: "#1f1f1f"
typography:
  display:
    fontFamily: "var(--font-trt-interval), 'TRT INTERVAL', monospace"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
  body:
    fontFamily: "var(--font-trt-interval), 'TRT INTERVAL', monospace"
    fontSize: "14px"
rounded:
  sm: "2px"
spacing:
  sm: "8px"
  md: "16px"
---

# Design System: Gyanendra Prakash Portfolio

## 1. Overview

**Creative North Star: "The Editorial Sanctuary"**

This visual system features high-contrast layouts, fine lines, structural typography, and strict spacing constraints. It uses monospaced elements for structured data and a serif style for headings.

**Key Characteristics:**
- High-contrast background/foreground values
- Serif display headers matched with monospace body typography
- Fine borders (1px solid) without shadows
- Direct state transition animations (active: scale(0.97))

## 2. Colors

A high-contrast neutral layout punctuated by a single neon green/emerald green accent color.

### Primary
- **Emerald Green (Light)** (#00a65a): Applied to active navigation items, text highlights, and borders.
- **Neon Green (Dark)** (#00ff88): High-contrast accent for dark-mode text highlights and borders.

### Neutral
- **Background Light** (#fcfcfc): Very light grey for background.
- **Background Dark** (#0a0a0a): Deep black for background.
- **Foreground Light** (#111111): Body text in light mode.
- **Foreground Dark** (#f0f0f0): Body text in dark mode.

### Named Rules
**The Single-Accent Rule.** Only the accent color (emerald/neon green) is used for visual highlights. No other colored accents (red, blue, purple) are permitted.

## 3. Typography

**Exclusive Font:** TRT INTERVAL Monospace (`var(--font-trt-interval), 'TRT INTERVAL', monospace`).
All UI elements, section headings, display titles, numbers, labels, and body text exclusively use the provided `TRT INTERVAL Monospace` font.

### Hierarchy
- **Display / Headings** (weight: 700 / 500, size: text-5xl to text-6xl, font: mono): Major section titles (`01 / About`, `02 / Skills`, `03 / Experience`, `04 / Code Profiles`, `05 / Projects`, `06 / Contact`).
- **Body** (weight: 400, size: 14px, font: mono): Default text blocks and descriptions.
- **Label** (weight: 500, size: 12px, font: mono): Slashed links, metadata, and badges.

## 4. Elevation

The design is strictly flat. It rejects heavy box shadows to prioritize crisp lines and print-like layouts.

### Named Rules
**The Shadow Prohibition.** Box shadows are not allowed on cards or standard containers. Spacing and thin borders are the sole dividers of sections.

## 5. Components

### Buttons
- **Shape:** Rectangular (2px rounded radius)
- **Interactive:** CSS transitions on active state (scale(0.97)).

### Cards / Containers
- **Shape:** Rectangular (2px rounded)
- **Background:** `--card-bg` (#ffffff in light, #111111 in dark)
- **Border:** 1px solid border custom.

## 6. Do's and Don'ts

### Do:
- **Do** preserve the monochrome-editorial aesthetics.
- **Do** keep text alignments aligned to structural grid margins.

### Don't:
- **Don't** use multi-color gradient accents.
- **Don't** apply round corners with radius > 8px.
- **Don't** use box-shadow with blur > 8px alongside a border.
