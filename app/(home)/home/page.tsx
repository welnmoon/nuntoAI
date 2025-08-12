"use client";

import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useRef, useEffect, useState } from "react";
import Heading from "@/components/headers/heading";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const session = useSession();
  const userName = session.data?.user?.name || "Гость";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (e) {
      toast.error(
        "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже."
      );
      console.error("Ошибка при отправке сообщения:", e);
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
              key={i}
              className={`mb-2 flex ${
                m.role === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded shadow
                               ${
                                 m.role === "user"
                                   ? "bg-blue-100 text-blue-800"
                                   : "bg-green-100 text-green-800"
                               }`}
              >
                {m.content}
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
}
