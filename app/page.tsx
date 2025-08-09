"use client";

import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setResponse(data.reply);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: data.reply },
    ]);
    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between px-6 py-6 pt-6 pb-3 max-w-2xl mx-auto">
      {response && (
        <div className="mt-6 p-4 flex rounded whitespace-pre-wrap">
          {messages.map((m) => (
            <div
              key={`${m.role}-${m.content}`}
              className={`mb-2 ${
                m.role === "user" ? "text-blue-600 flex-end" : "text-green-600"
              }`}
            >
              <strong>{m.role === "user" ? "Вы:" : "ИИ:"}</strong> {m.content}
            </div>
          ))}
        </div>
      )}

      <div
        className={`${
          messages.length > 0
            ? "sticky bottom-0"
            : "flex-1 flex gap-5 justify-center items-center"
        }`}
      >
        {messages.length === 0 && (
          <h1 className="text-2xl font-bold text-center mb-2">
            Добро пожаловать {session.data?.user.name}!
          </h1>
        )}
        <SendToAIForm
          handleSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          loading={loading}
        />

        {/*Footer*/}
      </div>
      <footer className=" bg-white text-center mt-2  text-sm text-gray-500">
        <p>
          Nunto AI может допускать ошибки. Рекомендуем проверять важную
          информацию.
        </p>
      </footer>
    </main>
  );
}
