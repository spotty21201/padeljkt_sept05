import { z } from "zod";

export const ratiosSchema = z
  .object({
    courtsPct: z.number().min(0).max(100),
    parkingPct: z.number().min(0).max(100),
    fnbPct: z.number().min(0).max(100),
    circulationPct: z.number().min(0).max(100),
    stories: z.number().min(1).max(6),
    efficiency: z.number().min(0.5).max(0.95),
  })
  .refine(
    (r) =>
      Math.round((r.courtsPct + r.parkingPct + r.fnbPct + r.circulationPct) * 10) /
        10 ===
      100,
    {
      message: "Ratios must sum to 100%",
    }
  );

export const courtsSchema = z.object({
  courts: z.number().int().min(1).max(16),
  indoorType: z.enum(["indoor", "semi", "outdoor"]),
  occupancyPct: z.number().min(0).max(100),
  hoursPerDay: z.number().min(1).max(24),
  ratePerHour: z.number().min(0),
});

export const revenueSchema = z.object({
  membership: z.object({
    members: z.number().min(0),
    feeAnnual: z.number().min(0),
  }),
  events: z.object({ perMonth: z.number().min(0), fee: z.number().min(0) }),
  fnb: z.union([
    z.object({ method: z.literal("perSqm"), perSqmPerMonth: z.number().min(0) }),
    z.object({ method: z.literal("perVisitorPct"), visitorSpendPct: z.number().min(0).max(100) }),
  ]),
  retail: z
    .object({
      gfaPct: z.number().min(0).max(100).optional(),
      rpPerSqmPerMonth: z.number().min(0).optional(),
    })
    .optional(),
});

export const capexSchema = z.object({
  landLease: z.union([
    z.object({
      method: z.literal("perSqm"),
      rpPerSqmPerYear: z.number().min(0),
      years: z.number().min(1),
    }),
    z.object({ method: z.literal("flat"), flat: z.number().min(0) }),
  ]),
  courtUnitCost: z.number().min(0),
  roofFactor: z.number().min(0.5).max(2),
  fitout: z.object({ cafe: z.number().min(0), locker: z.number().min(0) }),
  brandingLaunch: z.number().min(0),
  workingCapitalMonths: z.number().min(0).max(24),
});

export const opexSchema = z.object({
  staff: z.array(z.object({ role: z.string(), monthly: z.number().min(0) })),
  utilitiesRpPerSqmPerMonth: z.number().min(0),
  maintenanceRpPerCourtPerMonth: z.number().min(0),
  marketing: z.union([
    z.object({ method: z.literal("flat"), flat: z.number().min(0) }),
    z.object({ method: z.literal("pctRevenue"), pct: z.number().min(0).max(100) }),
  ]),
  leaseAnnual: z.number().min(0).optional(),
  taxPct: z.number().min(0).max(100).optional(),
});

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  siteArea: z.number().min(0),
  ratios: ratiosSchema,
  courts: courtsSchema,
  rev: revenueSchema,
  capex: capexSchema,
  opex: opexSchema,
});

