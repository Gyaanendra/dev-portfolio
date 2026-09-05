# AGENTS.md — Developer & AI Agent Guidelines

## 1. Typography & Font System (MANDATORY RULE)

> [!IMPORTANT]
> **Exclusive Monospace Font Policy**: The ONLY font to be used anywhere on this website is the provided local font:
> **`TRT INTERVAL Monospace`** (located at `/public/trt-interval-monospace/`).
> 
> - **DO NOT** use Google Fonts, generic system fonts, or external serif/sans fonts (such as Inter, Space Grotesk, Roboto, Titillium Web, etc.) for any UI element, heading, button, or body copy.
> - In `globals.css`, all font tokens (`--font-serif`, `--font-sans`, `--font-titillium`, `--font-mono`) MUST resolve to `var(--font-trt-interval), 'TRT INTERVAL', monospace`.
> - All section headings across the website must be strictly uniform in style:
>   `01 / About`, `02 / Skills`, `03 / Experience`, `04 / Code Profiles`, `05 / Projects`, `06 / Education`, `07 / Leadership`, `08 / Achievements`, `09 / Contact`.
>   Using `font-serif text-5xl md:text-6xl tracking-tight text-foreground` with a clean bottom hairline divider (`border-b border-border-custom pb-4`).

---

## 2. Color System & Accents

- **Base Palette**: Strict monochromatic palette:
  - Deep Black (`#000000`)
  - Neutral Grey (`#9C9C9C` / `#b0b0b0`)
  - Crisp White (`#ffffff`)
- **Vibrant Blue Accent**:
  - Dark Mode: `#00D2FF` (100% saturated electric cyan-blue)
  - Light Mode: `#0080FF` (high-contrast electric azure blue)
  - All interactive elements, glow rings, active states, and links must reference `var(--accent)` or Tailwind's `text-accent`, `border-accent`, `bg-accent`.

---

## 3. Layout Philosophy

- **No Unnecessary Card/Box Framing**:
  - Main sections (`Hero`, `Contact`, `About`, etc.) must flow naturally and directly on the website canvas without being boxed into heavy artificial card containers.
  - Section dividers should be minimalist hairlines (`1px border-border-custom`).

---

## 4. Cursor & Accessibility

- Use standard native operating system mouse cursors (`cursor: default` on canvas, `cursor: pointer` on interactive items).
- Never hide the system cursor (`cursor: none` is forbidden).
