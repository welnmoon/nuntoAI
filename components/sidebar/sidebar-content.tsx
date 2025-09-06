"use client";

import { SidebarContent } from "@/components/ui/sidebar";
import { MessagesSquare, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { NavItem } from "./nav-item";
import AppSidebarPopover from "./popover";
import { Chat } from "@prisma/client";

interface Props {
  isCollapsed: boolean;
  pinnedChats: Chat[];
  justChats: Chat[];
}

const SidebarContentComponent = ({ isCollapsed, pinnedChats, justChats }: Props) => {
  return (
    <SidebarContent className="px-2">
      <div className="mb-2">
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
      </div>

      {pinnedChats.length > 0 && (
        <div className="space-y-1 mb-5">
          <p className={cn("text-md text-gray-500 shrink-0", isCollapsed && "hidden")}>Закрепленные чаты</p>
          {pinnedChats
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((chat, i) => (
              <AppSidebarPopover key={chat.id} chat={chat} isCollapsed={isCollapsed} index={i} />
            ))}
        </div>
      )}

      {justChats.length > 0 && (
        <div className="space-y-1">
          <p className={cn("text-md text-gray-500 shrink-0", isCollapsed && "hidden")}>Чаты</p>
          {justChats
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((chat, i) => (
              <AppSidebarPopover key={chat.id} chat={chat} isCollapsed={isCollapsed} index={i} />
            ))}
        </div>
      )}
    </SidebarContent>
  );
};

export default SidebarContentComponent;
