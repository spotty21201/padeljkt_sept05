"use client";
import type { Scenario } from "@/lib/types";
import { MoneyInput } from "@/components/inputs/MoneyInput";
import { HelpTooltip } from "@/components/HelpTooltip";

export function CourtsForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const c = scenario.courts;
  const risk = c.occupancyPct < 50;
  const maxCourts = Math.max(0, Math.floor((scenario.siteArea * (scenario.ratios.courtsPct/100)) / 250));
  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-xl">Courts</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-base">
          <span className="text-muted-300"># Courts</span>
          <input type="number" className="w-full mt-1 input" value={c.courts}
            min={0}
            max={maxCourts}
            onChange={e=> {
              const v = Number(e.currentTarget.value || 0);
              onPatch({ courts: { ...c, courts: Math.min(Math.max(0,v), maxCourts) } });
            }} />
          <div className="text-xs text-muted-300 mt-1">Max based on site & ratios: {maxCourts} courts (≈250 sqm/court)</div>
        </label>
        <label className="block text-base">
          <span className="text-muted-300">Type</span>
          <select className="w-full mt-1 select" value={c.indoorType}
            onChange={e=> onPatch({ courts: { ...c, indoorType: e.currentTarget.value as any } })}>
            <option value="outdoor">Outdoor</option>
            <option value="semi">Semi</option>
            <option value="indoor">Indoor</option>
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-3 items-end">
        <label className="block text-base">
          <span className="text-muted-300 inline-flex items-center">Occupancy (%) <HelpTooltip text="Percent of hours booked during operating day. Below 50% is typically risky." /></span>
          <input type="range" min={0} max={100} className="w-full mt-1" value={c.occupancyPct}
            onChange={e=> onPatch({ courts: { ...c, occupancyPct: Number(e.currentTarget.value) } })} />
          <input type="number" className="input text-right" value={c.occupancyPct}
            onChange={(e)=> onPatch({ courts: { ...c, occupancyPct: Math.max(0, Math.min(100, Number(e.currentTarget.value||0))) } })} />
        </label>
        <label className="block text-base">
          <span className="text-muted-300">Hours / Day</span>
          <input type="number" min={1} max={24} className="w-full mt-1 input" value={c.hoursPerDay}
            onChange={e=> onPatch({ courts: { ...c, hoursPerDay: Number(e.currentTarget.value || 0) } })} />
        </label>
        <MoneyInput label="Rate / Hour" value={c.ratePerHour} onChange={(v)=> onPatch({ courts: { ...c, ratePerHour: v } })} />
      </div>

      {risk && (
        <div className="text-xs text-yellow-300">Risk: Occupancy below typical viability range (&lt; 50%).</div>
      )}
      {c.courts > maxCourts && (
        <div className="text-xs text-yellow-300">Not feasible: reduce # courts or increase Courts % in Site & Ratios.</div>
      )}
    </div>
  );
}
