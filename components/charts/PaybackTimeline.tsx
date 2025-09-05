"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area } from "recharts";
import { formatIDR, formatYear } from "@/lib/format/format";

export function PaybackTimelineChart({ data, bepYear, variant="dark", tickSize=12, monochrome=false, plain=false, containerStyle }:{ data:{ year:number; cumulative:number }[]; bepYear?: number | null; variant?: "dark"|"light"; tickSize?: number; monochrome?: boolean; plain?: boolean; containerStyle?: React.CSSProperties }){
  const formatted = data.map(d=> ({ year: d.year, cumulative: Math.round(d.cumulative) }));
  const axisColor = variant==='dark' ? "rgba(255,255,255,0.72)" : "#6B7280";
  const gridColor = variant==='dark' ? "rgba(255,255,255,0.08)" : "#E5E7EB";
  const title = "Payback Timeline";
  const xMax = bepYear && bepYear < 6 ? 6 : 10;
  return (
    <div className={plain? "h-72" : "card p-4 h-72"} aria-label={title} style={plain? containerStyle: undefined}>
      <h3 className="sr-only">{title}</h3>
      <div className="text-base mb-2 text-text-base" style={{ color: axisColor }}>{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top:16, right:16, bottom:8, left:16 }}>
          <CartesianGrid stroke={gridColor} />
          <XAxis dataKey="year" stroke={axisColor} domain={[1, xMax]} tick={{ fill: axisColor, fontSize: tickSize }} allowDecimals={false} tickFormatter={(v)=> `${v}` } />
          <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: tickSize }} tickFormatter={(v)=> formatIDR(v as number)} />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} formatter={(v)=> [formatIDR(v as number), "Cumulative"]} labelFormatter={(l)=> formatYear(l as number)} />
          <Area type="monotone" dataKey="cumulative" stroke="none" fill={monochrome? "#111111" : "#B6FF3B"} fillOpacity={0.08} />
          <Line type="monotone" dataKey="cumulative" stroke={monochrome? "#111111" : "#B6FF3B"} strokeWidth={2} dot={false} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.25)" strokeDasharray="2 2" />
          {bepYear ? <ReferenceLine x={bepYear} stroke={monochrome? "#111111" : "#B6FF3B"} strokeDasharray="3 3" label={{ value: `Breakeven: Year ${bepYear}`, fill: axisColor, fontSize: 11, position: "top" }} /> : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
