## PadelJKT FS Engine

Predictive ROI and feasibility modeling for padel clubs. Operators and investors can model site assumptions, compare scenarios, and export board‑ready reports (PDF/XLS) in seconds.

Live stack: Next.js App Router + TypeScript + Tailwind + Zustand + Recharts + jsPDF + ExcelJS.

—

## Contents

- What it does
- Demo screenshots (optional)
- Quickstart
- Development & scripts
- Project structure
- Domain model & calculators
- Charts & exports
- Design system
- Deployment (Vercel)
- Troubleshooting

—

## What it does

- Capture site & ratios, courts, revenues, CAPEX/OPEX inputs.
- Compute EBITDA, ROI, payback; guardrails for feasibility.
- Manage multiple scenarios (localStorage); compare 2–3 side‑by‑side.
- Visualize: ROI vs Courts, Payback Timeline, Scenario Compare.
- Export: PDF (board‑ready, light theme, grayscale charts) and XLS (formulas).

—

## Quickstart

Prereqs: Node 20+, pnpm via Corepack.

```
corepack enable
pnpm i
pnpm dev
# open http://localhost:3000
```

Production run:

```
pnpm build
pnpm start
```

—

## Development & scripts

Common scripts:

```
pnpm dev            # local dev (Next.js)
pnpm build          # production build
pnpm start          # serve .next
pnpm typecheck      # TS only
```

Codespaces: open the repo → dependencies install automatically via devcontainer. 

—

## Project structure

```
app/
  page.tsx                             # redirects to simulator
  api/export/pdf/route.ts              # minimal server pdf route (Node runtime)
  api/export/xls/route.ts              # XLS (ExcelJS)
  simulator/[projectId]/page.tsx       # main simulator
components/
  charts/*                             # Recharts components
  ui/AppHeader.tsx                     # unified header
  ui/SectionHeading.tsx                # section headers w/ keyline
  forms/*                              # Site, Courts, Revenue, CAPEX, OPEX forms
  inputs/*                             # MoneyInput, RatioSliders
lib/
  calc/model.ts                        # pure calculation engine
  calc/presets.ts                      # sample scenario preset
  format/currency.ts                   # IDR short units (rb/jt/M)
  format/format.ts                     # formatIDR/formatPct/formatYears helpers
  pdf/Report.tsx                       # board-ready PDF report component (light theme)
  pdf/generate.tsx                     # html2canvas + jsPDF pipeline (off-screen render)
  store/scenarioStore.ts               # Zustand store (persist + hydration guards)
  util/share.ts                        # share-link encode/decode (?s=<b64url>)
styles/theme.css                       # tokens & utilities
tailwind.config.ts                     # design tokens (ink/text/accent)
```

—

## Domain model & calculators

Core types: `lib/types.ts`

Key functions: `lib/calc/model.ts`

- ROI vs Courts data respects land capacity (≈250 sqm/court) derived from `siteArea * courtsPct`.
- OPEX preview feeds working capital in CAPEX; final EBITDA computed after OPEX.
- Results include `charts.roiVsCourts`, `charts.bepTimeline`, `charts.bepYear`.

—

## Charts & exports

Charts (Recharts):

- ROI vs Courts: peak annotation, current marker; dark UI styles.
- Payback Timeline: cumulative cash flow with breakeven marker.
- Scenario Comparison: CAPEX/OPEX/Revenue bars (+ optional ROI/Payback outcomes).

PDF (client, off‑screen render):

- `lib/pdf/generate.tsx` renders `lib/pdf/Report.tsx` at 1240px width, scale=2–3.
- A4 portrait, margins L/R 24mm, T/B 20mm; auto‑paginated.
- Light theme for print; charts in monochrome on white background.

XLS (ExcelJS):

- `app/api/export/xls/route.ts` returns a workbook with formulas.

—

## Design system

Tailwind tokens (`tailwind.config.ts`):

- `ink.950/900/800/700/600` — backgrounds
- `text.hi/base/mut` — type scales
- `accent.400/500/600` — padel green family
- `borders.default`, `gridlines.default`

Section headings use `components/ui/SectionHeading.tsx` with a subtle accent keyline.

—

## Deployment (Vercel)

Vercel preset: Next.js.

Build tips captured in repo:

- `next.config.mjs` has no deprecated `experimental.appDir`.
- Tailwind content globs include `./styles/**/*.css`.
- PDF route uses Node runtime; jsPDF dashed lines via `setLineDashPattern`.
- `.npmrc` sets `prefer-frozen-lockfile=false` (unblocks CI if lockfile lags).

—

## Troubleshooting

- Duplicate scenarios on refresh: fixed via hydration‑aware seeding `lib/store/scenarioStore.ts` (`hasHydrated`, `hasSeeded`).
- Vercel frozen lockfile error: either run `pnpm i` locally to refresh `pnpm-lock.yaml`, or rely on `.npmrc` which disables frozen installs in CI.
- Charts blurry in PDF: html2canvas scale is ≥2; ensure browser allows sufficient memory.

—

## Notes

- Persistence: localStorage (no backend). Share links encode scenarios in the URL (`?s=...`).
- This model is directional; validate assumptions per site.


## Branding

- Place your Kolabs.Design logo at `public/logo.png` (recommended PNG, white on transparent). The header and PDF export will pick it up automatically.
