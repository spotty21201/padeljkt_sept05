"use client";
import type { Scenario } from "@/lib/types";
import { MoneyInput } from "@/components/inputs/MoneyInput";

export function OpexForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const ox = scenario.opex;
  const set = (patch: Partial<Scenario["opex"]>)=> onPatch({ opex: { ...ox, ...patch } });
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg">OPEX</h3>
      <div className="space-y-2">
        <div className="text-sm text-muted-300">Staff</div>
        {ox.staff.map((line, idx)=> (
          <div key={idx} className="grid md:grid-cols-[1fr_1fr_auto] items-center gap-3">
            <input className="p-2 bg-ink-700 rounded-xl" value={line.role}
              onChange={(e)=> {
                const staff = [...ox.staff];
                staff[idx] = { ...staff[idx], role: e.currentTarget.value };
                set({ staff });
              }} />
            <input className="p-2 bg-ink-700 rounded-xl" value={line.monthly.toLocaleString("id-ID")}
              onChange={(e)=> {
                const staff = [...ox.staff];
                const val = Number(e.currentTarget.value.replace(/[^0-9]/g, "")) || 0;
                staff[idx] = { ...staff[idx], monthly: val };
                set({ staff });
              }} />
            <button className="text-sm underline text-red-300" onClick={()=> {
              const staff = ox.staff.filter((_,i)=> i!==idx);
              set({ staff });
            }}>Remove</button>
          </div>
        ))}
        <button className="text-sm underline" onClick={()=> set({ staff: [...ox.staff, { role: "New Role", monthly: 5_000_000 }] })}>Add Staff</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <MoneyInput label="Utilities Rp/sqm/mo" value={ox.utilitiesRpPerSqmPerMonth} onChange={(v)=> set({ utilitiesRpPerSqmPerMonth: v })} />
        <MoneyInput label="Maintenance Rp/court/mo" value={ox.maintenanceRpPerCourtPerMonth} onChange={(v)=> set({ maintenanceRpPerCourtPerMonth: v })} />
        <label className="block text-sm">
          <span className="text-muted-300">Marketing Method</span>
          <select className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={(ox.marketing as any).method}
            onChange={e=>{
              const method = e.currentTarget.value as "flat"|"pctRevenue";
              if(method === "flat") set({ marketing: { method, flat: 100_000_000 } as any });
              else set({ marketing: { method, pct: 2 } as any });
            }}>
            <option value="flat">Flat</option>
            <option value="pctRevenue">% of Revenue</option>
          </select>
        </label>
      </div>

      {(ox.marketing as any).method === "flat" ? (
        <MoneyInput label="Marketing Flat / yr" value={(ox.marketing as any).flat || 0} onChange={(v)=> set({ marketing: { method: "flat", flat: v } as any })} />
      ) : (
        <label className="block text-sm">
          <span className="text-muted-300">Marketing % of Revenue</span>
          <input type="number" min={0} max={100} className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={(ox.marketing as any).pct || 0}
            onChange={e=> set({ marketing: { method: "pctRevenue", pct: Number(e.currentTarget.value || 0) } as any })} />
        </label>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <MoneyInput label="Lease Annual" value={ox.leaseAnnual || 0} onChange={(v)=> set({ leaseAnnual: v })} />
        <label className="block text-sm">
          <span className="text-muted-300">Tax % of Revenue</span>
          <input type="number" min={0} max={100} className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={ox.taxPct || 0}
            onChange={e=> set({ taxPct: Number(e.currentTarget.value || 0) })} />
        </label>
      </div>

      <p className="text-xs text-muted-300">Tip: Use % of Revenue for marketing if planning growth-based budgets.</p>
    </div>
  );
}
