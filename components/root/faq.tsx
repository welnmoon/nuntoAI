import MainContainer from "./container/main-container";

const faqs = [
  {
    q: "Это бесплатно?",
    a: "Да. Базовый тариф Free включает 50 запросов в месяц, историю чатов и один приватный workspace. Можно начать без карты и перейти на Pro, когда потребуется больше лимитов и функций.",
  },
  {
    q: "Как хранится моя история?",
    a: "Ваша история хранится в аккаунте и доступна только вам и членам вашей команды (если вы их пригласите). Вы можете удалять отдельные диалоги, отключать сохранение или работать во временном режиме без записи истории.",
  },
  {
    q: "Можно подключить свои данные?",
    a: "Да. Импортируйте файлы (PDF, DOCX, Markdown) и подключайте источники знаний. Ассистент будет учитывать их в ответах, а индексация выполняется приватно в вашем окружении.",
  },
  {
    q: "Поддерживаются команды?",
    a: "В тарифах Pro/Team доступны командные рабочие пространства: приглашайте участников, назначайте роли, делитесь диалогами и базами знаний, контролируйте доступ на уровне проекта.",
  },
  {
    q: "Есть API?",
    a: "Да. REST и SDK позволяют интегрировать Nunto AI в приложения и пайплайны. Можно создавать чаты, получать ответы и подключать источники data programmatically.",
  },
  {
    q: "Какие модели используются?",
    a: "Мы используем современные модели GPT и специализированные модели для отдельных задач (код, анализ, суммаризация). Выбор модели можно фиксировать в настройках проекта.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-12">
      <MainContainer>
        <h2 className="text-center text-2xl font-semibold text-white">FAQ</h2>
        {/* Masonry columns to avoid equal-height rows */}
        <div className="mt-6 p-4 columns-1 md:columns-2 gap-4">
          {faqs.map((item) => (
            <div key={item.q} className="mb-4 break-inside-avoid">
              <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                <summary className="cursor-pointer list-none select-none">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.q}</span>
                    <span className="text-sm text-gray-300 group-open:hidden">Показать</span>
                    <span className="text-sm text-gray-300 hidden group-open:inline">Скрыть</span>
                  </div>
                </summary>
                <p className="mt-3 text-gray-300 text-sm leading-6">{item.a}</p>
              </details>
            </div>
          ))}
        </div>
      </MainContainer>
    </section>
  );
}
