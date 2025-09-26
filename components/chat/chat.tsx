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
    selectedModel,
    setSelectedModel,
    tariffSlug,
  } = useChatController({ chat, initialMessages });
  const session = useSession();
  const isAuthenticated = !!session.data?.user;
  const hasMessages = messages.length > 0;

  return (
    <main className="min-h-screen flex flex-col w-[90%] md:w-1/2 max-w-[700px] mx-auto">
      <section className="flex-1 flex flex-col">
        {hasMessages ? (
          <ChatMessages
            messages={messages}
            pendingMessages={pendingMessages}
            loading={loading}
            bottomRef={bottomRef}
          />
        ) : (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
            <MessageCircleIcon size={64} />
          </div>
        )}
      </section>

      <section className="dark:bg-transparent sticky bottom-0 bg-white border-t dark:border-t-gray-800 px-4 py-4 space-y-3">
        {!hasMessages && (
          <div className="text-center">
            {isTemporary ? (
              <>
                <Heading level={2}>Временный чат</Heading>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Этот чат не появится в журнале, не будет использовать или
                  обновлять память Nunto AI и не будет использоваться для
                  обучения наших моделей.
                </p>
              </>
            ) : (
              <Heading level={2}>
                Добро пожаловать в Nunto AI, {userName}
              </Heading>
            )}
          </div>
        )}

        <SendToAIForm
          input={input}
          setInput={setInput}
          loading={loading}
          handleSubmit={handleSubmit}
          width="w-full"
        />

        {hasMessages && (
          <footer className="text-center text-xs text-gray-500 dark:text-gray-400">
            Nunto AI может допускать ошибки. Проверяйте важную информацию.
          </footer>
        )}
      </section>

      {!isAuthenticated && (
        <div className="absolute top-4 right-10">
          <LogInBtn />
        </div>
      )}
    </main>
  );
}
