"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccentColor, useAccentColorState } from "@/store/accent-color-store";
import { useEffect, useMemo } from "react";

const ColorThemeSelect = () => {
  const { accentColor, setAccentColor } = useAccentColorState();

  const colorMap = useMemo(
    () => ({
      black: { bg: "#111827", fg: "#ffffff" },
      gray: { bg: "#6b7280", fg: "#0b1220" },
      red: { bg: "#ef4444", fg: "#ffffff" },
      blue: { bg: "#3b82f6", fg: "#ffffff" },
      green: { bg: "#22c55e", fg: "#0b1220" },
      purple: { bg: "#8b5cf6", fg: "#0b1220" },
      orange: { bg: "#f97316", fg: "#0b1220" },
      pink: { bg: "#ec4899", fg: "#0b1220" },
      teal: { bg: "#14b8a6", fg: "#0b1220" },
      yellow: { bg: "#f59e0b", fg: "#0b1220" },
    }),
    []
  );

  useEffect(() => {
    const { bg, fg } = colorMap[accentColor];
    const root = document.documentElement;
    root.style.setProperty("--accent", bg);
    root.style.setProperty("--accent-foreground", fg);
  }, [accentColor, colorMap]);

  return (
    <div className="flex items-center justify-between py-1">
      <span>Акцентный цвет</span>
      <Select
        value={accentColor}
        onValueChange={(v) => setAccentColor(v as AccentColor)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Выберите цвет" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className="z-[60]">
          {Object.keys(colorMap).map((c) => (
            <SelectItem key={c} value={c}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{
                    backgroundColor: colorMap[c as keyof typeof colorMap].bg,
                  }}
                />
                {c}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorThemeSelect;
