export type LandUseRatios = {
  courtsPct: number;
  parkingPct: number;
  fnbPct: number;
  circulationPct: number;
  stories: number;
  efficiency: number;
};

export type CourtsConfig = {
  courts: number;
  indoorType: "indoor" | "semi" | "outdoor";
  occupancyPct: number;
  hoursPerDay: number;
  ratePerHour: number;
};

export type FnbMethod =
  | { method: "perSqm"; perSqmPerMonth: number }
  | { method: "perVisitorPct"; visitorSpendPct: number };

export type RevenueInputs = {
  membership: { members: number; feeAnnual: number };
  events: { perMonth: number; fee: number };
  fnb: FnbMethod;
  retail?: { gfaPct?: number; rpPerSqmPerMonth?: number };
};

export type CapexInputs = {
  landLease:
    | { method: "perSqm"; rpPerSqmPerYear: number; years: number }
    | { method: "flat"; flat: number };
  courtUnitCost: number;
  roofFactor: number;
  fitout: { cafe: number; locker: number };
  brandingLaunch: number;
  workingCapitalMonths: number;
};

export type StaffLine = { role: string; monthly: number };

export type OpexInputs = {
  staff: StaffLine[];
  utilitiesRpPerSqmPerMonth: number;
  maintenanceRpPerCourtPerMonth: number;
  marketing:
    | { method: "flat"; flat: number }
    | { method: "pctRevenue"; pct: number };
  leaseAnnual?: number;
  taxPct?: number;
};

export type Scenario = {
  id: string;
  name: string;
  siteArea: number;
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
  roi: number;
  paybackYears: number;
  charts: {
    roiVsCourts: { courts: number; roi: number }[];
    bepTimeline: { year: number; cumulative: number }[];
  };
};

