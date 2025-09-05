"use client";
import { useEffect, useMemo, useState } from "react";
import { createBaseScenario } from "@/lib/calc/presets";
import { calcResults } from "@/lib/calc/model";
import type { Scenario } from "@/lib/types";
import { formatIDRShort } from "@/lib/format/currency";

export default function SimulatorPage(){
  const [scenario, setScenario] = useState<Scenario | null>(null);
  useEffect(()=>{
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem("padeljkt:scenario:current") : null;
    if(saved){
      try { setScenario(JSON.parse(saved)); } catch { setScenario(createBaseScenario()); }
    } else {
      setScenario(createBaseScenario());
    }
  },[]);

  useEffect(()=>{
    if(scenario){
      window.localStorage.setItem("padeljkt:scenario:current", JSON.stringify(scenario));
    }
  },[scenario]);

  const results = useMemo(()=> scenario ? calcResults(scenario) : null, [scenario]);

  if(!scenario || !results) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">PadelJKT — {scenario.name}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="mb-2">Site &amp; Ratios</h2>
          <div className="text-sm text-muted-300">Site Area: {scenario.siteArea.toLocaleString()} sqm</div>
          <div className="text-sm">Courts %: {scenario.ratios.courtsPct}% | Parking %: {scenario.ratios.parkingPct}% | F&amp;B %: {scenario.ratios.fnbPct}%</div>
        </div>
        <div className="card p-4">
          <h2 className="mb-2">Courts</h2>
          <div className="text-sm"># Courts: {scenario.courts.courts}</div>
          <div className="text-sm">Occupancy: {scenario.courts.occupancyPct}% | Rate: {formatIDRShort(scenario.courts.ratePerHour)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">CAPEX</div>
          <div className="text-2xl font-semibold">{formatIDRShort(Math.round(results.capex))}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">OPEX / yr</div>
          <div className="text-2xl font-semibold">{formatIDRShort(Math.round(results.opex))}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">Revenue / yr</div>
          <div className="text-2xl font-semibold">{formatIDRShort(Math.round(results.revenue))}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">EBITDA / yr</div>
          <div className="text-2xl font-semibold">{formatIDRShort(Math.round(results.ebitda))}</div>
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

      <div className="flex gap-3">
        <a className="button-accent px-4 py-2 rounded-xl" href={`/api/export/pdf?pid=${scenario.id}`}>Export PDF</a>
        <a className="button-accent px-4 py-2 rounded-xl" href={`/api/export/xls?pid=${scenario.id}`}>Export XLS</a>
      </div>
    </div>
  );
}

