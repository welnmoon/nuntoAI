// components/app-sidebar.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserCircle, MessagesSquare, Search, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { data: session } = useSession();
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="group/sidebar py-4">
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center gap-2">
          <UserCircle className="size-7 shrink-0" />
          <span
            className={cn(
              "min-w-0 truncate transition-opacity duration-200",
              isCollapsed ? "opacity-0" : "opacity-100"
            )}
          >
            {session?.user?.name || session?.user?.email || "Гость"}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavItem
          href="/chats"
          icon={<MessagesSquare className="size-5" />}
          label="Мои чаты"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/search"
          icon={<Search className="size-5" />}
          label="Поиск"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/settings"
          icon={<Settings className="size-5" />}
          label="Настройки"
          collapsed={isCollapsed}
        />
      </SidebarContent>

      <SidebarFooter>{/* футер по желанию */}</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <span
        className={cn(
          "min-w-0 truncate transition-opacity duration-200",
          collapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
