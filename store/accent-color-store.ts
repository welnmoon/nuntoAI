// stores/accent-color.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccentColor =
  | "gray"
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "teal"
  | "yellow"
  | "black";

type State = {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  reset: () => void;
};

export const useAccentColorState = create<State>()(
  persist(
    (set) => ({
      accentColor: "black",
      setAccentColor: (color) => set({ accentColor: color }),
      reset: () => set({ accentColor: "black" }),
    }),
    {
      name: "ui:accent-color:v1", // ключ в localStorage
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
