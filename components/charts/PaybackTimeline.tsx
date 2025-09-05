"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area } from "recharts";
import { formatIDR, formatYear } from "@/lib/format/format";

export function PaybackTimelineChart({ data, bepYear }:{ data:{ year:number; cumulative:number }[]; bepYear?: number | null }){
  const formatted = data.map(d=> ({ year: d.year, cumulative: Math.round(d.cumulative) }));
  const axisColor = "rgba(255,255,255,0.72)";
  const gridColor = "rgba(255,255,255,0.08)";
  const title = "Payback Timeline";
  const xMax = bepYear && bepYear < 6 ? 6 : 10;
  return (
    <div className="card p-4 h-72" aria-label={title}>
      <h3 className="sr-only">{title}</h3>
      <div className="text-base mb-2" style={{ color: axisColor }}>{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top:16, right:16, bottom:8, left:16 }}>
          <CartesianGrid stroke={gridColor} />
          <XAxis dataKey="year" stroke={axisColor} domain={[1, xMax]} tick={{ fill: axisColor, fontSize: 12 }} allowDecimals={false} tickFormatter={(v)=> `${v}` } />
          <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v)=> formatIDR(v as number)} />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} formatter={(v)=> [formatIDR(v as number), "Cumulative"]} labelFormatter={(l)=> formatYear(l as number)} />
          <Area type="monotone" dataKey="cumulative" stroke="none" fill="#B6FF3B" fillOpacity={0.08} />
          <Line type="monotone" dataKey="cumulative" stroke="#B6FF3B" strokeWidth={2} dot={false} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.25)" strokeDasharray="2 2" />
          {bepYear ? <ReferenceLine x={bepYear} stroke="#B6FF3B" strokeDasharray="3 3" label={{ value: `Breakeven: Year ${bepYear}`, fill: axisColor, fontSize: 11, position: "top" }} /> : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
