import { getServerSession } from "next-auth";
import ChatComponent from "@/components/chat/chat";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log("SESSION:", session);

  // Не создаем чат автоматически, только проверяем авторизацию
  if (!session?.user) {
    return <ChatComponent messages={[]} />;
  }

  // Возвращаем компонент без чата и сообщений
  return <ChatComponent messages={[]} />;
}
