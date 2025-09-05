"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export function PaybackTimelineChart({ data, bepYear }:{ data:{ year:number; cumulative:number }[]; bepYear?: number | null }){
  const formatted = data.map(d=> ({ year: d.year, cumulative: Math.round(d.cumulative) }));
  return (
    <div className="card p-4 h-64">
      <div className="text-sm text-muted-300 mb-2">Payback Timeline</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="year" stroke="#9AA3AE" />
          <YAxis stroke="#9AA3AE" tickFormatter={(v)=> Intl.NumberFormat('id-ID').format(v)} />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} formatter={(v)=> [Intl.NumberFormat('id-ID').format(v as number),"Cumulative"]} />
          <Line type="monotone" dataKey="cumulative" stroke="#B6FF3B" strokeWidth={2} dot={false} />
          <ReferenceLine y={0} stroke="#9AA3AE" strokeDasharray="3 3" />
          {bepYear ? <ReferenceLine x={bepYear} stroke="#B6FF3B" strokeDasharray="3 3" /> : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

