"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Line } from "recharts";
import { useScenarioStore } from "@/lib/store/scenarioStore";
import { calcResults } from "@/lib/calc/model";
import { formatIDR } from "@/lib/format/format";

function axisCompact(v:number){
  const abs = Math.abs(v);
  if(abs >= 1_000_000_000) return `${(v/1_000_000_000).toFixed(0)}B`;
  if(abs >= 1_000_000) return `${(v/1_000_000).toFixed(0)}M`;
  return `${v}`;
}

export function ScenarioCompareChart(){
  const { scenarios, selectedCompareIds } = useScenarioStore();
  const [showExtra, setShowExtra] = useState(false);
  const chosen = (selectedCompareIds.length>0 ? selectedCompareIds.map(id=> scenarios.find(s=> s.id===id)).filter(Boolean) : scenarios.slice(0,3)) as typeof scenarios;
  const data = chosen.map((s, idx)=>{
    const r = calcResults(s);
    const displayName = (s as any).displayName || s.name || `Scenario ${idx+1}`;
    return {
      name: displayName,
      CAPEX: Math.round(r.capex),
      OPEX: Math.round(r.opex),
      Revenue: Math.round(r.revenue),
      ROI: +(r.roi*100).toFixed(1),
      Payback: Number.isFinite(r.paybackYears) ? +r.paybackYears.toFixed(1) : 0
    };
  });

  const axisColor = "rgba(255,255,255,0.72)";
  const gridColor = "rgba(255,255,255,0.08)";
  const CAPEX = "#B6FF3B"; // padel green
  const OPEX = "#4FC3F7";  // teal/blue
  const REVENUE = "#9FE870"; // lime

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const items = payload.filter((p:any)=> ["CAPEX","OPEX","Revenue"].includes(p.name));
    return (
      <div className="rounded-lg border border-white/10 bg-ink-700 p-3 text-text-base shadow-lg">
        <div className="font-semibold text-text-hi mb-1">{label}</div>
        {items.map((it:any)=> (
          <div key={it.name} className="text-sm flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: it.color }} />
            <span className="opacity-80 w-20">{it.name}</span>
            <span>{formatIDR(it.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-base text-text-base">Scenario Comparison (Graph)</div>
        <button className="button-share btn-sm" onClick={()=> setShowExtra(s=> !s)}>{showExtra? 'Hide ROI & Payback' : 'Show ROI & Payback'}</button>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 24, right: 16, top: 16, bottom: 24 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} interval={0} angle={0} height={40} />
            <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={axisCompact} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} verticalAlign="top" align="right" />
            <Bar dataKey="CAPEX" fill={CAPEX} radius={[4,4,0,0]} stroke={CAPEX} strokeWidth={0} />
            <Bar dataKey="OPEX" fill={OPEX} radius={[4,4,0,0]} stroke={OPEX} strokeWidth={0} />
            <Bar dataKey="Revenue" fill={REVENUE} radius={[4,4,0,0]} stroke={REVENUE} strokeWidth={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showExtra && (
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 24, right: 16, top: 16, bottom: 24 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} />
              <YAxis yAxisId="left" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v)=> `${v}%`} />
              <YAxis yAxisId="right" orientation="right" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v)=> `${v}yr`} />
              <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} verticalAlign="top" align="right" />
              <Bar yAxisId="left" dataKey="ROI" fill={CAPEX} radius={[4,4,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="Payback" stroke={OPEX} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
