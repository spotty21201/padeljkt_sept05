"use client";
import { useEffect, useMemo } from "react";
import { calcResults } from "@/lib/calc/model";
import { formatIDRShort } from "@/lib/format/currency";
import { ScenarioCompare } from "@/components/ScenarioCompare";
import { SiteForm } from "@/components/forms/SiteForm";
import { CourtsForm } from "@/components/forms/CourtsForm";
import { RevenueForm } from "@/components/forms/RevenueForm";
import { CapexForm } from "@/components/forms/CapexForm";
import { OpexForm } from "@/components/forms/OpexForm";
import { ScenarioManager } from "@/components/ScenarioManager";
import { useScenarioStore } from "@/lib/store/scenarioStore";
import { encodeScenarioToParam, decodeScenarioParam } from "@/lib/util/share";
import type { Scenario } from "@/lib/types";
import { ComparePicker } from "@/components/ComparePicker";
import AppHeader from "@/components/ui/AppHeader";

export default function SimulatorPage(){
  const { scenarios, activeId, update, addNew } = useScenarioStore();
  const active = useMemo(()=> scenarios.find(s=> s.id === activeId) || scenarios[0], [scenarios, activeId]);

  // Import scenario via URL param ?s=<b64url>; seed one if none
  useEffect(()=>{
    if(typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const sParam = url.searchParams.get('s');
    if(sParam){
      try{
        const obj = decodeScenarioParam(sParam) as Scenario;
        if(obj && obj.id){
          useScenarioStore.setState((prev)=> ({ scenarios: [obj, ...prev.scenarios], activeId: obj.id }));
          url.searchParams.delete('s');
          window.history.replaceState({}, '', url.toString());
        }
      }catch{}
    }
    if(scenarios.length===0){ addNew(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const results = useMemo(()=> active ? calcResults(active) : null, [active]);
  if(!active || !results) return <div className="p-8">Loading…</div>;

  return (
    <div className="space-y-6">
      <AppHeader
        appName="PadelJKT Simulator"
        tagline="Predictive ROI and feasibility analysis for padel clubs."
        version="v0.9"
        credits="by Kolabs.Design × HDA × AIM"
        scenarioName={active.name}
        onScenarioClick={() => {
          const el = document.getElementById("scenario-panel");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <div className="px-6" id="scenario-panel">
        <ScenarioManager />
      </div>

      <div className="px-6 grid lg:grid-cols-2 gap-4">
        <SiteForm scenario={active} onPatch={(p)=> update(active.id, p)} />
        <CourtsForm scenario={active} onPatch={(p)=> update(active.id, p)} />
      </div>

      <div className="px-6 grid lg:grid-cols-2 gap-4">
        <RevenueForm scenario={active} onPatch={(p)=> update(active.id, p)} />
        <CapexForm scenario={active} onPatch={(p)=> update(active.id, p)} />
      </div>

      <div className="px-6">
        <OpexForm scenario={active} onPatch={(p)=> update(active.id, p)} />
      </div>

      <div className="px-6 grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">CAPEX</div>
          <div className="text-3xl font-semibold text-center">{formatIDRShort(Math.round(results.capex))}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">OPEX / yr</div>
          <div className="text-3xl font-semibold text-center">{formatIDRShort(Math.round(results.opex))}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">Revenue / yr</div>
          <div className="text-3xl font-semibold text-center">{formatIDRShort(Math.round(results.revenue))}</div>
        </div>
      </div>

      <div className="px-6 grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-muted-300">EBITDA / yr</div>
          <div className="text-3xl font-semibold text-center">{formatIDRShort(Math.round(results.ebitda))}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">ROI</div>
          <div className="text-3xl font-semibold text-center">{(results.roi*100).toFixed(1)}%</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-muted-300">Payback</div>
          <div className="text-3xl font-semibold text-center">{Number.isFinite(results.paybackYears) ? results.paybackYears.toFixed(1) : "∞"} yrs</div>
        </div>
      </div>

      {active.courts.occupancyPct < 50 && (
        <div className="text-xs text-yellow-300">Risk: Occupancy below 50%.</div>
      )}
      {Number.isFinite(results.paybackYears) && results.paybackYears > 5 && (
        <div className="text-xs text-yellow-300">Risk: Payback over 5 years — consider increasing courts or F&amp;B contribution.</div>
      )}

      <div className="px-6 flex gap-3 items-center">
        <a className="button-accent px-4 py-2 rounded-xl" href={`/api/export/pdf?s=${encodeScenarioToParam(active)}`}>Export PDF</a>
        <a className="button-xls px-4 py-2 rounded-xl" href={`/api/export/xls?s=${encodeScenarioToParam(active)}`}>Export XLS</a>
        <button className="button-share px-4 py-2 rounded-xl" onClick={()=>{
          const link = `${window.location.origin}/simulator/sample?s=${encodeScenarioToParam(active)}`;
          navigator.clipboard?.writeText(link);
          alert("Share link copied to clipboard");
        }}>Share Link</button>
      </div>

      <div className="px-6 space-y-4">
        <ComparePicker />
        <ScenarioCompare scenarios={(useScenarioStore.getState().selectedCompareIds.length>0
          ? useScenarioStore.getState().selectedCompareIds.map(id=> scenarios.find(s=> s.id===id)).filter(Boolean) as Scenario[]
          : scenarios.slice(0,3)).map(s=> ({ name: s.name, s }))} />
      </div>
    </div>
  );
}
