import Eyebrow from "./eyebrow";

const HeroLeftSide = () => {
  return (
    <div className="text-center w-1/2 lg:w-1/2">
      <Eyebrow />
      <h1 className="text-7xl font-bold text-white">
        Создавайте быстрее с <span className="">Nunto AI</span>
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        Современный, минималистичный ИИ‑ассистент для бизнеса и разработчиков:
        быстрые ответы, приватные рабочие пространства, подключение данных и
        автоматизация задач.
      </p>
    </div>
  );
};

export default HeroLeftSide;
