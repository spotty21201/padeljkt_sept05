"use client";
import { calcResults } from "@/lib/calc/model";
import { formatIDRShort } from "@/lib/format/currency";
import type { Scenario } from "@/lib/types";

type Row = { label: string; fmt?: (v:number)=>string; key: keyof ReturnType<typeof calcResults> };

export function ScenarioCompare({ scenarios }:{ scenarios: { name:string; s: Scenario }[] }){
  const results = scenarios.slice(0,3).map(x => ({ name: x.name, r: calcResults(x.s) }));

  const rows: Row[] = [
    { label: "CAPEX", key: "capex", fmt: formatIDRShort },
    { label: "OPEX / yr", key: "opex", fmt: formatIDRShort },
    { label: "Revenue / yr", key: "revenue", fmt: formatIDRShort },
    { label: "EBITDA / yr", key: "ebitda", fmt: formatIDRShort },
    { label: "ROI", key: "roi", fmt: (v)=> `${(v*100).toFixed(1)}%` },
    { label: "Payback (yrs)", key: "paybackYears", fmt: (v)=> Number.isFinite(v) ? v.toFixed(1) : "∞" }
  ];

  return (
    <section className="card p-4">
      <h2 className="mb-3">Scenario Compare</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm striped">
          <thead className="text-muted-300">
            <tr>
              <th className="text-left py-2">Metric</th>
              {results.map((x)=> (
                <th key={x.name} className="text-right py-2">{x.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row)=> (
              <tr key={row.label} className="border-t border-white/5">
                <td className="py-2">{row.label}</td>
                {results.map((x)=> (
                  <td key={x.name} className="text-right py-2">
                    {row.fmt ? row.fmt((x.r as any)[row.key]) : String((x.r as any)[row.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-300 mt-3">Max 3 side-by-side for MVP; duplicate/custom scenarios coming next.</p>
    </section>
  );
}
