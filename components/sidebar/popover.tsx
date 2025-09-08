"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import { Chat } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { useState, useCallback } from "react";
import { useSidebarChatActions } from "@/hooks/use-sidebar-chat-actions";
import { usePathname } from "next/navigation";
import { ShareToggle } from "../share-toggle";

interface Props {
  chat: Chat;
  isCollapsed: boolean;
  index: number;
}

const AppSidebarPopover = ({ chat, isCollapsed, index }: Props) => {
  const pinnedChats = usePinnedChatsStore((s) => s.pinnedChats);
  const isPinned = pinnedChats.some((pch) => pch.id === chat.id);
  const { openChat, renameChat, deleteChat, togglePinnedChat } =
    useSidebarChatActions();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [sending, setSending] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === `/home/chat/${chat.id}`;

  const startEdit = useCallback(() => {
    setTitle(chat.title);
    setEditing(true);
  }, [chat.title]);

  const commit = useCallback(async () => {
    if (!editing) return;
    setSending(true);
    try {
      const ok = await renameChat(chat.id, title);
      if (ok) setEditing(false);
    } finally {
      setSending(false);
    }
  }, [editing, renameChat, chat.id, title]);

  return (
    <Popover key={chat.id}>
      <p
        onClick={() => {
          if (!editing) openChat(chat.id);
        }}
        className={cn(
          "group/chat flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors shrink-0 overflow-hidden",
          isActive && "bg-white font-semibold"
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate will-change-transform transition-all ease-out",
            isCollapsed
              ? "opacity-0 -translate-x-2 pointer-events-none"
              : "opacity-100 translate-x-0"
          )}
          style={{ transitionDelay: `${index * 40}ms` }}
        >
          {editing ? (
            <input
              autoFocus
              className="w-full min-w-0 bg-transparent outline-none border border-transparent focus:border-muted rounded px-1 py-0.5"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void commit();
                  e.currentTarget.blur();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setEditing(false);
                }
              }}
              onBlur={() => {
                const trimmed = title.trim();
                if (trimmed.length === 0) {
                  setEditing(false);
                } else {
                  void commit();
                }
              }}
              disabled={sending}
            />
          ) : (
            <p>{chat.title}</p>
          )}
        </span>

        <div className="ml-auto w-7 h-7 grid place-items-center">
          <PopoverTrigger asChild>
            <span
              className={cn(
                "size-6 rounded transition-opacity focus:opacity-100 items-center justify-center grid text-gray-400 cursor-pointer",
                isCollapsed
                  ? "opacity-0 pointer-events-none"
                  : "opacity-0 group-hover/chat:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
              aria-label="Меню чата"
            >
              <Ellipsis className="size-4 text-gray-400" />
            </span>
          </PopoverTrigger>
        </div>
      </p>

      <PopoverContent
        side="right"
        align="end"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-64 p-2"
      >
        <div className="flex flex-col">
          <button
            onClick={startEdit}
            className="text-left px-2 py-1 rounded hover:bg-muted"
          >
            Переименовать
          </button>
          <button
            onClick={() => togglePinnedChat(chat)}
            className="text-left px-2 py-1 rounded hover:bg-muted"
          >
            {isPinned ? "Открепить" : "Закрепить"}
          </button>
          <button
            onClick={() => void deleteChat(chat.id)}
            className="text-left px-2 py-1 rounded hover:bg-muted text-red-600"
          >
            Удалить
          </button>

          <ShareToggle
            chatId={chat.id}
            isShared={chat.visibility === "SHARED"}
            publicId={chat.publicId ?? undefined}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AppSidebarPopover;
