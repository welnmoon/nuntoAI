/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "publicId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_publicId_key" ON "public"."Chat"("publicId");
