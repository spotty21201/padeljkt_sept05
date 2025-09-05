"use client";
import { useMemo } from "react";
import { useScenarioStore } from "@/lib/store/scenarioStore";

export function ComparePicker(){
  const { scenarios, selectedCompareIds, toggleCompare } = useScenarioStore();
  const count = selectedCompareIds.length;
  const canSelectMore = count < 3;
  const list = useMemo(()=> scenarios, [scenarios]);

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Compare Selection</h3>
        <div className="text-sm text-muted-300">{count}/3 selected</div>
      </div>
      <div className="mt-2 grid md:grid-cols-2 gap-2">
        {list.map(s => {
          const checked = selectedCompareIds.includes(s.id);
          return (
            <label key={s.id} className={`flex items-center gap-2 p-2 rounded-xl border border-white/10 ${checked? 'bg-white/5':''}`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!checked && !canSelectMore}
                onChange={()=> toggleCompare(s.id)}
              />
              <span className="text-sm">{s.name}</span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-muted-300 mt-2">Pick up to three scenarios to show in the compare table.</p>
    </section>
  );
}

