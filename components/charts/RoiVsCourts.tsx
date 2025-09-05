"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot, ReferenceLine, Area, Label } from "recharts";
import { formatPct } from "@/lib/format/format";

type Props = { data:{ courts:number; roi:number }[]; current:number; variant?: "dark"|"light"; tickSize?: number; monochrome?: boolean; plain?: boolean; containerStyle?: React.CSSProperties };

export function RoiVsCourtsChart({ data, current, variant="dark", tickSize=12, monochrome=false, plain=false, containerStyle }: Props){
  const formatted = data.map(d=> ({ courts: d.courts, roiPct: +(d.roi*100).toFixed(1) }));
  const currentPoint = formatted.find(d=> d.courts === current);
  const maxCourts = Math.max(...formatted.map(d=> d.courts), 1);
  const xDomain:[number, number] = maxCourts >= 10 ? [1, 10] : [1, maxCourts + 1];
  const yMax = Math.max(...formatted.map(d=> d.roiPct), 0);
  const niceMax = yMax <= 50 ? 50 : (yMax <= 60 ? 60 : Math.ceil(yMax/10)*10);
  const axisColor = variant==='dark' ? "rgba(255,255,255,0.72)" : "#6B7280";
  const gridColor = variant==='dark' ? "rgba(255,255,255,0.08)" : "#E5E7EB";
  const title = "ROI vs Courts";

  // Peak ROI annotation
  const peak = formatted.reduce((acc, x)=> x.roiPct > acc.roiPct ? x : acc, formatted[0] || { courts: 0, roiPct: 0 });

  return (
    <div className={plain? "h-72" : "card p-4 h-72"} aria-label={title} style={plain? containerStyle: undefined}>
      <h3 className="sr-only">{title}</h3>
      <div className="text-base mb-2 text-text-base" style={{ color: axisColor }}>{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 16, right: 16, bottom: 8, left: 16 }}>
          <CartesianGrid stroke={gridColor} />
          <XAxis dataKey="courts" stroke={axisColor} domain={xDomain} tick={{ fill: axisColor, fontSize: tickSize }} allowDecimals={false} />
          <YAxis stroke={axisColor} domain={[0, niceMax]} tick={{ fill: axisColor, fontSize: tickSize }} tickFormatter={(v)=> formatPct(v/100)} />
          <Tooltip contentStyle={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", color: "#EDEEF0" }} formatter={(v)=> [`${(v as number).toFixed(1)}%`,`ROI`]} labelFormatter={(l)=> `Courts: ${l}`} />
          <Area type="monotone" dataKey="roiPct" stroke="none" fill={monochrome? "#111111" : "#B6FF3B"} fillOpacity={0.08} />
          <Line type="monotone" dataKey="roiPct" stroke={monochrome? "#111111" : "#B6FF3B"} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, stroke: monochrome? "#111111":"#B6FF3B", strokeWidth: 1 }} />
          {currentPoint && (
            <>
              <ReferenceDot x={currentPoint.courts} y={currentPoint.roiPct} r={5} fill={monochrome? "#111111" : "#B6FF3B"} stroke="#0A0A0A" />
              <ReferenceLine x={current} stroke={axisColor} strokeDasharray="3 3" label={{ value: "Current", fill: axisColor, fontSize: 11, position: "top" }} />
            </>
          )}
          {peak && peak.courts ? (
            <ReferenceDot x={peak.courts} y={peak.roiPct} r={5} fill="#B6FF3B" stroke="#0A0A0A">
              <Label value={`Peak ROI: ${peak.roiPct.toFixed(1)}% at ${peak.courts}`} position="top" fill={axisColor} fontSize={11} />
            </ReferenceDot>
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
