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
    fontFamily: "var(--font-instrument-serif), serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
  body:
    fontFamily: "var(--font-ibm-plex-mono), monospace"
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

**Display Font:** Instrument Serif (with fallback serif)
**Body Font:** IBM Plex Mono (with fallback monospace)

### Hierarchy
- **Display** (weight: 400, size: text-6xl to text-9xl, font: serif): Hero header hierarchy and title highlights.
- **Headline** (weight: 400, size: text-4xl to text-6xl, font: serif): Major page section titles.
- **Body** (weight: 400, size: 14px, font: mono): Default text block.
- **Label** (weight: 500, size: 12px, font: mono): Secondary metadata and buttons.

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
