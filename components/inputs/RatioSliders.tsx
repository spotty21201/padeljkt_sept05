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
        <div key={key} className="grid grid-cols-[140px_1fr_64px] gap-3 items-center">
          <div className="text-sm text-muted-300">{key}</div>
          <input type="range" min={0} max={100} value={(ratios as any)[key]} onChange={e=> onChange({ ...ratios, [key]: Number(e.currentTarget.value) })} />
          <div className="text-right">{(ratios as any)[key]}%</div>
        </div>
      ))}
    </div>
  );
}
