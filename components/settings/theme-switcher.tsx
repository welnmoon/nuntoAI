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
import { ThemeSwitcherBtn } from "../buttons/theme-switcher-btn";

const ThemeSwitcher = () => {
  return (
    <div className="flex items-center justify-between py-1">
      <span>Тема</span>
      <ThemeSwitcherBtn />
    </div>
  );
};

export default ThemeSwitcher;
