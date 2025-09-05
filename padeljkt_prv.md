# PadelJKT — Business & Financial Simulator 1.0

**Version:** v0.9 by Kolabs.Design × HDA × AIM\
**Tagline:** Predictive design and yield analysis for padel & lifestyle venue developers.

---

## 0) One-liner

A minimalist, dark-themed decision engine (with padel-green accents) that converts land, design, and operating assumptions into ROI, BEP, and scenario comparisons — exportable to PDF/XLS.

---

## 1) User goals (ranked)

1. Understand feasibility fast (ROI/BEP at a glance).
2. Tweak assumptions safely (guardrails + explainers).
3. Compare scenarios (2–5 side-by-side).
4. Export boardroom-ready outputs (PDF; XLS).
5. Save/share and reload later.

---

## 2) Personas

- **Landowner/Developer (primary):** business-savvy, not a finance pro. Wants payback clarity.
- **Ops/GM (secondary):** adjusts OPEX and pricing.
- **Investor/CFO (tertiary):** sanity-checks assumptions, needs XLS.

---

## 3) Core user journey (end-to-end)

1. **Welcome** → concise “what/why/how” + “Try sample case” button.
2. **Create Project** → Name, location (picker/map), land area (sqm).
3. **Layout & Ratios** → Autocomplete suggested land-use split with sliders (courts %, parking %, F&B/Retail %, circulation %).
4. **Courts Module** → #courts, indoor/semi/outdoor, occupancy slider, hourly rate.
5. **Revenue Modules** → Membership, Events, F&B, Retail.
6. **Cost Modules** → CAPEX (land, build, fit-out, branding, WC) and OPEX (staff, utilities, maintenance, marketing, lease, taxes).
7. **Results** → Summary tiles (CAPEX, OPEX, Revenue, EBITDA, ROI, Payback) + Charts.
8. **Scenario Manager** → Duplicate → tweak → Compare.
9. **Export** → “Board PDF” and **XLS**.
10. **Save/Share** → persist to cloud; share read-only link.

---

## 4) UX principles & visual system

- **Minimal dark UI**; padel-green accents only for CTAs/highlights.
- **Friendly microcopy**: “This number looks low vs market.”
- **Explain-as-you-go** tooltips; never dump a manual.
- **Safe defaults** with reason notes; user can override.
- **Red flags** if a parameter crosses risk thresholds.

**Color tokens**

- `--padel-green: #DFFF00` (accent)
- `--ink-900: #0A0A0A` (bg), `--ink-700: #151821` (elevated bg)
- `--text-100: #EDEEF0`, `--muted-300: #9AA3AE`

---

## 5) Features (MVP scope)

- Land → Ratios → Courts → Revenues → Costs → Results → Scenarios → Export.
- Preset modes: **Base**, **Optimistic**, **Conservative**.
- “Plan B” toggle showing pivot path (pickleball/event hall).

---

## 6) Domain logic (key formulas & guardrails)

### 6.1 Land, GFA & parking

```ts
calcParkingStalls(gfa:number, ratio:number){ return Math.ceil(gfa / ratio); }
calcParkingArea(stalls:number){ return stalls * 25; } // sqm gross
```

### 6.2 Courts capacity

```ts
calcCourtRevenue(cfg: CourtsConfig){
  const booked = cfg.hoursPerDay * (cfg.occupancyPct/100);
  return booked * cfg.ratePerHour * 30 * 12 * cfg.courts;
}
```

### 6.3 Other revenues

```ts
calcFnbRevenueBySqm(gfa:number, perSqmPerMonth:number){
  return gfa * perSqmPerMonth * 12;
}

calcRevenueTotal(...streams){ return streams.reduce((a,b)=>a+b,0); }
```

### 6.4 Costs

```ts
calcOpexTotal(ox: OpexInputs, gfa:number, courts:number, revenue:number){
  const staff = ox.staff.reduce((s,x)=>s + x.monthly*12, 0);
  const util = gfa * ox.utilitiesRpPerSqmPerMonth * 12;
  const maint = courts * ox.maintenanceRpPerCourtPerMonth * 12;
  const mkt = ox.marketing.method==="pctRevenue" ? revenue* (ox.marketing.pct!/100) : (ox.marketing.flat||0);
  const lease = ox.leaseAnnual||0;
  const tax  = ox.taxPct ? revenue*(ox.taxPct/100) : 0;
  return staff+util+maint+mkt+lease+tax;
}
```

### 6.5 Outputs

```ts
calcRoiEbitda(capex:number, opex:number, revenue:number){
  const ebitda = revenue - opex;
  return { ebitda, roi: ebitda/capex, paybackYears: capex / Math.max(ebitda,1) };
}
```

---

## 7) Scenario comparison

- Create Base → Duplicate → tweak.
- Compare table: CAPEX | OPEX | Revenue | EBITDA | ROI | Payback.
- Mini charts: ROI bars + Payback dots.
- Export scenario comparison.

---

## 8) PDF/XLS exports

**PDF (A4)**

- Page 1: Summary tiles + ROI chart.
- Page 2: Assumptions + Sensitivity chart.
- Page 3: Scenario comparison.

**XLS**

- Tabs: Assumptions, Calcs, Results, Scenarios, Export\_View.
- Named ranges for all inputs; clean formulas.

---

## 9) Tech design

### 9.1 Frontend

- **Next.js (App Router) + TypeScript** on **Vercel**
- **State:** Zustand (lightweight, serializable scenario objects)
- **Styling:** TailwindCSS + shadcn/ui; dark mode by default; CSS variables for tokens
- **Charts:** Recharts (simple, responsive)
- **Maps:** Mapbox GL JS (vector basemaps). Abstraction to later plug Jakarta Satu / ATR BPN.
- **Forms:** react-hook-form + zod schema validation
- **PDF:** jsPDF + html2canvas (server-rendered summary → snapshot)
- **XLS:** ExcelJS

### 9.2 Backend

- **Next.js API routes** (stateless); server actions for export assembly
- **Auth (phase 2):** NextAuth (Email/Google)
- **DB (phase 2):** PlanetScale or Neon (Postgres) for project/scenario persistence
- **Files:** Vercel Blob (optional) for stored PDFs/XLS
- **Telemetry:** PostHog (events: create\_project, change\_input, export\_pdf, export\_xls)

### 9.3 Project structure

```
/app
  /(marketing)/page.tsx       // Welcome + sample case
  /simulator
    /[projectId]/page.tsx     // Main flow (tabs/sections)
  /api/export/pdf/route.ts
  /api/export/xls/route.ts
/components
  /inputs/*                   // Sliders, money inputs, % chips
  /charts/*
  /layout/*
/lib
  /calc/*                     // pure ts functions for model math
  /schemas/*                  // zod schemas
  /pdf/*                      // server-side html → canvas helpers
  /xls/*                      // ExcelJS templates
```

---

## 10) Data model (TypeScript types)

```ts
type LandUseRatios = {
  courtsPct: number; parkingPct: number; fnbPct: number; circulationPct: number;
  stories: number; efficiency: number;
};

type CourtsConfig = {
  courts: number; indoorType: "indoor"|"semi"|"outdoor";
  occupancyPct: number; hoursPerDay: number; ratePerHour: number;
};

type RevenueInputs = {
  membership: { members: number; feeAnnual: number };
  events: { perMonth: number; fee: number };
  fnb: { method: "perSqm"|"perVisitorPct"; perSqmPerMonth?: number; visitorSpendPct?: number };
  retail?: { gfaPct?: number; rpPerSqmPerMonth?: number };
};

type CapexInputs = {
  landLease: { method:"perSqm"|"flat"; rpPerSqmPerYear?: number; years?: number; flat?: number };
  courtUnitCost: number; roofFactor: number;
  fitout: { cafe: number; locker: number };
  brandingLaunch: number; workingCapitalMonths: number;
};

type OpexInputs = {
  staff: { role: string; monthly: number }[];
  utilitiesRpPerSqmPerMonth: number;
  maintenanceRpPerCourtPerMonth: number;
  marketing: { method:"flat"|"pctRevenue"; flat?: number; pct?: number };
  leaseAnnual?: number; taxPct?: number;
};

type Scenario = {
  id: string; name: string; siteArea: number;
  ratios: LandUseRatios; courts: CourtsConfig;
  rev: RevenueInputs; capex: CapexInputs; opex: OpexInputs;
};

type Results = {
  capex: number; opex: number; revenue: number;
  ebitda: number; roi: number; paybackYears: number;
  charts: { roiVsCourts: { courts:number; roi:number }[]; };
};
```

---

## 11) Components inventory

- `<IntroHero />` — what/why/how; sample case CTA.
- `<AssumptionGroup />` — labeled surface for each module.
- `<RatioSliders />` — courts/parking/fnb/circ %.
- `<CourtsConfigForm />`, `<RevenueForm />`, `<CapexForm />`, `<OpexForm />`
- `<SummaryTiles />` — CAPEX/OPEX/Revenue/ROI/Payback.
- `<RoiSweetSpotChart />`, `<BepTimelineChart />`, `<SensitivityChart />`
- `<ScenarioManager />` — list, duplicate, compare.
- `<ExportBar />` — PDF/XLS.
- `<HelpTooltip />` — short, opinionated explainers.

---

## 12) Usability details (microcopy & defaults)

**Welcome copy:** “Model your padel club in minutes. Start from realistic defaults, then tune to match your land and strategy. Export a board-ready summary.”

**Explainers (examples):**

- Parking: “For sports + F&B, start at 1 car/50–70 sqm GFA. Each stall uses \~25 sqm gross. Local regs vary — adjust as needed.”
- Rate: “Prime Jakarta clubs range \~Rp300k–450k/hour depending on time/day; indoor premium applies.”
- Courts unit cost: “Full structure + enclosure + turf often clusters around Rp1.2–1.8B per court; indoor roof adds.”

**Risk flags:**

- Occupancy < 50% → “Below typical viability range.”
- Payback > 5 years → “Consider increasing courts or F&B contribution.”

---

## 13) Sensitivity engine (UI + math)

- Sliders for Occupancy, Rate, Land Lease, #Courts.
- Recompute EBITDA/ROI; visualize as tornado bars + ROI vs Courts line.

---

## 14) Accessibility & performance

- WCAG AA; all interactive elements keyboardable.
- Lighthouse perf ≥ 85 mobile.
- Bundle guard: charts lazy-loaded; map disabled until opened.

---

## 15) Security & privacy

- No PII.
- API keys server-side only.
- Rate-limit export endpoints.
- CSP locked to Mapbox & app origin.

---

## 16) Exports (implementation notes)

- **PDF**: server-rendered summary section → `html2canvas` → `jsPDF`.
- **XLS**: `ExcelJS` templates with named cells; freeze header rows; conditional formats for negatives.

---

## 17) Validation (acceptance criteria)

- Changing any input updates tiles & charts < 150 ms.
- Scenario duplication retains all inputs and recalculates.
- PDF exports in ≤ 5 seconds and matches on-screen numbers.
- XLS opens cleanly in Excel & Google Sheets with formulas preserved.
- Risk flags trigger at defined thresholds.
- “Sweet spot” chart updates when #courts slider moves.

---

## 18) Dev tasks

- **Milestone A — Skeleton (1–2 days):** Scaffold app, dark theme, intro screen, sample case.
- **Milestone B — Calculator & UI (2–4 days):** Calc functions, forms, tiles, charts.
- **Milestone C — Scenarios & Exports (2–3 days):** Scenario manager, PDF/XLS export, compare view.
- **Milestone D — Map & Integrations (2–3 days):** Mapbox picker, Jakarta Satu/ATR BPN stub.
- **Milestone E — Polish (1–2 days):** Risk flags, presets, telemetry.

---

## 19) ENV & deployment

- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `EXPORT_MAX_ROWS=500`
- `TELEMETRY_KEY`
- Protect `/api/export/*` with signed token.
- Vercel preview + prod deploys.

---

## 20) Extensions (post-MVP)

- Time-of-day pricing.
- Seasonality curve.
- Multi-sport pivot scenario.
- Team cost presets (Jakarta wage bands).
- i18n (EN/ID switcher).

---

## 21) Hand-off checklist

- TS types finalized; zod schemas mirror them.
- Calc functions unit tested.
- Sample scenarios JSON (2, 4, 6 courts).
- Design tokens documented.
- Sample PDF/XLS exports attached.

---

# CODE APPENDIX — PadelJKT PRV (Complete)

> This appendix collects **all code artifacts** referenced across the discussion and elevates them into concrete, build-ready stubs. Files are organized exactly as proposed in the PRV so a coding agent can scaffold and ship.

## A) Branding & Theme Tokens

``

```css
:root {
  --padel-green: #DFFF00; /* accent */
  --ink-900: #0A0A0A;     /* app bg */
  --ink-700: #151821;     /* card bg */
  --text-100: #EDEEF0;    /* primary text */
  --muted-300: #9AA3AE;   /* muted text */
  --radius: 16px;
}

html, body {
  background: var(--ink-900);
  color: var(--text-100);
}

.button-accent {
  background: var(--padel-green);
  color: #0B0B0B;
  border-radius: var(--radius);
}

.card {
  background: var(--ink-700);
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.06);
}
```

``

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0A0A0A", 700: "#151821" },
        text: { 100: "#EDEEF0" },
        muted: { 300: "#9AA3AE" },
        padel: { green: "#DFFF00" }
      },
      borderRadius: { xl: "16px", "2xl": "24px" }
    }
  },
  plugins: []
};
export default config;
```

---

## B) Data Types (TypeScript)

``

```ts
export type LandUseRatios = {
  courtsPct: number;      // % of site area for courts
  parkingPct: number;     // % of site area for parking
  fnbPct: number;         // % of site area for F&B/Retail footprint
  circulationPct: number; // % open/circulation/green
  stories: number;        // floors for F&B/Retail
  efficiency: number;     // net:gross for F&B/Retail GFA (0-1)
};

export type CourtsConfig = {
  courts: number;                         // 2,4,6...
  indoorType: "indoor"|"semi"|"outdoor"; // impacts cost
  occupancyPct: number;                   // 0-100
  hoursPerDay: number;                    // operating hours window
  ratePerHour: number;                    // Rp/hour
};

export type FnbMethod = { method: "perSqm"; perSqmPerMonth: number } | { method: "perVisitorPct"; visitorSpendPct: number };

export type RevenueInputs = {
  membership: { members: number; feeAnnual: number };
  events: { perMonth: number; fee: number };
  fnb: FnbMethod;
  retail?: { gfaPct?: number; rpPerSqmPerMonth?: number };
};

export type CapexInputs = {
  landLease: { method:"perSqm"|"flat"; rpPerSqmPerYear?: number; years?: number; flat?: number };
  courtUnitCost: number;   // per court base
  roofFactor: number;      // multiplier for semi/indoor (e.g., 1.0 outdoor, 1.15 semi, 1.35 indoor)
  fitout: { cafe: number; locker: number };
  brandingLaunch: number;  // opening marketing
  workingCapitalMonths: number; // months of opex to cover
};

export type StaffLine = { role: string; monthly: number };

export type OpexInputs = {
  staff: StaffLine[];
  utilitiesRpPerSqmPerMonth: number; // applied to GFA (F&B/Retail)
  maintenanceRpPerCourtPerMonth: number;
  marketing: { method:"flat"|"pctRevenue"; flat?: number; pct?: number };
  leaseAnnual?: number; // optional override for land lease expensed annually
  taxPct?: number;      // % of revenue
};

export type Scenario = {
  id: string;
  name: string;
  siteArea: number; // sqm
  ratios: LandUseRatios;
  courts: CourtsConfig;
  rev: RevenueInputs;
  capex: CapexInputs;
  opex: OpexInputs;
};

export type Results = {
  capex: number;
  opex: number;
  revenue: number;
  ebitda: number;
  roi: number;           // decimal (0.28 = 28%)
  paybackYears: number;
  charts: {
    roiVsCourts: { courts:number; roi:number }[];
    bepTimeline: { year:number; cumulative:number }[]; // cumulative EBITDA vs CAPEX
  };
};
```

---

## C) Zod Schemas (Validation)

``

```ts
import { z } from "zod";

export const ratiosSchema = z.object({
  courtsPct: z.number().min(0).max(100),
  parkingPct: z.number().min(0).max(100),
  fnbPct: z.number().min(0).max(100),
  circulationPct: z.number().min(0).max(100),
  stories: z.number().min(1).max(6),
  efficiency: z.number().min(0.5).max(0.95)
}).refine(r => Math.round((r.courtsPct + r.parkingPct + r.fnbPct + r.circulationPct) * 10) / 10 === 100, {
  message: "Ratios must sum to 100%"
});

export const courtsSchema = z.object({
  courts: z.number().int().min(1).max(16),
  indoorType: z.enum(["indoor","semi","outdoor"]),
  occupancyPct: z.number().min(0).max(100),
  hoursPerDay: z.number().min(1).max(24),
  ratePerHour: z.number().min(0)
});

export const revenueSchema = z.object({
  membership: z.object({ members: z.number().min(0), feeAnnual: z.number().min(0) }),
  events: z.object({ perMonth: z.number().min(0), fee: z.number().min(0) }),
  fnb: z.union([
    z.object({ method: z.literal("perSqm"), perSqmPerMonth: z.number().min(0) }),
    z.object({ method: z.literal("perVisitorPct"), visitorSpendPct: z.number().min(0).max(100) })
  ]),
  retail: z.object({ gfaPct: z.number().min(0).max(100).optional(), rpPerSqmPerMonth: z.number().min(0).optional() }).optional()
});

export const capexSchema = z.object({
  landLease: z.union([
    z.object({ method: z.literal("perSqm"), rpPerSqmPerYear: z.number().min(0), years: z.number().min(1) }),
    z.object({ method: z.literal("flat"), flat: z.number().min(0) })
  ]),
  courtUnitCost: z.number().min(0),
  roofFactor: z.number().min(0.5).max(2),
  fitout: z.object({ cafe: z.number().min(0), locker: z.number().min(0) }),
  brandingLaunch: z.number().min(0),
  workingCapitalMonths: z.number().min(0).max(24)
});

export const opexSchema = z.object({
  staff: z.array(z.object({ role: z.string(), monthly: z.number().min(0) })),
  utilitiesRpPerSqmPerMonth: z.number().min(0),
  maintenanceRpPerCourtPerMonth: z.number().min(0),
  marketing: z.union([
    z.object({ method: z.literal("flat"), flat: z.number().min(0) }),
    z.object({ method: z.literal("pctRevenue"), pct: z.number().min(0).max(100) })
  ]),
  leaseAnnual: z.number().min(0).optional(),
  taxPct: z.number().min(0).max(100).optional()
});

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  siteArea: z.number().min(0),
  ratios: ratiosSchema,
  courts: courtsSchema,
  rev: revenueSchema,
  capex: capexSchema,
  opex: opexSchema
});
```

---

## D) Calculator Engine (Pure Functions)

``

```ts
import { Scenario, Results } from "../types";

// --- Land & GFA helpers ---
export function gfaFnb(siteArea: number, ratios: { fnbPct:number; stories:number; efficiency:number }){
  const footprint = siteArea * (ratios.fnbPct/100);
  return footprint * ratios.stories * ratios.efficiency; // sqm
}

export function calcParkingStalls(gfa:number, ratio:number){
  return Math.ceil(gfa / ratio); // e.g., 1 stall per 55 sqm
}

export function calcParkingArea(stalls:number){
  return stalls * 25; // sqm gross/stall (incl. aisles)
}

// --- Revenue streams ---
export function calcCourtRevenue(cfg: Scenario["courts"]){
  const booked = cfg.hoursPerDay * (cfg.occupancyPct/100);
  return booked * cfg.ratePerHour * 30 * 12 * cfg.courts; // Rp/year
}

export function calcMembershipRevenue(members:number, feeAnnual:number){
  return members * feeAnnual; // Rp/year
}

export function calcEventsRevenue(perMonth:number, fee:number){
  return perMonth * fee * 12; // Rp/year
}

export function calcFnbRevenueBySqm(gfa:number, perSqmPerMonth:number){
  return gfa * perSqmPerMonth * 12; // Rp/year
}

export function calcFnbRevenueByVisitorPct(visitorsPerCourtHour:number, cfg: Scenario["courts"], spendPct:number, baseTicket:number){
  const booked = cfg.hoursPerDay * (cfg.occupancyPct/100) * cfg.courts; // booked hours/day across courts
  const dailyVisitors = booked * visitorsPerCourtHour;
  const annualVisitors = dailyVisitors * 30 * 12;
  return annualVisitors * baseTicket * (spendPct/100);
}

export function sum(...vals:number[]){ return vals.reduce((a,b)=>a+b,0); }

// --- CAPEX ---
export function calcLandCapex(siteArea:number, landLease: Scenario["capex"]["landLease"]){
  if(landLease.method === "flat") return landLease.flat;
  return (landLease.rpPerSqmPerYear||0) * siteArea * (landLease.years||1);
}

export function calcCourtCapex(courts:number, unit:number, roofFactor:number){
  return courts * unit * roofFactor;
}

export function calcCapexTotal(siteArea:number, sc: Scenario){
  const land = calcLandCapex(siteArea, sc.capex.landLease);
  const courts = calcCourtCapex(sc.courts.courts, sc.capex.courtUnitCost, sc.capex.roofFactor);
  const fitout = sc.capex.fitout.cafe + sc.capex.fitout.locker;
  const branding = sc.capex.brandingLaunch;
  // working capital estimated later using opex
  return { land, courts, fitout, branding, subtotal: land + courts + fitout + branding };
}

// --- OPEX ---
export function calcStaffAnnual(staff: Scenario["opex"]["staff"]){
  return staff.reduce((s,x)=> s + x.monthly*12, 0);
}

export function calcUtilitiesAnnual(gfa:number, rate:number){
  return gfa * rate * 12;
}

export function calcMaintenanceAnnual(courts:number, rate:number){
  return courts * rate * 12;
}

export function calcMarketingAnnual(method: Scenario["opex"]["marketing"]["method"], flat:number|undefined, pct:number|undefined, revenue:number){
  return method === "pctRevenue" ? revenue * ((pct||0)/100) : (flat||0);
}

export function calcOpexTotal(sc: Scenario, revenue:number, gfa:number){
  const staff = calcStaffAnnual(sc.opex.staff);
  const util = calcUtilitiesAnnual(gfa, sc.opex.utilitiesRpPerSqmPerMonth);
  const maint = calcMaintenanceAnnual(sc.courts.courts, sc.opex.maintenanceRpPerCourtPerMonth);
  const mkt = calcMarketingAnnual(sc.opex.marketing.method, sc.opex.marketing.flat, sc.opex.marketing.pct, revenue);
  const lease = sc.opex.leaseAnnual || 0;
  const tax  = sc.opex.taxPct ? revenue * (sc.opex.taxPct/100) : 0;
  return { staff, util, maint, mkt, lease, tax, total: staff+util+maint+mkt+lease+tax };
}

// --- Roll-up ---
export function calcResults(sc: Scenario): Results {
  const gfa = gfaFnb(sc.siteArea, sc.ratios);

  // Revenue streams
  const courtRev = calcCourtRevenue(sc.courts);
  const membershipRev = calcMembershipRevenue(sc.rev.membership.members, sc.rev.membership.feeAnnual);
  const eventsRev = calcEventsRevenue(sc.rev.events.perMonth, sc.rev.events.fee);
  const fnbRev = sc.rev.fnb.method === "perSqm"
    ? calcFnbRevenueBySqm(gfa, sc.rev.fnb.perSqmPerMonth)
    : calcFnbRevenueByVisitorPct(2, sc.courts, sc.rev.fnb.visitorSpendPct, 100000); // baseline visitor spend

  const revenue = sum(courtRev, membershipRev, eventsRev, fnbRev);

  // CAPEX (w/ working capital)
  const capexParts = calcCapexTotal(sc.siteArea, sc);
  const opexPreview = calcOpexTotal(sc, revenue, gfa); // for working capital months
  const workingCapital = (sc.capex.workingCapitalMonths/12) * opexPreview.total;
  const capex = capexParts.subtotal + workingCapital;

  // OPEX (final with revenue-dependent items)
  const opex = calcOpexTotal(sc, revenue, gfa).total;

  // EBITDA / ROI / Payback
  const ebitda = revenue - opex;
  const roi = capex > 0 ? (ebitda / capex) : 0;
  const paybackYears = ebitda > 0 ? (capex / ebitda) : Infinity;

  // Charts
  const roiVsCourts = Array.from({ length: 8 }, (_,i)=> i+1).map(n=>{
    const tmp = { ...sc, courts: { ...sc.courts, courts: n } } as Scenario;
    const r = calcResultsShallow(tmp);
    return { courts: n, roi: r.roi };
  });
  const bepTimeline = buildBepTimeline(capex, ebitda, 7);

  return { capex, opex, revenue, ebitda, roi, paybackYears, charts: { roiVsCourts, bepTimeline } };
}

// Lighter version used internally to avoid infinite recursion in roiVsCourts
export function calcResultsShallow(sc: Scenario){
  const gfa = gfaFnb(sc.siteArea, sc.ratios);
  const courtRev = calcCourtRevenue(sc.courts);
  const membershipRev = calcMembershipRevenue(sc.rev.membership.members, sc.rev.membership.feeAnnual);
  const eventsRev = calcEventsRevenue(sc.rev.events.perMonth, sc.rev.events.fee);
  const fnbRev = sc.rev.fnb.method === "perSqm"
    ? calcFnbRevenueBySqm(gfa, sc.rev.fnb.perSqmPerMonth)
    : calcFnbRevenueByVisitorPct(2, sc.courts, sc.rev.fnb.visitorSpendPct, 100000);
  const revenue = sum(courtRev, membershipRev, eventsRev, fnbRev);
  const capex = calcCapexTotal(sc.siteArea, sc).subtotal; // omit WC here
  const opex = calcOpexTotal(sc, revenue, gfa).total;
  const ebitda = revenue - opex;
  const roi = capex > 0 ? (ebitda / capex) : 0;
  const paybackYears = ebitda > 0 ? (capex / ebitda) : Infinity;
  return { capex, opex, revenue, ebitda, roi, paybackYears };
}

export function buildBepTimeline(capex:number, ebitda:number, years:number){
  const arr: { year:number; cumulative:number }[] = [];
  let cum = -capex;
  for(let y=1;y<=years;y++){
    cum += ebitda;
    arr.push({ year: y, cumulative: cum });
  }
  return arr;
}
```

---

## E) Scenario Utilities & Presets

``

```ts
import { Scenario } from "../types";

export function createBaseScenario(): Scenario {
  return {
    id: "sample-4-courts",
    name: "PadelJKT Sample (4 courts)",
    siteArea: 3000, // sqm
    ratios: { courtsPct: 50, parkingPct: 25, fnbPct: 15, circulationPct: 10, stories: 1, efficiency: 0.82 },
    courts: { courts: 4, indoorType: "semi", occupancyPct: 65, hoursPerDay: 14, ratePerHour: 450_000 },
    rev: {
      membership: { members: 150, feeAnnual: 5_000_000 },
      events: { perMonth: 3, fee: 15_000_000 },
      fnb: { method: "perSqm", perSqmPerMonth: 300_000 }
    },
    capex: {
      landLease: { method: "perSqm", rpPerSqmPerYear: 1_000_000, years: 1 },
      courtUnitCost: 1_500_000_000,
      roofFactor: 1.15,
      fitout: { cafe: 1_200_000_000, locker: 600_000_000 },
      brandingLaunch: 400_000_000,
      workingCapitalMonths: 6
    },
    opex: {
      staff: [
        { role: "Manager", monthly: 18_000_000 },
        { role: "Admin", monthly: 8_000_000 },
        { role: "Ops-1", monthly: 8_000_000 },
        { role: "Ops-2", monthly: 8_000_000 },
        { role: "Cafe Staff", monthly: 9_000_000 }
      ],
      utilitiesRpPerSqmPerMonth: 50_000,
      maintenanceRpPerCourtPerMonth: 3_000_000,
      marketing: { method: "pctRevenue", pct: 2 },
      leaseAnnual: 3_500_000_000,
      taxPct: 1
    }
  };
}

export function duplicateScenario(s: Scenario, overrides: Partial<Scenario> = {}): Scenario {
  return JSON.parse(JSON.stringify({ ...s, ...overrides, id: crypto.randomUUID() }));
}

export const presets = {
  base: (s: Scenario) => ({ ...s }),
  optimistic: (s: Scenario) => duplicateScenario(s, { courts: { ...s.courts, occupancyPct: s.courts.occupancyPct + 10, ratePerHour: s.courts.ratePerHour + 50_000 } }),
  conservative: (s: Scenario) => duplicateScenario(s, { courts: { ...s.courts, occupancyPct: Math.max(40, s.courts.occupancyPct - 15), ratePerHour: s.courts.ratePerHour - 50_000 } })
};
```

---

## F) Next.js Structure & Pages

**Project tree**

```
/app
  /(marketing)/page.tsx
  /simulator/[projectId]/page.tsx
/api
  /export/pdf/route.ts
  /export/xls/route.ts
/components
  /layout/Header.tsx
  /layout/SummaryTiles.tsx
  /inputs/RatioSliders.tsx
  /inputs/MoneyInput.tsx
  /charts/RoiSweetSpot.tsx
  /charts/BepTimeline.tsx
/lib
  /types.ts
  /schemas/scenario.ts
  /calc/model.ts
  /calc/presets.ts
  /xls/buildWorkbook.ts
  /pdf/buildPdf.ts
/styles/theme.css
```

``

```tsx
"use client";
import Link from "next/link";
import "@/styles/theme.css";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">PadelJKT</h1>
          <p className="text-muted-300">v0.9 by Kolabs.Design × HDA × AIM</p>
        </div>
        <div className="flex items-center gap-4 opacity-80">
          {/* Logo placeholders */}
          <span>KOLABS.DESIGN</span>
          <span>HDA</span>
          <span>AIM</span>
        </div>
      </header>

      <section className="card p-6 max-w-3xl">
        <h2 className="text-xl mb-2">Predictive design & yield analysis for padel venues</h2>
        <p className="text-sm text-muted-300 mb-6">Model your padel club in minutes. Start from realistic defaults, then tune to match your land and strategy. Export a board-ready summary.</p>
        <Link href="/simulator/sample" className="button-accent px-4 py-2 inline-block rounded-xl">Try Sample Case</Link>
      </section>
    </main>
  );
}
```

`` (skeleton)

```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { createBaseScenario } from "@/lib/calc/presets";
import { calcResults } from "@/lib/calc/model";
import type { Scenario } from "@/lib/types";

export default function SimulatorPage(){
  const [scenario, setScenario] = useState<Scenario | null>(null);
  useEffect(()=>{ setScenario(createBaseScenario()); },[]);

  const results = useMemo(()=> scenario ? calcResults(scenario) : null, [scenario]);

  if(!scenario || !results) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">PadelJKT — {scenario.name}</h1>

      {/* TODO: Replace with real forms */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="mb-2">Site & Ratios</h2>
          <div className="text-sm text-muted-300">Site Area: {scenario.siteArea.toLocaleString()} sqm</div>
          <div className="text-sm">Courts %: {scenario.ratios.courtsPct}% | Parking %: {scenario.ratios.parkingPct}% | F&B %: {scenario.ratios.fnbPct}%</div>
        </div>
        <div className="card p-4">
          <h2 className="mb-2">Courts</h2>
          <div className="text-sm"># Courts: {scenario.courts.courts}</div>
          <div className="text-sm">Occupancy: {scenario.courts.occupancyPct}% | Rate: Rp{scenario.courts.ratePerHour.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">CAPEX</div>
          <div className="text-2xl font-semibold">Rp {Math.round(results.capex).toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">OPEX / yr</div>
          <div className="text-2xl font-semibold">Rp {Math.round(results.opex).toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">Revenue / yr</div>
          <div className="text-2xl font-semibold">Rp {Math.round(results.revenue).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">EBITDA / yr</div>
          <div className="text-2xl font-semibold">Rp {Math.round(results.ebitda).toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">ROI</div>
          <div className="text-2xl font-semibold">{(results.roi*100).toFixed(1)}%</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">Payback</div>
          <div className="text-2xl font-semibold">{Number.isFinite(results.paybackYears) ? results.paybackYears.toFixed(1) : "∞"} yrs</div>
        </div>
      </div>

      {/* Export bar stub */}
      <div className="flex gap-3">
        <a className="button-accent px-4 py-2 rounded-xl" href={`/api/export/pdf?pid=${scenario.id}`}>Export PDF</a>
        <a className="button-accent px-4 py-2 rounded-xl" href={`/api/export/xls?pid=${scenario.id}`}>Export XLS</a>
      </div>
    </div>
  );
}
```

---

## G) Components (Light Stubs)

``

```tsx
export function Header(){
  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <h1 className="text-2xl">PadelJKT</h1>
        <p className="text-muted-300">v0.9 by Kolabs.Design × HDA × AIM</p>
      </div>
      <div className="flex gap-4 opacity-80">
        <span>KOLABS.DESIGN</span>
        <span>HDA</span>
        <span>AIM</span>
      </div>
    </header>
  );
}
```

``

```tsx
import { useController, Control } from "react-hook-form";

export function MoneyInput({ name, control, label }:{ name:string; control:Control<any>; label:string }){
  const { field } = useController({ control, name });
  return (
    <label className="block text-sm">
      <span className="text-muted-300">{label}</span>
      <input className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={field.value}
        onChange={e=> field.onChange(Number((e.target as HTMLInputElement).value.replace(/[^0-9]/g, "")))} />
    </label>
  );
}
```

``

```tsx
import { useEffect } from "react";

export function RatioSliders({ ratios, onChange }:{ ratios:{ courtsPct:number; parkingPct:number; fnbPct:number; circulationPct:number }; onChange:(r:any)=>void }){
  useEffect(()=>{
    const total = ratios.courtsPct + ratios.parkingPct + ratios.fnbPct + ratios.circulationPct;
    if(total !== 100) {
      const k = 100/total;
      onChange({
        ...ratios,
        courtsPct: Math.round(ratios.courtsPct*k),
        parkingPct: Math.round(ratios.parkingPct*k),
        fnbPct: Math.round(ratios.fnbPct*k),
        circulationPct: Math.round(ratios.circulationPct*k)
      });
    }
  }, [ratios]);

  return (
    <div className="space-y-2">
      {(["courtsPct","parkingPct","fnbPct","circulationPct"] as const).map(key=> (
        <div key={key} className="grid grid-cols-[120px_1fr_64px] gap-3 items-center">
          <div className="text-sm text-muted-300">{key}</div>
          <input type="range" min={0} max={100} value={(ratios as any)[key]} onChange={e=> onChange({ ...ratios, [key]: Number(e.currentTarget.value) })} />
          <div className="text-right">{(ratios as any)[key]}%</div>
        </div>
      ))}
    </div>
  );
}
```

---

## H) Export Endpoints (PDF & XLS)

`` (stub)

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
  // In production: load scenario by id, re-run calc, render HTML → canvas → PDF
  const pdf = Buffer.from("JVBERi0xLjQKJSBNaW5pbWFsIFBERiBzdHViCg==", "base64"); // tiny dummy PDF
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf" } });
}
```

`` (ExcelJS example)

```ts
import ExcelJS from "exceljs";

export async function buildWorkbook(data: any){
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Results");
  ws.columns = [
    { header: "Metric", key: "m", width: 28 },
    { header: "Value", key: "v", width: 22 }
  ];
  Object.entries(data).forEach(([k,v])=> ws.addRow({ m: k, v: v as any }));
  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
```

``

```ts
import { NextRequest, NextResponse } from "next/server";
import { buildWorkbook } from "@/lib/xls/buildWorkbook";

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const pid = url.searchParams.get("pid") || "sample";
  const data = { scenario: pid, capex: 12_700_000_000, opex: 6_100_000_000, revenue: 6_554_000_000, ebitda: 454_000_000 };
  const buf = await buildWorkbook(data);
  return new NextResponse(buf, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" } });
}
```

---

## I) Chart Mappers

``

```ts
import { Results } from "../types";

export function toRoiSeries(r: Results){
  return r.charts.roiVsCourts.map(p => ({ x: p.courts, y: +(p.roi*100).toFixed(1) }));
}

export function toBepSeries(r: Results){
  return r.charts.bepTimeline.map(p => ({ x: p.year, y: Math.round(p.cumulative) }));
}
```

---

## J) Seed Scenarios (JSON)

``

```json
{
  "id": "sample-4-courts",
  "name": "PadelJKT Sample (4 courts)",
  "siteArea": 3000,
  "ratios": { "courtsPct": 50, "parkingPct": 25, "fnbPct": 15, "circulationPct": 10, "stories": 1, "efficiency": 0.82 },
  "courts": { "courts": 4, "indoorType": "semi", "occupancyPct": 65, "hoursPerDay": 14, "ratePerHour": 450000 },
  "rev": { "membership": { "members": 150, "feeAnnual": 5000000 }, "events": { "perMonth": 3, "fee": 15000000 }, "fnb": { "method": "perSqm", "perSqmPerMonth": 300000 } },
  "capex": { "landLease": { "method": "perSqm", "rpPerSqmPerYear": 1000000, "years": 1 }, "courtUnitCost": 1500000000, "roofFactor": 1.15, "fitout": { "cafe": 1200000000, "locker": 600000000 }, "brandingLaunch": 400000000, "workingCapitalMonths": 6 },
  "opex": { "staff": [{ "role": "Manager", "monthly": 18000000 }], "utilitiesRpPerSqmPerMonth": 50000, "maintenanceRpPerCourtPerMonth": 3000000, "marketing": { "method": "pctRevenue", "pct": 2 }, "leaseAnnual": 3500000000, "taxPct": 1 }
}
```

---

## K) README Snippet (for Devs)

``** (excerpt)**

```md
# PadelJKT — v0.9 (Kolabs.Design × HDA × AIM)
Minimal dark UI with padel-green accents. Investor-grade calculator for CAPEX, OPEX, Revenue, ROI, BEP and scenario compare. Exports: PDF/XLS.

## Quickstart
- `pnpm i` && `pnpm dev` (Node ≥ 18)
- Open `/` → click **Try Sample Case**

## ENV
- `NEXT_PUBLIC_MAPBOX_TOKEN` (phase 2)
- `EXPORT_TOKEN` for export endpoints

## Notes
- All calculations live in `/lib/calc/model.ts` and are pure/testable.
- Ratios must sum to 100% (enforced by zod).
- Risk flags: Occupancy < 50%; Payback > 5 yrs.
```

---

**End of Code Appendix**

