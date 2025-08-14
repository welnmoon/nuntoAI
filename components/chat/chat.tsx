"use client";
import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import Heading from "@/components/headers/heading";
import { Chat, Message, MessageRole } from "@prisma/client";
import { TvIcon, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
  console.log("user id", session.data?.user.id);
  // Синхронизируем state при смене чата/props
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, chat?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Создаём userMsg всегда
    const userMsg: Message = {
      id: Date.now(),
      chatId: chat?.id ?? 0,
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
      chatId: chat?.id ?? 0,
      role: MessageRole.ASSISTANT,
      content: "...",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    // Запрос в API только для авторизованных
    if (isAuth) {
      try {
        // Отправляем user message в БД
        const resUser = await fetch(`/api/chats/${chat?.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMsg.content, role: "USER" }),
        });
        if (!resUser.ok) {
          throw new Error("Ошибка при отправке сообщения");
        }
        // Запрашиваем ответ от AI
        const res = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg.content }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Ошибка ответа ИИ");
        }
        // Сохраняем ассистентское сообщение в БД
        await fetch(`/api/chats/${chat?.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.reply, role: "ASSISTANT" }),
        });
        // Заменяем локально последний ассистентский ответ
        setMessages((prev) => {
          const arr = [...prev];
          const idx = arr.findIndex((m) => m.id === assistantMsg.id);
          if (idx !== -1) {
            arr[idx] = {
              ...assistantMsg,
              content: data.reply,
            };
          }
          return arr;
        });
      } catch (err: any) {
        toast.error(err.message || "Ошибка отправки сообщения");
        // Удаляем ассистент-плейсхолдер
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
      } finally {
        setLoading(false);
      }
    } else {
      // Гость — только эмулируем ответ AI (минимально)
      setTimeout(() => {
        setMessages((prev) => {
          const arr = [...prev];
          const idx = arr.findIndex((m) => m.id === assistantMsg.id);
          if (idx !== -1) {
            arr[idx] = {
              ...assistantMsg,
              content: "[guest mode: ответ AI не доступен]",
            };
          }
          return arr;
        });
        setLoading(false);
      }, 1200);
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {m.content}
                </ReactMarkdown>
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
