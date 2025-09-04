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
import { UserCircle, MessagesSquare, Search, TvIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chat } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useChatStore } from "@/store/chats-store";
import { useEffect, useRef, useState } from "react";
import ProfileModal from "../profile/profile-modal";
import { NavItem } from "./nav-item";
import toast from "react-hot-toast";
import AppSidebarPopover from "./popover";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import API_ROUTES from "@/lib/api-routes";

export function AppSidebar({ chats }: { chats?: Chat[] }) {
  const [openModal, setOpenModal] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<number | null>(null);
  const [openForChatId, setOpenForChatId] = useState<number | null>(null);

  // Chat Title
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState("");
  const updateChatTitle = useChatStore((s) => s.updateChatTitle);
  const removeChat = useChatStore((s) => s.removeChat);
  const [chatTitleSending, setChatTitleSending] = useState(false);
  const committingRef = useRef(false);

  // ----
  const { data: session } = useSession();
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();

  const setChats = useChatStore((s) => s.setChats);
  const chatsFromStore = useChatStore((s) => s.chats);

  useEffect(() => {
    if (chats) setChats(chats);
  }, [chats, setChats]);

  const handleChatClick = (chatId: number) => {
    router.push(`${CLIENT_ROUTES.chat}${chatId}`);
  };

  const handleChatTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingChatTitle(e.currentTarget.value);
  };

  const sendNewChatTitle = async () => {
    setChatTitleSending(true);
    try {
      const res = await fetch(`/api/chats/${editingChatId}/change-title`, {
        method: "PATCH",
        body: JSON.stringify({ title: editingChatTitle }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to update chat title");
      }
      const data = await res.json();
      updateChatTitle(data.id, data.title);
    } catch (e) {
      console.log("Error updating chat title", e);
      toast.error(
        e instanceof Error ? e.message : "Ошибка обновления названия чата"
      );
    } finally {
      setChatTitleSending(false);
      setEditingChatId(null);
      setEditingChatTitle("");
    }
  };

  const cancelEditChatTitle = () => {
    setEditingChatId(null);
    setEditingChatTitle("");
  };

  const commitTitle = async () => {
    if (!editingChatId) return;

    const nextChatTitle = editingChatTitle.trim();
    const prevChatTitle =
      chatsFromStore.find((c) => c.id === editingChatId)?.title ?? "";

    if (nextChatTitle.length < 2) {
      toast.error("Название чата должно быть не менее 2 символов");
      return;
    }

    if (committingRef.current) return;
    committingRef.current = true;
    try {
      await sendNewChatTitle();
    } finally {
      committingRef.current = false;
    }
  };
  const removePinnedById = usePinnedChatsStore((s) => s.removePinnedById);

  const onDeleteChat = async (chatId: number) => {
    const prevChats = chatsFromStore;
    const prevPins = pinnedChats;
    removePinnedById(chatId);
    removeChat(chatId);
    try {
      const res = await fetch(`${API_ROUTES.chats.delete}${chatId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }

      toast.success("Чат удалён");
    } catch (e) {
      console.log("Error deleting chat", e);
      toast.error(e instanceof Error ? e.message : "Ошибка удаления чата");
    }
  };

  // Pinned Chats Logic
  const pinnedChats = usePinnedChatsStore((s) => s.pinnedChats);
  const togglePinnedChat = usePinnedChatsStore((s) => s.togglePinnedChat);
  const pinnedIds = pinnedChats.map((p) => p.id);
  const justChats = chatsFromStore.filter((c) => !pinnedIds.includes(c.id));

  const handleAddPinChat = (chat: Chat) => {
    togglePinnedChat(chat);
  };

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
            href="/search"
            icon={<Search className="size-4" />}
            label="Поиск"
            collapsed={isCollapsed}
          />
        </div>

        {/*PinnedChats*/}
        {pinnedChats.length > 0 && (
          <div className="space-y-1 mb-5">
            <p className={cn('text-md text-gray-500 shrink-0')}>Закрепленные чаты</p>
            {pinnedChats
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((chat, i) => {
                const isActive = pathname === `${CLIENT_ROUTES.chat}${chat.id}`;
                const isOpen = openForChatId === chat.id;

                return (
                  <AppSidebarPopover
                    key={chat.id}
                    chat={chat}
                    isOpen={isOpen}
                    setOpenForChatId={setOpenForChatId}
                    editingChatId={editingChatId!}
                    handleChatClick={handleChatClick}
                    setHoveredChatId={setHoveredChatId}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    editingChatTitle={editingChatTitle}
                    handleChatTitleChange={handleChatTitleChange}
                    commitTitle={commitTitle}
                    cancelEditChatTitle={cancelEditChatTitle}
                    hoveredChatId={hoveredChatId!}
                    setEditingChatId={setEditingChatId}
                    chatTitleSending={chatTitleSending}
                    togglePinnedChat={togglePinnedChat}
                    onDeleteChat={onDeleteChat}
                    index={i}
                  />
                );
              })}
          </div>
        )}
        {/* Just */}
        {justChats.length > 0 && (
          <div className="space-y-1">
            <p className="text-md text-gray-500">Чаты</p>
            {justChats
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((chat, i) => {
                const isActive = pathname === `${CLIENT_ROUTES.chat}${chat.id}`;
                const isOpen = openForChatId === chat.id;

                return (
                  <AppSidebarPopover
                    key={chat.id}
                    chat={chat}
                    isOpen={isOpen}
                    setOpenForChatId={setOpenForChatId}
                    editingChatId={editingChatId!}
                    handleChatClick={handleChatClick}
                    setHoveredChatId={setHoveredChatId}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    editingChatTitle={editingChatTitle}
                    handleChatTitleChange={handleChatTitleChange}
                    commitTitle={commitTitle}
                    cancelEditChatTitle={cancelEditChatTitle}
                    hoveredChatId={hoveredChatId!}
                    setEditingChatId={setEditingChatId}
                    chatTitleSending={chatTitleSending}
                    onDeleteChat={onDeleteChat}
                    togglePinnedChat={togglePinnedChat}
                    index={i}
                  />
                );
              })}
          </div>
        )}
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
