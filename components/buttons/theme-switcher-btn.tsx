"use client";

import { useTheme } from "next-themes";

export function ThemeSwitcherBtn() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 border rounded dark:border-gray-700"
    >
      {theme === "dark" ? "Светлая" : "Тёмная"}
    </button>
  );
}
