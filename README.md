# PadelJKT FS Engine

**PadelJKT FS Engine** is a **feasibility and ROI modeling tool** for padel clubs.
It helps **landowners, operators, and investors** quickly test site assumptions, compare business scenarios, and generate board-ready financial reports — without spreadsheets or guesswork. Written by Kolabs.Design (Doddy Samiaji with researchers/designers from HDA: Dwi Anjani, Anita Septafiani, Annisha Ayuningdiah.
👉 [Live Demo (Vercel)](https://padeljkt-sept05.vercel.app/simulator/sample)

---

## 🎯 Problem & Goal

Padel is booming, but planning a new club is risky:

* How many courts fit on a given site?
* What ROI can be expected with certain fees, occupancy, and F\&B strategy?
* How long until the investment pays back?
* How do we compare multiple sites side-by-side?
* How do we communicate results to investors in a clear, board-ready format?

**Traditional approach:** messy spreadsheets, hard to visualize, error-prone.
**PadelJKT FS Engine’s goal:** provide a **fast, visual, reliable tool** for feasibility and ROI modeling that reduces risk and accelerates decisions.

---

## ✅ What It Does

* **Capture assumptions**: site & land ratios, courts, revenues, CAPEX, OPEX.
* **Compute outcomes**: EBITDA, ROI, payback years, feasibility guardrails.
* **Visualize instantly**:

  * ROI vs Courts curve
  * Payback timeline (breakeven marker)
  * Scenario comparison (CAPEX/OPEX/Revenue + outcomes)
* **Manage scenarios**: save multiple projects locally; compare 2–3 side-by-side.
* **Export**: board-ready **PDF** and **XLS** with formulas for further work.
* **Share**: encoded links for quick scenario sharing.

---

## 🖼 Screenshots

(Add 2–3 screenshots here: main dashboard, charts, PDF export preview)

---

## 🚀 Quickstart

**Prerequisites:** Node 20+, pnpm (via Corepack)

```bash
corepack enable
pnpm install
pnpm dev
# open http://localhost:3000
```

Production build:

```bash
pnpm build
pnpm start
```

---

## 🛠 Tech Stack

* **Frontend**: Next.js App Router, React 18, TypeScript
* **State**: Zustand (persist + hydration guards)
* **UI**: Tailwind CSS, custom tokens (dark + padel-green theme)
* **Charts**: Recharts
* **Exports**: jsPDF + html2canvas (PDF), ExcelJS (XLS)
* **Hosting**: Vercel

---

## 📂 Project Structure

```
app/                  # Next.js routes (simulator, API exports)
components/           # UI + chart components
lib/                  # calc engine, formatting, store, pdf generator
public/               # static assets (logo, images)
styles/               # Tailwind + tokens
types/                # domain types
```

---

## 📊 Domain Model & Calculators

* ROI vs Courts considers land efficiency (\~250 sqm/court).
* CAPEX includes working capital, branding, fit-outs.
* OPEX feeds into EBITDA and ROI/payback.
* Results surfaced as `charts.roiVsCourts`, `charts.bepTimeline`, `charts.bepYear`.

---

## 📈 Charts & Reports

* **ROI vs Courts**: peak annotation, current marker.
* **Payback Timeline**: cumulative EBITDA, breakeven line.
* **Scenario Comparison**: CAPEX/OPEX/Revenue (plus ROI & Payback).

Exports:

* **PDF**: A4, light theme, auto-paginated, charts in monochrome.
* **XLS**: workbook with formulas (ExcelJS).

---

## 🎨 Design System

* **Colors**: dark ink palette + padel-green accent
* **Typography**: Inter/system stack, high contrast for board-ready outputs
* **Components**: SectionHeading with accent keyline, AppHeader with branding

---

## 🌐 Deployment

* Vercel → main branch auto-deploy
* Build notes:

  * `next.config.mjs` cleaned (no deprecated appDir)
  * Tailwind glob fixed (`./styles/**/*.css`)
  * PDF route runs in Node runtime

---

## 🐛 Troubleshooting

* **Duplicate scenarios on refresh** → fixed via hydration-aware seeding in Zustand store.
* **Blurry charts in PDF** → html2canvas scale ≥ 2.
* **pnpm lock issues** → `.npmrc` disables frozen lockfile on CI.

---

## ⚠️ Notes

* Persistence is client-side (localStorage); no backend DB.
* Share links encode scenarios in the URL.
* Results are **directional models** only — validate assumptions per site.

---

## 🏷 Branding

Default logo path: `public/logo.png`.
Replace with your **Kolabs.Design** or partner logo; it will appear in the header + PDF exports.

---

