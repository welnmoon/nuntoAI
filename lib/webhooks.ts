import { prisma } from "@/prisma/prisma-client";

export async function markReceived(eventId: string, type: string) {
  try {
    return await prisma.webhookEvent.create({
      data: {
        id: eventId,
        type,
      },
    });
  } catch {
    return null;
  }
}

export async function markProcessed(eventId: string) {
  await prisma.webhookEvent.update({
    where: { id: eventId },
    data: { processedTs: new Date() },
  });
}
