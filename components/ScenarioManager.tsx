"use client";
import { useScenarioStore } from "@/lib/store/scenarioStore";
import SectionHeading from "@/components/ui/SectionHeading";

export function ScenarioManager(){
  const { scenarios, activeId, setActive, addNew, duplicate, remove, rename } = useScenarioStore();

  return (
    <section className="card p-4" aria-labelledby="heading-scenarios">
      <SectionHeading id="heading-scenarios" title="Scenarios" rightSlot={
        <div className="flex gap-2">
          <button className="button-accent btn-sm" onClick={()=> addNew()}>New</button>
          {activeId && <button className="button-share btn-sm" onClick={()=> duplicate(activeId)}>Duplicate</button>}
        </div>
      } />
      <div className="space-y-2">
        {scenarios.map(s => {
          const isActive = s.id === activeId;
          const rowClass = isActive
            ? "bg-ink-700 hover:bg-ink-600 border border-accent-500 shadow-[0_0_8px_2px_rgba(182,255,59,0.25)] text-text-hi font-semibold"
            : "bg-ink-800 hover:bg-ink-700 border border-transparent text-text-base";
          return (
            <div
              key={s.id}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors ${rowClass}`}
              aria-current={isActive ? "true" : undefined}
            >
              <input
                className={`flex-1 bg-transparent outline-none ${isActive ? 'text-text-hi' : 'text-text-base'}`}
                value={s.name}
                onChange={(e)=> rename(s.id, e.currentTarget.value)}
              />
              <div className="flex items-center gap-2 ml-3">
                <button className="button-accent btn-sm" onClick={()=> setActive(s.id)}>Set Active</button>
                <button className="button-share btn-sm" onClick={()=> duplicate(s.id)}>Duplicate</button>
                <button className="button-share btn-sm" onClick={()=> remove(s.id)}>Delete</button>
              </div>
            </div>
          );
        })}
        {scenarios.length === 0 && (
          <div className="text-sm text-muted-300">No scenarios yet. Click New to create one.</div>
        )}
      </div>
    </section>
  );
}
