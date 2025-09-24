import { DEFAULT_MODEL } from "@/constants/allowed-models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const useSelectedModelsStore = create<State>()(
  persist(
    (set) => ({
      selectedModel: DEFAULT_MODEL,
      setSelectedModel: (model: string) => set({ selectedModel: model }),
    }),
    { name: "selected-models-store" }
  )
);
