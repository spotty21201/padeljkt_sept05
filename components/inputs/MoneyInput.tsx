"use client";
import { useMemo } from "react";

export function MoneyInput({ label, value, onChange }:{ label:string; value:number; onChange:(v:number)=>void }){
  const display = useMemo(()=> (value ?? 0).toLocaleString("id-ID"), [value]);
  return (
    <label className="block text-sm">
      <span className="text-muted-300">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-muted-300">IDR</span>
        <input
          className="w-full p-2 bg-ink-700 rounded-xl"
          value={display}
          onChange={(e)=>{
            const raw = e.currentTarget.value.replace(/[^0-9]/g, "");
            onChange(Number(raw || 0));
          }}
        />
      </div>
    </label>
  );
}

