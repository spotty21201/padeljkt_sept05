"use client";
import { RatioSliders } from "@/components/inputs/RatioSliders";
import type { Scenario } from "@/lib/types";
import { HelpTooltip } from "@/components/HelpTooltip";

export function SiteForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const r = scenario.ratios;
  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-xl">Site & Ratios</h3>
      <label className="block text-base">
        <span className="text-muted-300">Site Area (sqm)</span>
        <input type="number" className="w-full mt-1 input" value={scenario.siteArea}
          onChange={e=> onPatch({ siteArea: Number(e.currentTarget.value || 0) })} />
      </label>

      <RatioSliders ratios={{ courtsPct: r.courtsPct, parkingPct: r.parkingPct, fnbPct: r.fnbPct, circulationPct: r.circulationPct }} onChange={(nr)=> onPatch({ ratios: { ...scenario.ratios, ...nr } })} />

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-base">
          <span className="text-muted-300 inline-flex items-center">Stories (F&B/Retail) <HelpTooltip text="Floors for F&B/Retail footprint. More stories increase GFA." /></span>
          <input type="number" className="w-full mt-1 input" value={r.stories}
            onChange={e=> onPatch({ ratios: { ...r, stories: Number(e.currentTarget.value || 0) } })} />
        </label>
        <label className="block text-base">
          <span className="text-muted-300 inline-flex items-center">Efficiency (0-1) <HelpTooltip text="Net:gross ratio for F&B/Retail GFA. 0.8 is typical." /></span>
          <input type="number" step="0.01" className="w-full mt-1 input" value={r.efficiency}
            onChange={e=> onPatch({ ratios: { ...r, efficiency: Number(e.currentTarget.value || 0) } })} />
        </label>
      </div>
      <p className="text-xs text-muted-300">Tip: Ratios auto-normalize to 100%.</p>
    </div>
  );
}
