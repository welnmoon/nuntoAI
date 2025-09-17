import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // PRO
  await prisma.tariff.upsert({
    where: { slug: "pro" },
    update: {},
    create: {
      slug: "pro",
      name: "PRO",
      description: "Расширенные возможности: больше чатов, AI, поддержка",
      features: { maxChats: 100, canUseAi: true },
      prices: {
        create: [
          {
            stripePriceId: "price_1S7xOAFRtVtn6uc5QpjYYaR5",
            currency: "kzt",
            unitAmount: 499000,
            interval: "month",
          },
          {
            stripePriceId: "price_1S7xP4FRtVtn6uc537ygslYy",
            currency: "kzt",
            unitAmount: 2590000, // 4 990 ₸ = 499000
            interval: "month",
          },
          {
            stripePriceId: "price_1S7xPzFRtVtn6uc5kWlFA9eP",
            currency: "kzt",
            unitAmount: 4999000, // 49 990 ₸
            interval: "year",
          },
        ],
      },
    },
  });

  // ENTERPRISE
  await prisma.tariff.upsert({
    where: { slug: "enterprise" },
    update: {},
    create: {
      slug: "enterprise",
      name: "Enterprise",
      description: "Полный доступ: без ограничений, персональная поддержка",
      features: { maxChats: null, canUseAi: true, prioritySupport: true },
      prices: {
        create: [
          {
            stripePriceId: "price_1S7y1tFRtVtn6uc5ftxHLilY",
            currency: "kzt",
            unitAmount: 1499000, // 14 990 ₸
            interval: "month",
          },
          {
            stripePriceId: "price_1S7y2eFRtVtn6uc50628DMTG",
            currency: "kzt",
            unitAmount: 14990000,
            interval: "year",
          },
        ],
      },
    },
  });

  await prisma.tariff.upsert({
    where: { slug: "free" },
    update: {},
    create: {
      slug: "free",
      name: "FREE",
      description: "Базовые возможности без оплаты",
      features: { maxChats: 10, canUseAi: false },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
