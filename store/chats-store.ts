import { Chat } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  setChats: (chats: Chat[]) => void;
  removeChat: (chatId: number) => void;
  updateChatName: (chatId: number, name: string) => void;
}

export const useChatStore = create<State>()(
  persist(
    (set, get) => ({
      chats: [],

      addChat: (chat: Chat) =>
        set((state) => ({
          chats: [...state.chats, chat],
        })),
      setChats: (chats: Chat[]) => set({ chats }),
      removeChat: (chatId: number) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
        })),
      updateChatName: (chatId: number, name: string) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, name } : chat
          ),
        })),
    }),
    {
      name: "chats-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
