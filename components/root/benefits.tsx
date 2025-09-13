import { Brain, Code2, Shield, Zap, Database, Workflow } from "lucide-react";
import MainContainer from "./container/main-container";

const items = [
  {
    icon: Brain,
    title: "GPT-ассистент",
    desc: "Быстрые и точные ответы для задач бизнеса и разработки.",
  },
  {
    icon: Code2,
    title: "Помощь с кодом",
    desc: "Генерация, рефакторинг и объяснение кода на лету.",
  },
  {
    icon: Database,
    title: "Данные",
    desc: "Подключение источников знаний и приватные рабочие пространства.",
  },
  {
    icon: Workflow,
    title: "Автоматизация",
    desc: "Сценарии и пайплайны для повторяющихся операций.",
  },
  {
    icon: Shield,
    title: "Приватность",
    desc: "Отдельные окружения, контроль доступа и хранение истории.",
  },
  {
    icon: Zap,
    title: "Скорость",
    desc: "Молниеносный интерфейс и продуманная навигация.",
  },
];

export default function Benefits() {
  return (
    <section id="features" className="py-12">
      <MainContainer>
        <h2 className="text-center text-2xl font-semibold text-white">
          Преимущества
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Всё необходимое, чтобы работать быстрее и умнее
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white/10 p-2">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MainContainer>
    </section>
  );
}
