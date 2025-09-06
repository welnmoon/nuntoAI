import { Chat } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Message } from "@prisma/client";

interface State {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  setChats: (chats: Chat[]) => void;
  removeChat: (chatId: number) => void;
  updateChatName: (chatId: number, name: string) => void;
  pendingMessages: Record<number, Message[]>;
  addPendingMessage: (chatId: number, msg: Message) => void;
  clearPendingMessages: (chatId: number) => void;

  updateChatTitle: (chatId: number, title: string) => void;
}

export const useChatStore = create<State>()(
  persist(
    (set, get) => ({
      chats: [],
      pendingMessages: {},
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
      addPendingMessage: (chatId: number, msg: Message) =>
        set((state) => ({
          pendingMessages: {
            ...state.pendingMessages,
            [chatId]: [...(state.pendingMessages[chatId] || []), msg],
          },
        })),
      clearPendingMessages: (chatId: number) =>
        set((state) => {
          const copy = { ...state.pendingMessages };
          delete copy[chatId];
          return { pendingMessages: copy };
        }),
      updateChatTitle: (chatId: number, title: string) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        })),
    }),
    {
      name: "chats-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
