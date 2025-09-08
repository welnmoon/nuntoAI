// components/app-sidebar.tsx
"use client";

import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { MessagesSquare, Search, TvIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useChatStore } from "@/store/chats-store";
import { useEffect, useState } from "react";
import ProfileModal from "../profile/profile-modal";
import { NavItem } from "./nav-item";
import AppSidebarPopover from "./popover";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import SidebarFooterComponent from "./sidebar-footer";
import SearchModal from "../search/search-modal";
import { SettingsModal } from "../settings/settings-modal";

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
        <div className="flex gap-2 items-center">
          <TvIcon className="size-6 shrink-0" />
          <span className={cn("shrink-0", isCollapsed && "hidden")}>
            Nunto AI
          </span>
        </div>
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
                "text-md text-gray-500 shrink-0",
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
                "text-md text-gray-500 shrink-0",
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

      <SidebarFooterComponent
        isCollapsed={isCollapsed}
        session={session}
        setOpenModal={setOpenProfileModal}
      />

      <ProfileModal
        session={session}
        openModal={openProfileModal}
        setOpenModal={setOpenProfileModal}
        setSettingsModalOpen={setSettingsModalOpen}
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
