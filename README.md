# Nunto AI

Nunto AI - платформа для общения с ИИ и управления знаниями, собранная на Next.js 15. Проект объединяет лендинг, пользовательский кабинет и рабочее пространство для чатов с потоковыми ответами модели.

## Ключевые возможности
- AI-чат с потоковым ответом OpenRouter (GPT-4o), поддержкой markdown, подсветкой кода и статусом загрузки.
- Временные (не сохраняемые) и постоянные чаты с автогенерацией названий, фиксацией в списке и публикацией через публичные ссылки.
- Регистрация и авторизация через GitHub OAuth или email/пароль, управление профилем в личном кабинете.
- Тарифные планы и подписки на Stripe: checkout, webhooks, страницы успеха/ошибки, тарифные карточки с динамическими данными из БД.
- Встроенная документация на Fumadocs с полнотекстовым поиском.
- Современный UI: Tailwind CSS 4, Radix UI, Lucide и кастомные хранилища состояния на Zustand.

## Технологический стек
- Next.js 15 (App Router) + React 19, TypeScript, серверные компоненты и маршруты из папки app.
- Tailwind CSS, PostCSS, кастомная дизайн-система компонентов.
- Prisma ORM + PostgreSQL (Neon), миграции и сиды в каталоге prisma.
- NextAuth с PrismaAdapter, провайдеры GitHub и Credentials.
- Stripe SDK, checkout sessions, обработка вебхуков, модели Tariff, Subscription, Payment.
- OpenRouter/OpenAI SDK для генерации ответов и названий чатов.
- Zustand для локального состояния (списки чатов, закрепления, настройки UI).
- React Hook Form + Zod для валидации форм.
- Fumadocs (core/ui/mdx) для секции /docs.

## Требования
- Node.js >= 20 (рекомендуется LTS).
- npm (репозиторий использует package-lock.json).
- PostgreSQL 15+ или совместимый сервис (например Neon).
- Stripe аккаунт и OpenRouter API-ключ для работы AI и платежей.

## Установка и запуск
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте файл `.env` на основе списка переменных ниже и заполните собственными значениями.
3. Примените схему БД и сгенерируйте клиент:
   ```bash
   npx prisma migrate dev
   npm run prisma:generate
   ```
4. Заполните стартовые тарифы (опционально, для витрины):
   ```bash
   npx prisma db seed
   ```
5. Запустите дев-сервер:
   ```bash
   npm run dev
   ```
   Приложение будет доступно на http://localhost:3000.

Перед продакшеном выполните `npm run build` и `npm run start`. Скрипт `postinstall` автоматически запускает `prisma generate` и `fumadocs-mdx`.

## Переменные окружения
```env
OPENROUTER_API_KEY=<openrouter_api_key>
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

NEXTAUTH_SECRET=<random_string>
NEXT_PUBLIC_APP_URL=<app_host>          # например localhost:3000 или домен продакшена
NEXT_PUBLIC_BASE_URL=<https_url>        # используйте если продакшен-домен отличается

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

GITHUB_ID=<github_oauth_client_id>
GITHUB_SECRET=<github_oauth_client_secret>
```
Для деплоя на Vercel также задайте `NEXTAUTH_URL` и подключите переменные Stripe/OpenRouter в настройках проекта.

## Полезные команды
- `npm run dev` - локальная разработка с hot-reload.
- `npm run build` - production-сборка (перед деплоем).
- `npm run start` - запуск собранного приложения.
- `npm run lint` - проверка ESLint.
- `npm run prisma:generate` - генерация Prisma Client.
- `npx prisma migrate deploy` - применение миграций в среде выполнения.
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` - локальная проверка вебхуков (требуется Stripe CLI).

## Структура проекта
- `app/` - маршруты App Router (лендинг, auth, home, profile, docs, API-роуты).
- `components/` - UI-компоненты: чат, формы, кнопки, секции лендинга.
- `hooks/` - кастомные хуки (например, `use-query-setter`).
- `store/` - Zustand-хранилища для чатов, закреплений, акцентного цвета.
- `lib/` - вспомогательные библиотеки (AI-стрим, Stripe, Auth, рендеринг фич, маршруты).
- `prisma/` - схема, миграции, сиды и клиент.
- `content/` - MDX-документация для Fumadocs.
- `public/` - ассеты и статические файлы.

## Архитектура и ключевые модули
### AI-чат
- Клиентский контроллер `components/chat/use-chat-controller.ts` управляет состоянием ввода, временными чатами, стримингом и сохранением сообщений.
- Компоненты `ChatComponent` и `ChatMessages` отображают историю, поддерживают Markdown/rehype-highlight, показывают загрузку и позволяют отправлять сообщения клавишей Enter.
- `lib/ai-stream.ts` стримит ответ ассистента из `/api/openai`, обновляя UI по чанкам.

### Управление чатами
- API-роуты `app/api/chats` создают, переименовывают и удаляют чаты; `app/api/chats/[id]/messages` сохраняет сообщения и генерирует названия с помощью OpenRouter.
- Публичный доступ к чатам организован через `app/api/chats/[id]/share` и `app/api/public/[publicId]`.
- Zustand-сторы (`store/chats-store.ts`, `store/pinned-chats-store.ts`) синхронизируют список чатов, pending-сообщения и закрепления.

### Аутентификация и профиль
- NextAuth (`lib/auth.ts`) с GitHub и credentials-провайдерами, JWT-сессиями и PrismaAdapter.
- Формы входа/регистрации собраны на React Hook Form + Zod, `components/auth/auth-switcher.tsx` переключает режимы.
- Страница `app/profile` показывает данные пользователя из Prisma.

### Платежи и тарифы
- Prisma-модели `Tariff`, `TariffPrice`, `Subscription`, `Payment` (см. `prisma/schema.prisma`) и сиды `prisma/seed.ts`.
- Кнопка `PayButton` вызывает `lib/pay.ts`, который создает Stripe Checkout Session (`/api/stripe/checkout`) и редиректит пользователя.
- Обработка вебхуков реализована в `app/api/stripe/webhook` (актуализирует платежи и подписки).
- Витрина тарифов (`components/root/prices`) грузит данные из Prisma и отображает динамические цены.

### Документация
- MDX-контент в `content/docs`, сборка через `fumadocs-mdx`, поиск - `app/api/search` с `fumadocs-core`.
- Компоненты `app/docs` обеспечивают отображение документации с оглавлением и кастомной темой.

## Деплой и эксплуатация
- Используйте `npm run build` и `npm run start` на выбранной платформе (Vercel, Railway и т. п.).
- Убедитесь, что переменные окружения Stripe, OpenRouter, NextAuth и база данных заданы в системе деплоя.
- Для Stripe webhook создайте endpoint `/api/stripe/webhook` и сохраните полученный `STRIPE_WEBHOOK_SECRET`.
- При обновлении схемы БД запускайте `npx prisma migrate deploy` и `npm run prisma:generate`.

## Поддержка и развитие
Предложите улучшения через issues или pull request, либо адаптируйте README под собственный форк. Внутренняя документация доступна по пути `/docs`.
