import MainContainer from "../container/main-container";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "0₸",
    period: "/мес",
    features: [
      "50 запросов в месяц",
      "1 приватный workspace",
      "Базовая история чатов",
      "Экспорт ответов",
      "Временные чаты без сохранения",
    ],
    cta: "Начать",
  },
  {
    name: "Pro",
    price: "4900₸",
    period: "/мес",
    features: [
      "Неограниченные чаты и история",
      "Приоритетные модели GPT",
      "Подключение собственных данных (файлы/вики)",
      "Несколько workspaces",
      "Быстрые пресеты и сценарии",
    ],
    cta: "Оформить",
    highlight: true,
  },
  {
    name: "Team",
    price: "По запросу",
    period: "",
    features: [
      "Командные рабочие пространства",
      "Роли и разграничение доступа",
      "SLA и приоритетная поддержка",
      "Единая биллинг-панель",
      "Аудит логов и управление политиками",
    ],
    cta: "Связаться",
  },
];

export default function Prices() {
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
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-6 text-white bg-white/5 border-white/10 transition-transform ${
                p.highlight
                  ? "md:-mt-2 scale-[1.02] ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/10 z-10 py-10"
                  : ""
              }`}
            >
              {p.highlight && (
                <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-full bg-cyan-500 text-white">
                  Самый популярный
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="text-2xl font-bold">
                  {p.price}
                  <span className="text-sm text-gray-300 ml-1">{p.period}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-gray-200">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-emerald-400/80" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-xl px-4 py-2 font-medium transition-colors ${
                  p.highlight
                    ? "bg-cyan-500 text-white hover:bg-cyan-400"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </MainContainer>
    </section>
  );
}
