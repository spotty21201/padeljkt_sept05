import { Scenario } from "@/lib/types";

export function createBaseScenario(): Scenario {
  return {
    id: "sample-4-courts",
    name: "PadelJKT Sample (4 courts)",
    siteArea: 3000,
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
      marketing: { method: "pctRevenue", pct: 2 } as any,
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

