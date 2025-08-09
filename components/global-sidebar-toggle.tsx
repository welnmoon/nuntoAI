// components/GlobalSidebarToggle.tsx
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function GlobalSidebarToggle() {
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "fixed top-3 z-50 rounded-xl bg-white/70 backdrop-blur shadow-sm border p-2 transition-all duration-200",
        isCollapsed ? "left-[4.5rem]" : "left-[17rem]"
      )}
    >
      <SidebarTrigger aria-label="Toggle sidebar" />
    </div>
  );
}
