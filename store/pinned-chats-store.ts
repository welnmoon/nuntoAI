import { Chat } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  pinnedChats: Chat[];
  //   addPinnedChat: (chat: Chat) => void;
  //   deletePinnedChat: (chatId: number) => void;
  togglePinnedChat: (chat: Chat) => void;
  removePinnedById: (id: number) => void;
}

// export const usePinnedChatsStore = create<State>()(
//   persist(
//     (set) => ({
//       pinnedChats: [],
//       addPinnedChat: (chat: Chat) =>
//         set((state) => ({
//           pinnedChats: state.pinnedChats.find((pinned) => pinned.id === chat.id)
//             ? state.pinnedChats
//             : [...state.pinnedChats, chat],
//         })),
//       deletePinnedChat: (chatId: number) =>
//         set((state) => ({
//           pinnedChats: state.pinnedChats.filter((chat) => chat.id !== chatId),
//         })),
//     }),
//     { name: "pinned-chats-store" }
//   )
// );

export const usePinnedChatsStore = create<State>()(
  persist(
    (set) => ({
      pinnedChats: [],
      togglePinnedChat: (chat: Chat) =>
        set((state) => ({
          pinnedChats: state.pinnedChats.find((pinned) => pinned.id === chat.id)
            ? state.pinnedChats.filter((pch) => pch.id !== chat.id)
            : [...state.pinnedChats, chat],
        })),
      removePinnedById: (id) =>
        set((s) => ({ pinnedChats: s.pinnedChats.filter((p) => p.id !== id) })),
    }),
    {
      name: "pinned-chats-store",
    }
  )
);
