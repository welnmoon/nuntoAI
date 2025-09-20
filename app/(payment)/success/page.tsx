import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const gradientBackground = `
  radial-gradient(circle at 20% 30%, rgba(0, 200, 255, 0.3), transparent 55%),
  radial-gradient(circle at 80% 40%, rgba(0, 123, 255, 0.3), transparent 55%),
  radial-gradient(circle at 50% 80%, rgba(100, 180, 255, 0.25), transparent 60%),
  #0f1226
`;

type SuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sessionId = resolvedSearchParams?.session_id;

  return (
    <main
      className="min-h-screen px-6 py-16 flex items-center justify-center"
      style={{ background: gradientBackground }}
    >
      <div className="max-w-lg w-full text-center space-y-6 text-white">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">Оплата прошла успешно</h1>
          <p className="text-white/70">
            Мы активировали ваш доступ. Письмо с подтверждением отправлено на вашу почту.
          </p>
          {sessionId ? (
            <p className="text-xs text-white/60">
              ID сессии: <span className="font-mono text-white">{sessionId}</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl px-5 py-3 bg-white/10 hover:bg-white/20 transition-colors"
          >
            Вернуться на главную
          </Link>
          <Link
            href="/profile"
            className="w-full sm:w-auto rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 transition-colors"
          >
            В личный кабинет
          </Link>
        </div>
      </div>
    </main>
  );
}