"use client";
import { RatioSliders } from "@/components/inputs/RatioSliders";
import type { Scenario } from "@/lib/types";

export function SiteForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const r = scenario.ratios;
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg">Site & Ratios</h3>
      <label className="block text-sm">
        <span className="text-muted-300">Site Area (sqm)</span>
        <input type="number" className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={scenario.siteArea}
          onChange={e=> onPatch({ siteArea: Number(e.currentTarget.value || 0) })} />
      </label>

      <RatioSliders ratios={{ courtsPct: r.courtsPct, parkingPct: r.parkingPct, fnbPct: r.fnbPct, circulationPct: r.circulationPct }} onChange={(nr)=> onPatch({ ratios: { ...scenario.ratios, ...nr } })} />

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="text-muted-300">Stories (F&B/Retail)</span>
          <input type="number" className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={r.stories}
            onChange={e=> onPatch({ ratios: { ...r, stories: Number(e.currentTarget.value || 0) } })} />
        </label>
        <label className="block text-sm">
          <span className="text-muted-300">Efficiency (0-1)</span>
          <input type="number" step="0.01" className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={r.efficiency}
            onChange={e=> onPatch({ ratios: { ...r, efficiency: Number(e.currentTarget.value || 0) } })} />
        </label>
      </div>
      <p className="text-xs text-muted-300">Tip: Ratios auto-normalize to 100%.</p>
    </div>
  );
}
