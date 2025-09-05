"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Line } from "recharts";
import { useScenarioStore } from "@/lib/store/scenarioStore";
import { calcResults } from "@/lib/calc/model";
import { formatIDR, formatYears } from "@/lib/format/format";

function axisCompact(v:number){
  const abs = Math.abs(v);
  if(abs >= 1_000_000_000) return `${(v/1_000_000_000).toFixed(0)}B`;
  if(abs >= 1_000_000) return `${(v/1_000_000).toFixed(0)}M`;
  return `${v}`;
}

export function ScenarioCompareChart(){
  const { scenarios, selectedCompareIds } = useScenarioStore();
  const [showExtra, setShowExtra] = useState(true);
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
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="text-text-mut text-sm">Outcomes (ROI & Payback)</span>
          <input type="checkbox" className="sr-only" checked={showExtra} onChange={(e)=> setShowExtra(e.currentTarget.checked)} />
          <span tabIndex={0} role="switch" aria-checked={showExtra} onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') setShowExtra(v=>!v); }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${showExtra? 'bg-accent-600/70':'bg-ink-600'} focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600/70`}
            onClick={()=> setShowExtra(v=>!v)}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${showExtra? 'translate-x-4':'translate-x-1'}`} />
          </span>
        </label>
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
        <div className="mt-4" aria-label="ROI and Payback comparison across scenarios">
          <div className="h-[220px] md:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ left: 16, right: 24, top: 16, bottom: 24 }}>
                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} interval={0} />
                <YAxis yAxisId="left" stroke={axisColor} domain={[0, 100]} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v)=> `${v}%`} />
                <YAxis yAxisId="right" orientation="right" stroke={axisColor} domain={[0, 10]} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v)=> formatYears(v as number, 1)} />
                <Tooltip content={({ active, payload, label }: any) => {
                  if(!active || !payload?.length) return null;
                  const roi = payload.find((p:any)=> p.dataKey==='ROI');
                  const pb = payload.find((p:any)=> p.dataKey==='Payback');
                  return (
                    <div className="rounded-lg border border-white/10 bg-ink-700 p-3 text-text-base shadow-lg">
                      <div className="font-semibold text-text-hi mb-1">{label}</div>
                      {roi && (
                        <div className="text-sm flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#9FE870' }} />
                          <span className="opacity-80 w-20">ROI</span>
                          <span>{(roi.value as number).toFixed(1)}%</span>
                        </div>
                      )}
                      {pb && (
                        <div className="text-sm flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#4FC3F7' }} />
                          <span className="opacity-80 w-20">Payback</span>
                          <span>{formatYears(pb.value as number, 1)}</span>
                        </div>
                      )}
                    </div>
                  );
                }} />
                <Legend wrapperStyle={{ fontSize: 12, color: axisColor }} verticalAlign="top" align="right" />
                <Bar yAxisId="left" dataKey="ROI" fill="#9FE870" barSize={18} radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="Payback" stroke="#4FC3F7" strokeWidth={2} dot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
