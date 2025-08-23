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
import { useChatStore } from "@/store/chats-store";
import { useEffect, useState } from "react";
import ProfileModal from "./profile/profile-modal";

export function AppSidebar({ chats }: { chats?: Chat[] }) {
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();
  const setChats = useChatStore((state) => state.setChats);
  const chatsFromStore = useChatStore((state) => state.chats);

  useEffect(() => {
    if (chats) {
      setChats(chats);
    }
  }, [chats]);

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
        </div>

        {/*Chats*/}
        <div>
          {chatsFromStore
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((chat, i) => {
              const isActive = pathname.includes(`/chat/${chat.id}`);
              return (
                <p
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`${
                    isActive && "bg-white text-bold"
                  } cursor-pointer px-2 py-1 rounded-md hover:bg-muted transition-colors shrink-0 overflow-hidden`} // важно: overflow-hidden
                >
                  <span
                    className={`block min-w-0 truncate will-change-transform transition-all ease-out
            ${
              isCollapsed
                ? "opacity-0 -translate-x-2 pointer-events-none"
                : `opacity-100 translate-x-0 duration-300 delay-[${i * 40}ms]`
            }`}
                  >
                    {chat.title + " " + chat.id}
                  </span>
                </p>
              );
            })}
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-muted rounded-md transition-colors"
        >
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

      <ProfileModal
        session={session}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

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
