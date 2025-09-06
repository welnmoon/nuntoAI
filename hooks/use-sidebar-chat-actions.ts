"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chats-store";
import { usePinnedChatsStore } from "@/store/pinned-chats-store";
import API_ROUTES from "@/lib/api-routes";
import toast from "react-hot-toast";
import { CLIENT_ROUTES } from "@/lib/client-routes";

export function useSidebarChatActions() {
  const router = useRouter();
  const updateChatTitle = useChatStore((s) => s.updateChatTitle);
  const removeChat = useChatStore((s) => s.removeChat);
  const togglePinnedChat = usePinnedChatsStore((s) => s.togglePinnedChat);
  const removePinnedById = usePinnedChatsStore((s) => s.removePinnedById);
  const renamePinnedChatTitle = usePinnedChatsStore((s) => s.renameChatTitle);

  const openChat = (chatId: number) => {
    router.push(`${CLIENT_ROUTES.chat}${chatId}`);
  };

  const renameChat = async (chatId: number, title: string) => {
    const trimmed = title.trim();
    if (trimmed.length < 2) {
      toast.error("Название чата должно быть не менее 2 символов");
      return false;
    }
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (!res.ok) throw new Error("Не удалось обновить название");
      const data = await res.json();
      updateChatTitle(data.id, data.title);
      renamePinnedChatTitle(data.id, data.title);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка обновления чата");
      return false;
    }
  };

  const deleteChat = async (chatId: number) => {
    // оптимистично удаляем локально
    removePinnedById(chatId);
    removeChat(chatId);
    try {
      const res = await fetch(`${API_ROUTES.chats.delete}${chatId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Не удалось удалить чат");
      toast.success("Чат удалён");
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка удаления чата");
      return false;
    }
  };

  return {
    openChat,
    renameChat,
    deleteChat,
    togglePinnedChat,
  };
}
