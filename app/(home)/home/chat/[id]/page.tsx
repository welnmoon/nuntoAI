import Chat from "@/components/chat/chat";
import { prisma } from "@/prisma/prisma-client";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const chat = await prisma.chat.findUnique({
    where: { id: Number(params.id) },
  });
  const messages = await prisma.message.findMany({
    where: { chatId: Number(params.id) },
    orderBy: { createdAt: "asc" },
  });

  if (!chat || !messages) {
    return <div className="text-center mt-10">Чат не найден</div>;
  }

  return <Chat chat={chat!} messages={messages} />;
};

export default ChatPage;
