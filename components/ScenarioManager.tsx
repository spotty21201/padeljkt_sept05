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
        {scenarios.map(s => (
          <div key={s.id} className={`flex items-center gap-2 p-2 rounded-xl ${s.id===activeId? 'bg-white/5':''}`}>
            <input className="flex-1 input bg-transparent" value={s.name}
              onChange={(e)=> rename(s.id, e.currentTarget.value)} />
            <button className="button-accent btn-sm" onClick={()=> setActive(s.id)}>Set Active</button>
            <button className="button-share btn-sm" onClick={()=> duplicate(s.id)}>Duplicate</button>
            <button className="button-share btn-sm" onClick={()=> remove(s.id)}>Delete</button>
          </div>
        ))}
        {scenarios.length === 0 && (
          <div className="text-sm text-muted-300">No scenarios yet. Click New to create one.</div>
        )}
      </div>
    </section>
  );
}
