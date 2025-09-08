import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { Visibility } from "@prisma/client";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // Проверяем существование пользователя
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Посчитаем количество чатов у пользователя, чтобы дать понятный порядковый номер
    const userChatsCount = await prisma.chat.count({ where: { userId } });

    // Создаем новый чат
    const chat = await prisma.chat.create({
      data: {
        // Базовое название: "Новый чат N" (нумерация внутри пользователя)
        title: `Новый чат ${userChatsCount + 1}`,
        user: {
          connect: {
            id: userId,
          },
        },
        visibility: Visibility.PRIVATE,
      },
      include: { messages: true },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Ошибка при создании чата:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
