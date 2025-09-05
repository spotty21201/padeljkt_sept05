"use client";
import type { Scenario } from "@/lib/types";
import { MoneyInput } from "@/components/inputs/MoneyInput";

export function RevenueForm({ scenario, onPatch }:{ scenario: Scenario; onPatch:(p:Partial<Scenario>)=>void }){
  const rev = scenario.rev;
  const set = (patch: Partial<Scenario["rev"]>)=> onPatch({ rev: { ...rev, ...patch } });
  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-xl">Revenues</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-base">
          <span className="text-muted-300">Members</span>
          <input type="number" className="w-full mt-1 input" value={rev.membership.members}
            onChange={e=> set({ membership: { ...rev.membership, members: Number(e.currentTarget.value || 0) } })} />
        </label>
        <MoneyInput label="Fee / Year" value={rev.membership.feeAnnual} onChange={(v)=> set({ membership: { ...rev.membership, feeAnnual: v } })} />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-base">
          <span className="text-muted-300">Events / Month</span>
          <input type="number" className="w-full mt-1 input" value={rev.events.perMonth}
            onChange={e=> set({ events: { ...rev.events, perMonth: Number(e.currentTarget.value || 0) } })} />
        </label>
        <MoneyInput label="Event Fee" value={rev.events.fee} onChange={(v)=> set({ events: { ...rev.events, fee: v } })} />
      </div>

      <div className="grid md:grid-cols-3 gap-3 items-end">
        <label className="block text-base">
          <span className="text-muted-300">F&B Method</span>
          <select className="w-full mt-1 select" value={(rev.fnb as any).method}
            onChange={e=> {
              const method = e.currentTarget.value as "perSqm"|"perVisitorPct";
              if(method === "perSqm") set({ fnb: { method, perSqmPerMonth: 300_000 } as any });
              else set({ fnb: { method, visitorSpendPct: 15 } as any });
            }}>
            <option value="perSqm">Per Sqm / Month</option>
            <option value="perVisitorPct">Visitor Spend %</option>
          </select>
        </label>
        {rev.fnb.method === "perSqm" ? (
          <MoneyInput label="Rp / sqm / mo" value={(rev.fnb as any).perSqmPerMonth || 0} onChange={(v)=> set({ fnb: { method: "perSqm", perSqmPerMonth: v } as any })} />
        ) : (
          <label className="block text-sm">
            <span className="text-muted-300">Spend % of Ticket</span>
            <input type="number" min={0} max={100} className="w-full p-2 mt-1 bg-ink-700 rounded-xl" value={(rev.fnb as any).visitorSpendPct || 0}
              onChange={e=> set({ fnb: { method: "perVisitorPct", visitorSpendPct: Number(e.currentTarget.value || 0) } as any })} />
          </label>
        )}
      </div>
    </div>
  );
}
