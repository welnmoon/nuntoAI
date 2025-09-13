"use client";

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
