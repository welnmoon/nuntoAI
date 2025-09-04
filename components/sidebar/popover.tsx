import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import { Chat } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface Props {
  chat: Chat;
  isOpen: boolean;
  setOpenForChatId: Dispatch<SetStateAction<number | null>>;
  editingChatId: number;
  handleChatClick: (chatId: number) => void;
  setHoveredChatId: Dispatch<SetStateAction<number | null>>;
  isActive: boolean;
  isCollapsed: boolean;
  editingChatTitle: string;
  handleChatTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  commitTitle: () => Promise<void>;
  cancelEditChatTitle: () => void;
  hoveredChatId: number;
  setEditingChatId: Dispatch<SetStateAction<number | null>>;
  chatTitleSending: boolean;
  onDeleteChat: (chatId: number) => void;
  togglePinnedChat: (chat: Chat) => void;
  index: number;
}

const AppSidebarPopover = ({
  chat,
  isOpen,
  setOpenForChatId,
  editingChatId,
  handleChatClick,
  setHoveredChatId,
  isActive,
  isCollapsed,
  editingChatTitle,
  handleChatTitleChange,
  commitTitle,
  cancelEditChatTitle,
  hoveredChatId,
  setEditingChatId,
  chatTitleSending,
  togglePinnedChat,
  onDeleteChat,
  index,
}: Props) => {
  const pinnedChats = usePinnedChatsStore((s) => s.pinnedChats);
  const [isPinned, setIsPinned] = useState(
    pinnedChats.some((pch) => pch.id === chat.id)
  );

  return (
    <Popover
      key={chat.id}
      open={isOpen}
      onOpenChange={(open) => setOpenForChatId(open ? chat.id : null)}
    >
      <p
        onClick={() => {
          if (editingChatId !== chat.id) handleChatClick(chat.id);
        }}
        onMouseEnter={() => setHoveredChatId(chat.id)}
        onMouseLeave={() => setHoveredChatId(null)}
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors shrink-0 overflow-hidden",
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
          {editingChatId === chat.id ? (
            <input
              autoFocus
              className="w-full min-w-0 bg-transparent outline-none border border-transparent focus:border-muted rounded px-1 py-0.5"
              value={editingChatTitle}
              onChange={handleChatTitleChange}
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void commitTitle();
                  e.currentTarget.blur();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelEditChatTitle();
                }
              }}
              onBlur={() => {
                const trimmed = editingChatTitle.trim();
                if (trimmed.length === 0) {
                  cancelEditChatTitle();
                } else {
                  void commitTitle();
                }
              }}
              disabled={chatTitleSending}
            />
          ) : (
            <p>{chat.title}</p>
          )}
        </span>

        <div className="ml-auto w-7 h-7 grid place-items-center">
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "size-6 rounded hover:bg-accent transition-opacity focus:opacity-100",
                isCollapsed
                  ? "opacity-0 pointer-events-none"
                  : hoveredChatId === chat.id
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              )}
              onClick={(e) => e.stopPropagation()}
              aria-label="Меню чата"
            >
              <Ellipsis className="size-4 text-gray-400" />
            </button>
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
            onClick={() => setEditingChatId(chat.id)}
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
            onClick={() => onDeleteChat(chat.id)}
            className="text-left px-2 py-1 rounded hover:bg-muted text-red-600"
          >
            Удалить
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AppSidebarPopover;
