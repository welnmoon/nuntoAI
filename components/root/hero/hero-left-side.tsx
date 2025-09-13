import Eyebrow from "./eyebrow";

const HeroLeftSide = () => {
  return (
    <div className="w-full md:w-1/2">
      <Eyebrow />
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
        Создавайте быстрее с <span className="text-cyan-300">Nunto AI</span>
      </h1>
      <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
        Современный, минималистичный ИИ-ассистент для бизнеса и разработчиков:
        быстрые ответы, приватные рабочие пространства, подключение данных и
        автоматизация задач.
      </p>
    </div>
  );
};

export default HeroLeftSide;
