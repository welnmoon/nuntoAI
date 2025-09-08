"use client";
import { useAccentColorState } from "@/store/accent-color-store";
import { useEffect } from "react";

export function AccentColorApplier() {
  const accent = useAccentColorState((s) => s.accentColor);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);

    const map: Record<string, string> = {
      black: "#111827",
      gray: "#6b7280",
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      purple: "#8b5cf6",
      orange: "#f97316",
      pink: "#ec4899",
      teal: "#14b8a6",
      yellow: "#f59e0b",
    };
    document.documentElement.style.setProperty("--accent", map[accent]);
  }, [accent]);

  return null;
}
