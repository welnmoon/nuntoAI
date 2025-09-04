import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prisma-client";
import { Visibility } from "@prisma/client";

export async function POST(request: NextRequest) {
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

    const lastChat = await prisma.chat.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    // Создаем новый чат
    const chat = await prisma.chat.create({
      data: {
        title: "Новый чат" + (lastChat?.id! + 1 || 1),
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
