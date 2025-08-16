"use client";
import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import Heading from "@/components/headers/heading";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useChatStore } from "@/store/chats-store";
import { Chat, Message, MessageRole } from "@prisma/client";
import { TvIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { BeatLoader } from "react-spinners";

interface Props {
  chat?: Chat;
  messages: Message[];
}

const ChatComponent = ({ chat, messages: initialMessages }: Props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const userName = session.data?.user?.name || "Гость";
  const isAuth = !!session.data?.user;
  const pathName = usePathname();
  const router = useRouter();
  const addChat = useChatStore((state) => state.addChat);
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, chat?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let currentChat = chat;
    let currentChatId = chat?.id ?? 0;
    let createdNewChat = false;

    // Создаём userMsg всегда
    const userMsg: Message = {
      id: Date.now(),
      chatId: currentChatId,
      role: MessageRole.USER,
      content: input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = {
      id: Date.now() + 1,
      chatId: currentChatId,
      role: MessageRole.ASSISTANT,
      content: "...",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      // Если это первое сообщение и пользователь авторизован, создаем чат
      if (isAuth && !currentChat && pathName.includes(CLIENT_ROUTES.home)) {
        const createChatRes = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!createChatRes.ok) {
          throw new Error("Ошибка при создании чата");
        }

        const newChat = await createChatRes.json();
        currentChat = newChat;
        currentChatId = newChat.id;
        addChat(newChat);
        // Обновляем chatId для сообщений
        userMsg.chatId = currentChatId;
        assistantMsg.chatId = currentChatId;
        createdNewChat = true;
      }

      // Отправляем user message в БД
      if (isAuth && currentChatId !== 0) {
        const resUser = await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMsg.content, role: "USER" }),
        });
        if (!resUser.ok) {
          throw new Error("Ошибка при отправке сообщения");
        }
      }

      // Запрашиваем ответ от AI [Streaming]
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      if (!res.ok && !res.body) {
        const data = await res.json().catch(() => ({ error: "" }));
        throw new Error(data.error || "Ошибка ответа ИИ");
      }

      const reader = res.body!.getReader();
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

      if (isAuth && currentChatId !== 0) {
        // Сохраняем ассистентское сообщение в БД
        await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: fullReply, role: "ASSISTANT" }),
        });
      }

      // Заменяем локально последний ассистентский ответ
      setMessages((prev) => {
        const arr = [...prev];
        const idx = arr.findIndex((m) => m.id === assistantMsg.id);
        if (idx !== -1) {
          arr[idx] = {
            ...assistantMsg,
            content: data.reply,
            chatId: currentChatId,
          };
        }
        return arr;
      });
      if (createdNewChat) {
        router.push(`${CLIENT_ROUTES.chat}${currentChatId}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ошибка отправки сообщения";
      toast.error(message);
      // Удаляем ассистент-плейсхолдер
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col w-1/2 max-w-1/2 mx-auto">
      {messages.length > 0 ? (
        <section className="flex-1 overflow-y-auto px-4 py-6">
          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`mb-4 flex  ${
                m.role === MessageRole.USER
                  ? "justify-end ml-4"
                  : "justify-start mr-4"
              }`}
            >
              {m.role === MessageRole.ASSISTANT && (
                <TvIcon className={`size-6 mr-2 shrink-0 flex-start`} />
              )}

              <div
                className={`max-w-[80%] px-4 py-2 rounded shadow prose max-w-none
                               ${
                                 m.role === MessageRole.USER
                                   ? "bg-gray-100 text-gray-800"
                                   : " text-gray-800"
                               }`}
              >
                {loading && m.id === messages[messages.length - 1].id ? (
                  <BeatLoader size={5} />
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </section>
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
    </main>
  );
};

export default ChatComponent;
