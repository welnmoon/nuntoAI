"use client";

import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import Heading from "@/components/headers/heading";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useChatStore } from "@/store/chats-store";
import { Chat, Message, MessageRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatMessages from "./chat-messages";
import { MessageCircleIcon } from "lucide-react";
import { useQuerySetter } from "@/hooks/use-query-setter";

const EMPTY_MESSAGES: Message[] = [];
const TEMP_CHAT_ID = -1; // ключ для временного чата в сторах/локальном UI

interface Props {
  chat?: Chat;
  messages: Message[];
}

export default function ChatComponent({
  chat,
  messages: initialMessages,
}: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Гость";
  const isAuth = !!session?.user;

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTemporary = searchParams.get("temporary") === "true";
  const setQuery = useQuerySetter();

  const addChat = useChatStore((s) => s.addChat);
  const addPendingMessage = useChatStore((s) => s.addPendingMessage);
  const clearPendingMessages = useChatStore((s) => s.clearPendingMessages);

  const chatId = chat?.id;

  // читаем pending по реальному chatId или по временной ячейке
  const pendingMessages = useChatStore((s) => {
    const key = isTemporary ? TEMP_CHAT_ID : chatId ?? null;
    if (key === null) return EMPTY_MESSAGES;
    return s.pendingMessages[key] ?? EMPTY_MESSAGES;
  });

  // при получении настоящих сообщений очищаем черновики этого чата
  useEffect(() => {
    setMessages(initialMessages);
    if (chat?.id) clearPendingMessages(chat.id);
  }, [initialMessages, chat?.id, clearPendingMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      /** =========================
       *  ВЕТКА ВРЕМЕННОГО ЧАТА
       *  НИКАКИХ запросов в БД
       * ========================= */
      if (isTemporary) {
        userMsg.chatId = TEMP_CHAT_ID;
        assistantMsg.chatId = TEMP_CHAT_ID;



        // только стрим из AI
        const res = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg.content }),
        });
        if (!res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullReply = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullReply += chunk;

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

        // ничего не сохраняем в БД
        return;
      }

      /** ===================================
       *  ВЕТКА ПЕРСИСТЕНТ-ЧАТА (обычная)
       * =================================== */
      // создаём чат только если мы на /home, авторизованы и чата ещё нет
      if (isAuth && !currentChat && pathName.includes(CLIENT_ROUTES.home)) {
        let createChatRes: Response;
        try {
          createChatRes = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (!createChatRes.ok) throw new Error("Ошибка при создании чата");
        } catch (error) {
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

        // поправим chatId в наших двух событиях
        userMsg.chatId = currentChatId;
        assistantMsg.chatId = currentChatId;

        // можно добавить в pending, чтобы список чатов показывал превью
        addPendingMessage(currentChatId, userMsg);
        addPendingMessage(currentChatId, assistantMsg);

        // при необходимости — перейти на страницу чата
        // router.push(`${CLIENT_ROUTES.chat}${currentChatId}`);
      }

      // Сохраняем user-сообщение в БД (если есть реальный chatId)
      if (isAuth && currentChatId !== 0) {
        const resUser = await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMsg.content, role: "USER" }),
        });
        if (!resUser.ok) throw new Error("Ошибка при отправке сообщения");
      }

      // Получаем ответ AI (stream)
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkValue = decoder.decode(value, { stream: true });
        fullReply += chunkValue;

        setMessages((prev) => {
          const arr = [...prev];
          const idx = arr.findIndex((m) => m.id === assistantMsg.id);
          if (idx !== -1) {
            arr[idx] = {
              ...assistantMsg,
              content: fullReply,
              chatId: currentChatId,
            };
          }
          return arr;
        });
      }

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
    }
  };
 
  return (
    <main className="min-h-screen flex flex-col w-1/2 max-w-1/2 mx-auto">
      {messages.length > 0 ? (
        <ChatMessages
          messages={messages}
          pendingMessages={pendingMessages}
          loading={loading}
          bottomRef={bottomRef}
        />
      ) : (
        <section className="flex-1 grid place-items-center px-4">
          <div>
            <Heading className="w-100 text-center mb-5" level={2}>
              Добро пожаловать в Nunto AI, {userName}
            </Heading>
            <SendToAIForm
              input={input}
              setInput={setInput}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </div>
        </section>
      )}

      {messages.length > 0 && (
        <section className="sticky bottom-0 bg-white border-t px-4 py-3 place-items-center">
          <SendToAIForm
            input={input}
            setInput={setInput}
            loading={loading}
            handleSubmit={handleSubmit}
            width="w-full"
          />
          <footer className="text-center text-xs text-gray-500 mt-2">
            Nunto AI может допускать ошибки. Проверяйте важную информацию.
          </footer>
        </section>
      )}

      {/* Тогглер «временного» режима — просто ставим параметр query */}
      <MessageCircleIcon
        className={`cursor-pointer absolute top-5 right-5 ${
          isTemporary ? "text-blue-500" : "text-black"
        } size-6`}
        onClick={() =>
          setQuery("temporary", isTemporary ? null : "true", { replace: true })
        }
      />
    </main>
  );
}
