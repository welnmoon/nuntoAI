import MainContainer from "../container/main-container";
import { prisma } from "@/prisma/prisma-client";
import { renderFeatures } from "@/lib/renderFeatures";
import PayButton from "@/components/buttons/pay-btn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export default async function Prices() {
  const [session, plans] = await Promise.all([
    getServerSession(authOptions),
    prisma.tariff.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        prices: {
          where: {
            active: true,
          },
          orderBy: { unitAmount: "asc" },
        },
      },
    }),
  ]);

  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  return (
    <section id="prices" className="py-12">
      <MainContainer>
        <h2 className="text-center text-2xl font-semibold text-white">
          Тарифы
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Прозрачные планы — начните бесплатно
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {plans.map((plan) => {
            const primaryPrice = plan.prices[0];
            return (
              <div
                key={plan.id}
                className="relative rounded-2xl border p-6 text-white bg-white/5 border-white/10 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {/* при желании можно вывести slug как бейдж */}
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/10">
                    {plan.slug}
                  </span>
                </div>

                {plan.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {plan.description}
                  </p>
                )}

                <ul className="mt-4 space-y-2 text-gray-200">
                  {renderFeatures(plan.features)}
                </ul>

                {primaryPrice ? (
                  <div className="mt-6 text-2xl font-bold">
                    {currencyFormatter.format(primaryPrice.unitAmount / 100)}{" "}
                    {primaryPrice.currency.toUpperCase()}
                    {primaryPrice.interval && (
                      <span className="text-base font-normal text-gray-300">
                        /{primaryPrice.interval}
                      </span>
                    )}
                  </div>
                ) : null}

                {primaryPrice ? (
                  <div className="mt-6">
                    <PayButton
                      slug={plan.slug}
                      interval={primaryPrice.interval ?? undefined}
                      userId={userId}
                    />
                  </div>
                ) : (
                  <div className="mt-6 text-sm text-gray-400">
                    Недоступно для покупки
                  </div>
                )}

                {/* Доп. служебная инфа (если нужна) */}
                <div className="mt-4 text-xs text-gray-400">
                  Обновлено: {dateFormatter.format(plan.updatedAt)}
                </div>
              </div>
            );
          })}
        </div>
      </MainContainer>
    </section>
  );
}
