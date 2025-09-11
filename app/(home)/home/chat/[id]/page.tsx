import Chat from "@/components/chat/chat";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";

const ChatPage = async ({
  params,
}: {
  params?: Promise<{ id?: string | string[] }>;
}) => {
  const resolvedParams = (await params) ?? {};
  const rawId = resolvedParams.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericId = Number(id);

  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="text-center mt-10">Пожалуйста, войдите в систему</div>
    );
  }

  const chat = await prisma.chat.findUnique({
    where: { id: numericId },
  });

  if (Number(session.user.id) !== chat?.userId) {
    return (
      <div className="text-center mt-10">У вас нет доступа к этому чату</div>
    );
  }

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
