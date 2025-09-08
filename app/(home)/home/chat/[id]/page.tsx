import Chat from "@/components/chat/chat";
import { prisma } from "@/prisma/prisma-client";

const ChatPage = async ({
  params,
}: {
  params?: Promise<{ id?: string | string[] }>;
}) => {
  const resolvedParams = (await params) ?? {};
  const rawId = resolvedParams.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericId = Number(id);

  const chat = await prisma.chat.findUnique({
    where: { id: numericId },
  });
  const messages = await prisma.message.findMany({
    where: { chatId: numericId },
    orderBy: { createdAt: "asc" },
  });

  if (!chat || !messages) {
    return <div className="text-center mt-10">Чат не найден</div>;
  }

  return <Chat chat={chat} messages={messages} />;
};

export default ChatPage;
