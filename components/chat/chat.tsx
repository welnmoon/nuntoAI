"use client";

import SendToAIForm from "@/components/form/main-form/send-to-ai-form";
import Heading from "@/components/headers/heading";
import ChatMessages from "./chat-messages";
import { MessageCircleIcon } from "lucide-react";
import { Chat, Message } from "@prisma/client";
import { useChatController } from "./use-chat-controller";
import { useSession } from "next-auth/react";
import LogInBtn from "../buttons/log-in-btn";

interface Props {
  chat?: Chat;
  messages: Message[];
}

export default function ChatComponent({
  chat,
  messages: initialMessages,
}: Props) {
  const {
    input,
    setInput,
    loading,
    messages,
    pendingMessages,
    bottomRef,
    chatId,
    isTemporary,
    userName,
    handleSubmit,
    toggleTemporary,
  } = useChatController({ chat, initialMessages });
  const session = useSession();
  const isAuthenticated = !!session.data?.user;

  return (
    <main className="min-h-screen flex flex-col w-[90%] md:w-1/2 max-w-[700px] mx-auto">
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
              {isTemporary
                ? "Временный чат"
                : `Добро пожаловать в Nunto AI, ${userName}`}
            </Heading>
            {isTemporary && (
              <p className="text-center w-100 text-gray-500 dark:text-gray-400 mb-10">
                Этот чат не появится в журнале, не будет использовать или
                обновлять память Nunto AI и не будет использоваться для обучения
                наших моделей.
              </p>
            )}
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
        <section className="dark:bg-transparent sticky bottom-0 bg-white border-t dark:border-t-gray-800 px-4 py-3 place-items-center">
          <SendToAIForm
            input={input}
            setInput={setInput}
            loading={loading}
            handleSubmit={handleSubmit}
            width="w-full"
          />
          <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Nunto AI может допускать ошибки. Проверяйте важную информацию.
          </footer>
        </section>
      )}

      {/* Тогглер «временного» режима — просто ставим параметр query */}
      {!chatId && isAuthenticated && (
        <MessageCircleIcon
          className={`cursor-pointer absolute top-5 right-5 ${
            isTemporary
              ? "text-blue-500 dark:text-blue-400"
              : "text-black dark:text-white"
          } size-6`}
          onClick={toggleTemporary}
        />
      )}

      {!isAuthenticated && (
        <div className="absolute top-4 right-10">
          <LogInBtn />
        </div>
      )}
    </main>
  );
}
