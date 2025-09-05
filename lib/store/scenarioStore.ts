"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Scenario } from "@/lib/types";
import { createBaseScenario, duplicateScenario } from "@/lib/calc/presets";

type State = {
  scenarios: Scenario[];
  activeId: string | null;
  selectedCompareIds: string[];
  setActive: (id: string) => void;
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
      setActive: (id) => set({ activeId: id }),
      addNew: () =>
        set(() => {
          const s = createBaseScenario();
          s.id = crypto.randomUUID();
          s.name = "New Scenario";
          const arr = [s, ...get().scenarios];
          return { scenarios: arr, activeId: s.id };
        }),
      duplicate: (id) =>
        set(() => {
          const src = get().scenarios.find((x) => x.id === id);
          if (!src) return {} as any;
          const s = duplicateScenario(src, { name: src.name + " (copy)" });
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
    { name: "padeljkt:scenarios" }
  )
);
