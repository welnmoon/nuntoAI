/*
  Warnings:

  - You are about to drop the column `tariff` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "tariff",
ADD COLUMN     "tariffId" INTEGER;

-- DropEnum
DROP TYPE "public"."Tariffs";

-- CreateTable
CREATE TABLE "public"."Tariff" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "features" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TariffPrice" (
    "id" SERIAL NOT NULL,
    "tariffId" INTEGER NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "unitAmount" INTEGER NOT NULL,
    "interval" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TariffPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tariffId" INTEGER NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tariff_slug_key" ON "public"."Tariff"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TariffPrice_stripePriceId_key" ON "public"."TariffPrice"("stripePriceId");

-- CreateIndex
CREATE INDEX "TariffPrice_tariffId_active_idx" ON "public"."TariffPrice"("tariffId", "active");

-- CreateIndex
CREATE INDEX "TariffPrice_currency_interval_idx" ON "public"."TariffPrice"("currency", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "public"."Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "public"."Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "public"."Subscription"("currentPeriodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "public"."Payment"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "public"."Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_userId_status_idx" ON "public"."Payment"("userId", "status");

-- AddForeignKey
ALTER TABLE "public"."TariffPrice" ADD CONSTRAINT "TariffPrice_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "public"."Tariff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "public"."Tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "public"."Tariff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
