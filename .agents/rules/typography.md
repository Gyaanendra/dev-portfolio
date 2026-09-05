# Typography Rule: Exclusive Provided Monospace Font

The ONLY font permitted on this website is the provided local monospace font:
**`TRT INTERVAL Monospace`** (located in `/public/trt-interval-monospace/`).

### Guidelines:
1. **No External Fonts**: Space Grotesk, Titillium Web, Inter, and browser serif/sans fonts are disallowed.
2. **Unified CSS Mapping**:
   In `app/globals.css`, `--font-serif`, `--font-sans`, `--font-titillium`, and `--font-mono` must all resolve strictly to:
   `var(--font-trt-interval), 'TRT INTERVAL', monospace`
3. **Uniform Numbered Section Headings**:
   All primary section titles must follow the exact uniform pattern:
   - `01 / About`
   - `02 / Skills`
   - `03 / Experience`
   - `04 / Code Profiles`
   - `05 / Projects`
   - `06 / Contact`
   Each using `font-serif text-5xl md:text-6xl tracking-tight text-foreground` with `border-b border-border-custom pb-4`.
