// components/app-sidebar.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { MessagesSquare, Search, TvIcon, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useChatStore } from "@/store/chats-store";
import { useEffect, useState } from "react";
import ProfileModal from "../profile/profile-modal";
import { NavItem } from "./nav-item";
import AppSidebarPopover from "./popover";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import SearchModal from "../search/search-modal";
import { SettingsModal } from "../settings/settings-modal";
import LogotypeNunto from "../logotype-nunto";

export function AppSidebar({ chats }: { chats?: Chat[] }) {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  // ----
  const { data: session } = useSession();
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";

  const setChats = useChatStore((s) => s.setChats);
  const chatsFromStore = useChatStore((s) => s.chats);

  useEffect(() => {
    if (chats) setChats(chats);
  }, [chats, setChats]);

  // Pinned Chats Logic
  const pinnedChats = usePinnedChatsStore((s) => s.pinnedChats);
  const pinnedIds = pinnedChats.map((p) => p.id);
  const justChats = chatsFromStore.filter((c) => !pinnedIds.includes(c.id));

  // Search logic
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const FlagSettingModalOpen = searchModalOpen === true;
  useEffect(() => {
    setOpenProfileModal(false);
  }, [FlagSettingModalOpen]);

  return (
    <Sidebar collapsible="icon" className="group/sidebar py-4">
      <SidebarHeader className="px-3 py-2 mb-5">
        <LogotypeNunto isCollapsed={isCollapsed} />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="mb-2">
          <NavItem
            href={CLIENT_ROUTES.home}
            icon={<MessagesSquare className="size-4" />}
            label="Новый чат"
            collapsed={isCollapsed}
          />
          <NavItem
            icon={<Search className="size-4" />}
            label="Поиск"
            collapsed={isCollapsed}
            onClick={() => setSearchModalOpen(true)}
          />
        </div>

        {/*PinnedChats*/}
        {pinnedChats.length > 0 && (
          <div className="space-y-1 mb-5">
            <p
              className={cn(
                "text-md text-gray-500 dark:text-gray-400 shrink-0",
                isCollapsed && "hidden"
              )}
            >
              Закрепленные чаты
            </p>
            {pinnedChats
              ?.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((chat, i) => (
                <AppSidebarPopover
                  key={chat.id}
                  chat={chat}
                  isCollapsed={isCollapsed}
                  index={i}
                />
              ))}
          </div>
        )}
        {/* Just */}
        {justChats.length > 0 && (
          <div className="space-y-1">
            <p
              className={cn(
                "text-md text-gray-500 dark:text-gray-400 shrink-0",
                isCollapsed && "hidden"
              )}
            >
              Чаты
            </p>
            {justChats
              ?.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((chat, i) => (
                <AppSidebarPopover
                  key={chat.id}
                  chat={chat}
                  isCollapsed={isCollapsed}
                  index={i}
                />
              ))}
          </div>
        )}
      </SidebarContent>

      <ProfileModal
        session={session}
        openModal={openProfileModal}
        setOpenModal={setOpenProfileModal}
        setSettingsModalOpen={setSettingsModalOpen}
        trigger={
          <SidebarFooter>
            <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-muted rounded-md transition-colors">
              <UserCircle className="size-7 shrink-0" />
              <span
                className={cn(
                  "min-w-0 truncate transition-opacity duration-200 ",
                  isCollapsed ? "opacity-0" : "opacity-100"
                )}
              >
                {session?.user?.name || session?.user?.email || "Гость"}
              </span>
            </div>
          </SidebarFooter>
        }
      />
      <SettingsModal
        setSettingsModalOpen={setSettingsModalOpen}
        settingsModalOpen={settingsModalOpen}
      />

      <SearchModal
        chats={chatsFromStore ?? []}
        openModal={searchModalOpen}
        setOpenModal={setSearchModalOpen}
      />

      <SidebarRail />
    </Sidebar>
  );
}
