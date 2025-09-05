"use client";
import type { Scenario } from "@/lib/types";
import { MoneyInput } from "@/components/inputs/MoneyInput";

export function CourtsForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const c = scenario.courts;
  const risk = c.occupancyPct < 50;
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg">Courts</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="text-muted-300"># Courts</span>
          <input type="number" className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={c.courts}
            onChange={e=> onPatch({ courts: { ...c, courts: Number(e.currentTarget.value || 0) } })} />
        </label>
        <label className="block text-sm">
          <span className="text-muted-300">Type</span>
          <select className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={c.indoorType}
            onChange={e=> onPatch({ courts: { ...c, indoorType: e.currentTarget.value as any } })}>
            <option value="outdoor">Outdoor</option>
            <option value="semi">Semi</option>
            <option value="indoor">Indoor</option>
          </select>
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <label className="block text-sm">
          <span className="text-muted-300">Occupancy (%)</span>
          <input type="range" min={0} max={100} className="w-full mt-1" value={c.occupancyPct}
            onChange={e=> onPatch({ courts: { ...c, occupancyPct: Number(e.currentTarget.value) } })} />
          <div className="text-right">{c.occupancyPct}%</div>
        </label>
        <label className="block text-sm">
          <span className="text-muted-300">Hours / Day</span>
          <input type="number" min={1} max={24} className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={c.hoursPerDay}
            onChange={e=> onPatch({ courts: { ...c, hoursPerDay: Number(e.currentTarget.value || 0) } })} />
        </label>
        <MoneyInput label="Rate / Hour" value={c.ratePerHour} onChange={(v)=> onPatch({ courts: { ...c, ratePerHour: v } })} />
      </div>

      {risk && (
        <div className="text-xs text-yellow-300">Risk: Occupancy below typical viability range (&lt; 50%).</div>
      )}
    </div>
  );
}
