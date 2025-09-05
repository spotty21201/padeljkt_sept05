"use client";
import { useState } from "react";

export function HelpTooltip({ text }:{ text:string }){
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle" onMouseEnter={()=> setOpen(true)} onMouseLeave={()=> setOpen(false)}>
      <span
        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] bg-white/10 text-muted-300 cursor-help"
        aria-label={text}
      >
        ?
      </span>
      {open && (
        <span className="absolute z-10 top-full mt-2 w-64 text-xs leading-snug p-2 rounded bg-ink-700/95 border border-white/10 text-muted-300 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

