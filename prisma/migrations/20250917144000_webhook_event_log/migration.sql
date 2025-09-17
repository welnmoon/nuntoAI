-- CreateTable
CREATE TABLE "public"."WebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdTs" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedTs" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
