"use client";
import { useEffect } from "react";

export function RatioSliders({ ratios, onChange }:{ ratios:{ courtsPct:number; parkingPct:number; fnbPct:number; circulationPct:number }; onChange:(r:any)=>void }){
  useEffect(()=>{
    const total = ratios.courtsPct + ratios.parkingPct + ratios.fnbPct + ratios.circulationPct;
    if(total !== 100) {
      const k = 100/total;
      const next = {
        ...ratios,
        courtsPct: Math.round(ratios.courtsPct*k),
        parkingPct: Math.round(ratios.parkingPct*k),
        fnbPct: Math.round(ratios.fnbPct*k),
        circulationPct: Math.round(ratios.circulationPct*k)
      };
      const same = next.courtsPct===ratios.courtsPct && next.parkingPct===ratios.parkingPct && next.fnbPct===ratios.fnbPct && next.circulationPct===ratios.circulationPct;
      if(!same) onChange(next);
    }
  }, [ratios]);

  return (
    <div className="space-y-2">
      {(["courtsPct","parkingPct","fnbPct","circulationPct"] as const).map(key=> (
        <div key={key} className="grid grid-cols-[160px_1fr_72px] gap-3 items-center">
          {(() => {
            const labels: Record<"courtsPct"|"parkingPct"|"fnbPct"|"circulationPct", string> = {
              courtsPct: "Courts (%)",
              parkingPct: "Parking (%)",
              fnbPct: "Commercial, F&B etc (%)",
              circulationPct: "Circulation (%)"
            };
            return <div className="text-base text-muted-300">{labels[key]}</div>;
          })()}
          <input type="range" min={0} max={100} value={(ratios as any)[key]} onChange={e=> onChange({ ...ratios, [key]: Number(e.currentTarget.value) })} />
          <input type="number" className="input text-right" value={(ratios as any)[key]} onChange={(e)=>{
            const v = Math.max(0, Math.min(100, Number(e.currentTarget.value||0)));
            onChange({ ...ratios, [key]: v });
          }} />
        </div>
      ))}
    </div>
  );
}
