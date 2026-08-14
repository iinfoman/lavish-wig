---
name: extract-design
description: "Extract the full design language from any website URL. Produces 8 output files including AI-optimized markdown, visual HTML preview, Tailwind config, React theme, shadcn/ui theme, Figma variables, W3C design tokens, and CSS variables. Also runs WCAG accessibility scoring. Use when user says 'extract design', 'get design system', 'design language', 'design tokens', 'what colors/fonts does this site use', or '/extract-design'."
allowed-tools: Bash, Read, Write, Glob
---

# Extract Design Language

Extract the complete design language from any website URL. Generates 8 output files covering colors, typography, spacing, shadows, components, breakpoints, animations, and accessibility.

> **Provenance and version pin.** This is third-party tooling — the `designlang`
> project (github.com/Manavarya09/design-extract), MIT licensed, vendored here
> from npm. Every command below is pinned to `designlang@12.21.0` because that
> is the release whose source was reviewed. Do not drop the version pin: bare
> `npx designlang` resolves to whatever is latest at run time, which is not the
> reviewed code.
>
> **Never point this at a signed-in page.** Its artifacts capture page content —
> copy, prices, contact details, and screenshots — not just design tokens. Run
> it against public pages only. `design-extract-output/` is gitignored so its
> output cannot be committed by accident; keep it that way.

## Prerequisites

Ensure `designlang` is available. Install if needed:

```bash
npm install -g designlang@12.21.0
```

Or use npx (no install required):

```bash
npx designlang@12.21.0 <url>
```

## Process

1. **Run the extraction** on the provided URL:

```bash
npx designlang@12.21.0 <url> --screenshots
```

For multi-page crawling: `npx designlang@12.21.0 <url> --depth 3 --screenshots`
For dark mode: `npx designlang@12.21.0 <url> --dark --screenshots`

2. **Read the generated markdown file** to understand the design:

```bash
cat design-extract-output/*-design-language.md
```

3. **Present key findings** to the user:
   - Primary color palette with hex codes
   - Font families in use
   - Spacing system (base unit if detected)
   - WCAG accessibility score
   - Component patterns found
   - Notable design decisions (shadows, radii, etc.)

4. **Offer next steps:**
   - Copy `*-tailwind.config.js` into their project
   - Import `*-variables.css` into their stylesheet
   - Paste `*-shadcn-theme.css` into globals.css for shadcn/ui users
   - Import `*-theme.js` for React/CSS-in-JS projects
   - Import `*-figma-variables.json` into Figma for designer handoff
   - Open `*-preview.html` in a browser for a visual overview
   - Use the markdown file as context for AI-assisted development

## Output Files (8)

| File | Purpose |
|------|---------|
| `*-design-language.md` | AI-optimized markdown — the full design system for LLMs |
| `*-preview.html` | Visual HTML report with swatches, type scale, shadows, a11y |
| `*-design-tokens.json` | W3C Design Tokens format |
| `*-tailwind.config.js` | Ready-to-use Tailwind CSS theme |
| `*-variables.css` | CSS custom properties |
| `*-figma-variables.json` | Figma Variables import format |
| `*-theme.js` | React/CSS-in-JS theme object |
| `*-shadcn-theme.css` | shadcn/ui theme CSS variables |

## Additional Commands

- **Compare two sites:** `npx designlang@12.21.0 diff <urlA> <urlB>`
- **View history:** `npx designlang@12.21.0 history <url>`

## Options

| Flag | Description |
|------|-------------|
| `--out <dir>` | Output directory (default: `./design-extract-output`) |
| `--dark` | Also extract dark mode color scheme |
| `--depth <n>` | Crawl N internal pages for site-wide extraction |
| `--screenshots` | Capture component screenshots (buttons, cards, nav) |
| `--wait <ms>` | Wait time after page load for SPAs |
| `--framework <type>` | Generate only specific theme (`react` or `shadcn`) |
