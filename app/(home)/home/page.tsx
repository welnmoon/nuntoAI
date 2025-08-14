import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/prisma-client";
import ChatComponent from "@/components/chat/chat";
import { Visibility, MessageRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/lib/client-routes";

export default async function HomePage() {
  const session = await getServerSession();
  console.log("SESSION USER", session?.user);
  if (!session) {
    redirect(CLIENT_ROUTES.login);
  }
  let chat = undefined;
  let messages = [];
  if (session?.user) {
    chat = await prisma.chat.create({
      data: {
        title: "Новый чат",
        user: {
          connect: {
            id: Number(session.user.id),
          },
        },
        visibility: Visibility.PRIVATE,
        messages: {
          create: [
            {
              role: "ASSISTANT",
              content: "Добро пожаловать! Задавайте вопросы.",
            },
          ],
        },
      },
      include: { messages: true },
    });
    messages = chat.messages;
  } else {
    // Только временные сообщения для гостя, никакого чата
    messages = [
      {
        id: Date.now(),
        chatId: 0,
        role: MessageRole.ASSISTANT,
        content:
          "Добро пожаловать! В гостевом режиме сообщения не сохраняются.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  return <ChatComponent chat={chat} messages={messages} />;
}
