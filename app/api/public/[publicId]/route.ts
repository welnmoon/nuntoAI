// app/api/public/[publicId]/route.ts
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ publicId?: string | string[] }> }
) {
  const resolved = (await params) ?? {};
  const publicIdRaw = Array.isArray(resolved.publicId)
    ? resolved.publicId[0]
    : resolved.publicId;
  const chat = await prisma.chat.findUnique({
    where: { publicId: publicIdRaw ?? "" },
    select: {
      id: true,
      title: true,
      visibility: true,
      messages: {
        orderBy: { id: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  if (!chat || chat.visibility !== "SHARED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(chat);
}
