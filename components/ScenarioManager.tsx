"use client";
import { useScenarioStore } from "@/lib/store/scenarioStore";

export function ScenarioManager(){
  const { scenarios, activeId, setActive, addNew, duplicate, remove, rename } = useScenarioStore();

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl">Scenarios</h3>
        <div className="flex gap-2">
          <button className="button-accent px-3 py-1 rounded-xl" title="New Scenario" onClick={()=> addNew()}>➕ New</button>
          {activeId && <button className="button-share px-3 py-1" title="Duplicate Active" onClick={()=> duplicate(activeId)}>📄 Duplicate</button>}
        </div>
      </div>
      <div className="space-y-2">
        {scenarios.map(s => (
          <div key={s.id} className={`flex items-center gap-2 p-2 rounded-xl ${s.id===activeId? 'bg-white/5':''}`}>
            <input className="flex-1 input bg-transparent" value={s.name}
              onChange={(e)=> rename(s.id, e.currentTarget.value)} />
            <button className="button-accent px-2 py-1" title="Set Active" onClick={()=> setActive(s.id)}>✅</button>
            <button className="button-share px-2 py-1" title="Duplicate" onClick={()=> duplicate(s.id)}>📄</button>
            <button className="button-share px-2 py-1" title="Delete" onClick={()=> remove(s.id)}>🗑</button>
          </div>
        ))}
        {scenarios.length === 0 && (
          <div className="text-sm text-muted-300">No scenarios yet. Click New to create one.</div>
        )}
      </div>
    </section>
  );
}
