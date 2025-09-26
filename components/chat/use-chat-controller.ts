"use client";

/**
 * Хук-контроллер для страницы чата.
 *
 * Отвечает за:
 * - локальное состояние ввода, списка сообщений и состояния загрузки;
 * - работу с временным чатом (без сохранения в БД);
 * - создание постоянного чата при первой отправке (если нужно);
 * - стриминг ответа модели и сохранение сообщений в БД при наличии чата;
 * - скролл к последнему сообщению и очистку pending-сообщений из стора.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useQuerySetter } from "@/hooks/use-query-setter";
import { useChatStore } from "@/store/chats-store";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { streamAI } from "@/lib/ai-stream";
import {
  fromUnknownTariff,
  getDefaultModelForTariff,
  isModelAllowedForTariff,
} from "@/constants/allowed-models";

import { Chat, Message, MessageRole } from "@prisma/client";
import { MESSAGE_LENGTH_LIMIT } from "@/constants/message-limit";
import { useSelectedModelsStore } from "@/store/selected-models-store";

const EMPTY_MESSAGES: Message[] = [];
export const TEMP_CHAT_ID = -1; // ключ для временного чата в сторах/локальном UI

interface UseChatControllerParams {
  chat?: Chat;
  initialMessages?: Message[];
}

export function useChatController({
  chat,
  initialMessages,
}: UseChatControllerParams) {
  // --- Базовые состояния UI ---
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? []);

  // --- Ссылки для скролла и отмены стрима ---
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // --- Инфо о пользователе и текущем роута ---
  const { data: session } = useSession();
  const userName = session?.user?.name || "Гость";
  const isAuth = !!session?.user;
  const tariffSlug = fromUnknownTariff(session?.user?.tariffSlug);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  if (!pathName || !searchParams) {
    throw new Error("useChatController must be used in a client component");
  }

  const isTemporary = searchParams.get("temporary") === "true";
  const setQuery = useQuerySetter();

  // --- Стор чатов ---
  const addChat = useChatStore((s) => s.addChat);
  const addPendingMessage = useChatStore((s) => s.addPendingMessage);
  const clearPendingMessages = useChatStore((s) => s.clearPendingMessages);
  const touchChat = useChatStore((s) => s.touchChat);

  const chatId = chat?.id;

  // читаем pending по реальному chatId или по временной ячейке
  const pendingMessages = useChatStore((s) => {
    const key = isTemporary ? TEMP_CHAT_ID : chatId ?? null;
    if (key === null) return EMPTY_MESSAGES;
    return s.pendingMessages[key] ?? EMPTY_MESSAGES;
  });

  // при получении настоящих сообщений очищаем черновики этого чата
  useEffect(() => {
    setMessages(initialMessages ?? []);
    if (chat?.id) clearPendingMessages(chat.id);
  }, [initialMessages, chat?.id, clearPendingMessages]);

  // авто-скролл к последнему сообщению
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // отменяем активный стрим при размонтировании
  useEffect(
    () => () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    },
    []
  );

  // Утилита: переключение временного режима через query-параметр
  const toggleTemporary = useMemo(
    () => () =>
      setQuery("temporary", isTemporary ? null : "true", { replace: true }),
    [isTemporary, setQuery]
  );

  // Основная отправка сообщения пользователем с обработкой обеих веток
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (input.trim().length > MESSAGE_LENGTH_LIMIT) {
      toast.error(
        `Сообщение превышает лимит в ${MESSAGE_LENGTH_LIMIT} символов.`
      );
      return;
    }

    let currentChat = chat;
    let currentChatId = chat?.id ?? 0;

    const now = new Date();
    const userMsg: Message = {
      id: Date.now(),
      chatId: currentChatId,
      role: MessageRole.USER,
      content: input,
      createdAt: now,
      updatedAt: now,
    };
    const assistantMsg: Message = {
      id: Date.now() + 1,
      chatId: currentChatId,
      role: MessageRole.ASSISTANT,
      content: "...",
      createdAt: now,
      updatedAt: now,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);

    try {
      // отменим предыдущий стрим, если он вдруг остался
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      // --- ВРЕМЕННЫЙ ЧАТ (ничего не пишем в БД) ---
      if (isTemporary) {
        userMsg.chatId = TEMP_CHAT_ID;
        assistantMsg.chatId = TEMP_CHAT_ID;

        await streamAI(
          userMsg.content,
          selectedModel,
          signal,
          (_chunk, fullReply) => {
            setMessages((prev) => {
              const arr = [...prev];
              const idx = arr.findIndex((m) => m.id === assistantMsg.id);
              if (idx !== -1) {
                arr[idx] = {
                  ...assistantMsg,
                  content: fullReply,
                  chatId: TEMP_CHAT_ID,
                };
              }
              return arr;
            });
          }
        );

        return; // для временного чата на этом всё
      }

      // --- ПОСТОЯННЫЙ ЧАТ ---
      // создаём чат только если мы на /home, авторизованы и чата ещё нет
      if (isAuth && !currentChat && pathName.includes(CLIENT_ROUTES.home)) {
        let createChatRes: Response;
        try {
          createChatRes = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (!createChatRes.ok) throw new Error("Ошибка при создании чата");
        } catch {
          toast.error(
            "Не удалось создать чат. Пожалуйста, попробуйте ещё раз."
          );
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
          return;
        }

        const newChat: Chat = await createChatRes.json();
        currentChat = newChat;
        currentChatId = newChat.id;

        addChat(newChat); // обновляем список чатов в сторе

        // поправим chatId в наших двух сообщениях
        userMsg.chatId = currentChatId;
        assistantMsg.chatId = currentChatId;

        // добавим в pending-превью для сайдбара
        addPendingMessage(currentChatId, userMsg);
        addPendingMessage(currentChatId, assistantMsg);
      }

      // Сохраняем пользовательское сообщение в БД
      if (isAuth && currentChatId !== 0) {
        const resUser = await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMsg.content, role: "USER" }),
        });
        if (!resUser.ok) throw new Error("Ошибка при отправке сообщения");
        // Локально подвинем чат вверх сразу после отправки
        touchChat(currentChatId);
      }

      // Стримим ответ ассистента и по мере прихода чанков обновляем последний месседж
      const fullReply = await streamAI(
        userMsg.content,
        selectedModel,
        signal,

        (_chunk, full) => {
          setMessages((prev) => {
            const arr = [...prev];
            const idx = arr.findIndex((m) => m.id === assistantMsg.id);
            if (idx !== -1) {
              arr[idx] = {
                ...assistantMsg,
                content: full,
                chatId: currentChatId,
              };
            }
            return arr;
          });
        }
      );

      // Сохраняем ответ ассистента в БД
      if (isAuth && currentChatId !== 0) {
        await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: fullReply, role: "ASSISTANT" }),
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка отправки сообщения";
      toast.error(message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
    } finally {
      setLoading(false);
      // если стрим успешно закончился — очищаем контроллер
      controllerRef.current = null;
    }
  };

  // --- Model ---
  const selectedModel = useSelectedModelsStore((s) => s.selectedModel);
  const setSelectedModel = useSelectedModelsStore((s) => s.setSelectedModel);

  useEffect(() => {
    if (!isModelAllowedForTariff(selectedModel, tariffSlug)) {
      const fallbackModel = getDefaultModelForTariff(tariffSlug);
      setSelectedModel(fallbackModel);
    }
  }, [selectedModel, setSelectedModel, tariffSlug]);

  return {
    // состояние
    input,
    setInput,
    loading,
    messages,
    pendingMessages,
    bottomRef,
    // данные/флаги
    chatId,
    isTemporary,
    userName,
    // действия
    handleSubmit,
    toggleTemporary,
    // model
    selectedModel,
    setSelectedModel,
    tariffSlug,
  };
}
