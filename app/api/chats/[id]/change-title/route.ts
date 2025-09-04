import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title } = await req.json();

    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Название слишком короткое" },
        { status: 400 }
      );
    }

    const chatId = Number(params.id);

    const updated = await prisma.chat.update({
      where: { id: chatId },
      data: { title: title.trim() },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("Ошибка при обновлении чата:", e);

    return NextResponse.json(
      { error: "Не удалось обновить чат" },
      { status: 500 }
    );
  }
}
