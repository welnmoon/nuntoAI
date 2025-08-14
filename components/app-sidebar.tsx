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
import {
  UserCircle,
  MessagesSquare,
  Search,
  Settings,
  TvIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/lib/client-routes";

export function AppSidebar({ chats }: { chats?: Chat[] }) {
  const { data: session } = useSession();
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();

  const handleChatClick = (chatId: number) => {
    router.push(`${CLIENT_ROUTES.chat}${chatId}`);
  };

  return (
    <Sidebar collapsible="icon" className="group/sidebar py-4">
      <SidebarHeader className="px-3 py-2 mb-5">
        <div className="flex gap-2">
          <TvIcon className="size-6 shrink-0" />
          <span className={`shrink-0 ${isCollapsed ? "hidden" : ""}`}>
            Nunto AI
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div>
          <NavItem
            href={CLIENT_ROUTES.home}
            icon={<MessagesSquare className="size-4" />}
            label="Новый чат"
            collapsed={isCollapsed}
          />
          <NavItem
            href="/search"
            icon={<Search className="size-4" />}
            label="Поиск"
            collapsed={isCollapsed}
          />
          <NavItem
            href="/settings"
            icon={<Settings className="size-4" />}
            label="Настройки"
            collapsed={isCollapsed}
          />
        </div>

        {/*Chats*/}
        <div>
          {chats?.map((chat) => {
            const isActive = pathname.includes(`/chat/${chat.id}`);
            return (
              <p
                className={`${
                  isActive && "bg-white text-bold"
                } cursor-pointer px-2 py-1 rounded-md hover:bg-muted transition-colors`}
                onClick={() => handleChatClick(chat.id)}
                key={chat.id}
              >
                {chat.title}
              </p>
            );
          })}
        </div>
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>

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
      className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted transition-colors"
    >
      <span className="shrink-0 ">{icon}</span>
      <span
        className={cn(
          "min-w-0 truncate transition-opacity duration-200 text-md",
          collapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
