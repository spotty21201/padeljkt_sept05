"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useScenarioStore } from "@/lib/store/scenarioStore";
import { calcResults } from "@/lib/calc/model";

export function ScenarioCompareChart(){
  const { scenarios, selectedCompareIds } = useScenarioStore();
  const chosen = (selectedCompareIds.length>0 ? selectedCompareIds.map(id=> scenarios.find(s=> s.id===id)).filter(Boolean) : scenarios.slice(0,3)) as typeof scenarios;
  const data = chosen.map(s=>{
    const r = calcResults(s);
    return {
      name: s.name,
      CAPEX: Math.round(r.capex),
      OPEX: Math.round(r.opex),
      Revenue: Math.round(r.revenue),
      ROI: +(r.roi*100).toFixed(1),
      Payback: Number.isFinite(r.paybackYears) ? +r.paybackYears.toFixed(1) : 0
    };
  });
  const colors = ["#B6FF3B", "#9EE635", "#87CD2E"]; // shades of padel-green
  return (
    <div className="card p-4 h-80">
      <div className="text-sm text-muted-300 mb-2">Scenario Comparison (Graph)</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#9AA3AE" />
          <YAxis stroke="#9AA3AE" tickFormatter={(v)=> Intl.NumberFormat('id-ID').format(v)} />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} />
          <Legend />
          <Bar dataKey="CAPEX" fill={colors[0]} />
          <Bar dataKey="OPEX" fill={colors[1]} />
          <Bar dataKey="Revenue" fill={colors[2]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-300 mt-2">Note: ROI (%) and Payback (yrs) available in table above; monetary metrics shown here.</div>
    </div>
  );
}

