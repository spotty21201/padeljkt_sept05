"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from "recharts";

export function RoiVsCourtsChart({ data, current }:{ data:{ courts:number; roi:number }[]; current:number }){
  const formatted = data.map(d=> ({ courts: d.courts, roiPct: +(d.roi*100).toFixed(1) }));
  const currentPoint = formatted.find(d=> d.courts === current);
  return (
    <div className="card p-4 h-64">
      <div className="text-sm text-muted-300 mb-2">ROI vs Courts</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="courts" stroke="#9AA3AE" />
          <YAxis stroke="#9AA3AE" unit="%" />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} formatter={(v)=> [`${v}%`,`ROI`]} />
          <Line type="monotone" dataKey="roiPct" stroke="#B6FF3B" strokeWidth={2} dot={{ r: 2 }} />
          {currentPoint && (
            <ReferenceDot x={currentPoint.courts} y={currentPoint.roiPct} r={5} fill="#B6FF3B" stroke="#0A0A0A" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

