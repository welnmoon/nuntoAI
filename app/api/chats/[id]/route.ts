import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// DELETE chat by id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json(
      { error: "Not Auth" },
      {
        status: 401,
      }
    );
  }
  const chatId = Number(params.id);
  const userId = Number(session.user.id);
  if (!Number.isFinite(chatId)) {
    return NextResponse.json({ error: "Invalid chat id" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return new NextResponse(null, { status: 204 }); // уже удалён / не найден
    }
    console.error("Ошибка при удалении чата:", e);
    return NextResponse.json(
      { error: "Не удалось удалить чат" },
      { status: 500 }
    );
  }
}
