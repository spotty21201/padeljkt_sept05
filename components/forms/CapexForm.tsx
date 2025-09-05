"use client";
import type { Scenario } from "@/lib/types";
import { MoneyInput } from "@/components/inputs/MoneyInput";
import { HelpTooltip } from "@/components/HelpTooltip";
import SectionHeading from "@/components/ui/SectionHeading";

export function CapexForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const cx = scenario.capex;
  const set = (patch: Partial<Scenario["capex"]>)=> onPatch({ capex: { ...cx, ...patch } });
  return (
    <div className="card p-5 space-y-4" aria-labelledby="heading-capex">
      <SectionHeading id="heading-capex" title="CAPEX" />
      <label className="block text-base">
        <span className="text-muted-300 inline-flex items-center">Land Lease Method <HelpTooltip text="Choose a flat upfront lease or a per-sqm per-year basis with years." /></span>
        <select className="w-full mt-1 select" value={(cx.landLease as any).method}
          onChange={e=> {
            const method = e.currentTarget.value as "perSqm"|"flat";
            if(method === "perSqm") set({ landLease: { method, rpPerSqmPerYear: 1_000_000, years: 1 } as any });
            else set({ landLease: { method, flat: 1_000_000_000 } as any });
          }}>
          <option value="perSqm">Per Sqm / Year</option>
          <option value="flat">Flat</option>
        </select>
      </label>

      {(cx.landLease as any).method === "perSqm" ? (
        <div className="grid md:grid-cols-2 gap-3">
          <MoneyInput label="Rp / sqm / year" value={(cx.landLease as any).rpPerSqmPerYear || 0} onChange={(v)=> set({ landLease: { ...(cx.landLease as any), rpPerSqmPerYear: v } as any })} />
          <label className="block text-base">
            <span className="text-muted-300">Years</span>
            <input type="number" className="w-full mt-1 input" value={(cx.landLease as any).years || 1}
              onChange={e=> set({ landLease: { ...(cx.landLease as any), years: Number(e.currentTarget.value || 1) } as any })} />
          </label>
        </div>
      ) : (
        <MoneyInput label="Flat Land Cost" value={(cx.landLease as any).flat || 0} onChange={(v)=> set({ landLease: { method: "flat", flat: v } as any })} />
      )}

      <div className="grid md:grid-cols-3 gap-3">
        <MoneyInput label="Court Unit Cost" value={cx.courtUnitCost} onChange={(v)=> set({ courtUnitCost: v })} />
        <label className="block text-base">
          <span className="text-muted-300 inline-flex items-center">Roof Factor <HelpTooltip text="Multiplier for semi/indoor structures vs outdoor (e.g., 1.0 outdoor, 1.15 semi, 1.35 indoor)." /></span>
          <input type="number" step="0.01" className="w-full mt-1 input" value={cx.roofFactor}
            onChange={e=> set({ roofFactor: Number(e.currentTarget.value || 1) })} />
        </label>
        <MoneyInput label="Branding / Launch" value={cx.brandingLaunch} onChange={(v)=> set({ brandingLaunch: v })} />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <MoneyInput label="Fitout — Cafe" value={cx.fitout.cafe} onChange={(v)=> set({ fitout: { ...cx.fitout, cafe: v } })} />
        <MoneyInput label="Fitout — Locker" value={cx.fitout.locker} onChange={(v)=> set({ fitout: { ...cx.fitout, locker: v } })} />
        <label className="block text-base">
          <span className="text-muted-300 inline-flex items-center">Working Capital (months) <HelpTooltip text="Months of operating expenses to cover at launch." /></span>
          <input type="number" className="w-full mt-1 input" value={cx.workingCapitalMonths}
            onChange={e=> set({ workingCapitalMonths: Number(e.currentTarget.value || 0) })} />
        </label>
      </div>
    </div>
  );
}
