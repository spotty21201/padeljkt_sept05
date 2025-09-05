"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Scenario } from "@/lib/types";
import { createBaseScenario, duplicateScenario } from "@/lib/calc/presets";

type State = {
  scenarios: Scenario[];
  activeId: string | null;
  selectedCompareIds: string[];
  hasHydrated: boolean;
  hasSeeded: boolean;
  setActive: (id: string) => void;
  setHasHydrated: (v: boolean) => void;
  setHasSeeded: (v: boolean) => void;
  addScenario: (s: Scenario) => void;
  addScenarios: (arr: Scenario[]) => void;
  addNew: () => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  update: (id: string, patch: Partial<Scenario>) => void;
  toggleCompare: (id: string) => void;
};

export const useScenarioStore = create<State>()(
  persist(
    (set, get) => ({
      scenarios: [],
      activeId: null,
      selectedCompareIds: [],
      hasHydrated: false,
      hasSeeded: false,
      setActive: (id) => set({ activeId: id }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setHasSeeded: (v) => set({ hasSeeded: v }),
      addScenario: (s) => set(({ scenarios }) => (
        scenarios.some(x => x.id === s.id) ? { scenarios } : { scenarios: [s, ...scenarios] }
      )),
      addScenarios: (arr) => set(({ scenarios }) => {
        const byId = new Map(scenarios.map(s => [s.id, s]));
        for (const s of arr) { if(!byId.has(s.id)) byId.set(s.id, s); }
        return { scenarios: Array.from(byId.values()) } as any;
      }),
      addNew: () =>
        set(() => {
          const s = createBaseScenario();
          s.id = crypto.randomUUID();
          const nextIndex = (get().scenarios.length || 0) + 1;
          s.name = `Scenario ${nextIndex}`;
          const arr = [s, ...get().scenarios];
          return { scenarios: arr, activeId: s.id };
        }),
      duplicate: (id) =>
        set(() => {
          const src = get().scenarios.find((x) => x.id === id);
          if (!src) return {} as any;
          const s = duplicateScenario(src, {});
          const nextIndex = (get().scenarios.length || 0) + 1;
          s.name = `${src.name} (copy ${nextIndex})`;
          return { scenarios: [s, ...get().scenarios], activeId: s.id };
        }),
      remove: (id) =>
        set(() => {
          const arr = get().scenarios.filter((x) => x.id !== id);
          const activeId = get().activeId === id ? (arr[0]?.id ?? null) : get().activeId;
          const selectedCompareIds = get().selectedCompareIds.filter(x=> x!==id);
          return { scenarios: arr, activeId, selectedCompareIds };
        }),
      rename: (id, name) =>
        set(() => ({
          scenarios: get().scenarios.map((x) => (x.id === id ? { ...x, name } : x)),
        })),
      update: (id, patch) =>
        set(() => ({
          scenarios: get().scenarios.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      toggleCompare: (id) => set(() => {
        const selected = get().selectedCompareIds;
        const isSel = selected.includes(id);
        if(isSel){
          return { selectedCompareIds: selected.filter(x=> x!==id) } as any;
        }
        if(selected.length >= 3){
          return {} as any; // ignore if already 3
        }
        return { selectedCompareIds: [...selected, id] } as any;
      }),
    }),
    {
      name: "padeljkt:scenarios",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
