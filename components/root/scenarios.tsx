import MainContainer from "./container/main-container";
import { Bot, FileText, BarChart3, Code2 } from "lucide-react";

const items = [
  {
    icon: Bot,
    title: "Копирайтинг",
    desc: "Генерация слоганов, писем и постов за минуты.",
  },
  {
    icon: Code2,
    title: "Разработка",
    desc: "Подсказки по коду, рефакторинг и объяснения без контекста переключений.",
  },
  {
    icon: FileText,
    title: "Документация",
    desc: "Конспекты, краткие выжимки и структурирование знаний.",
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    desc: "Быстрые ответы по данным и отчетам.",
  },
];

export default function Scenarios() {
  return (
    <section id="scenarios" className="py-12">
      <MainContainer>
        <h2 className="text-center text-2xl font-semibold text-white">
          Сценарии использования
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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

