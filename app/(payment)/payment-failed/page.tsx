import Link from "next/link";
import { XCircle } from "lucide-react";

const gradientBackground = `
  radial-gradient(circle at 20% 30%, rgba(255, 99, 132, 0.25), transparent 55%),
  radial-gradient(circle at 75% 25%, rgba(255, 159, 64, 0.2), transparent 55%),
  radial-gradient(circle at 50% 75%, rgba(255, 99, 132, 0.18), transparent 60%),
  #0f1226
`;

type SearchParams = { message?: string | string[] };

export default function PaymentFailedPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const raw = searchParams?.message;
  const errorMessage =
    (Array.isArray(raw) ? raw[0] : raw) ??
    "Попробуйте ещё раз или используйте другую карту.";

  return (
    <main
      className="min-h-screen px-6 py-16 flex items-center justify-center"
      style={{ background: gradientBackground }}
    >
      <div className="max-w-lg w-full text-center space-y-6 text-white">
        <XCircle className="mx-auto h-16 w-16 text-rose-400" />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">Оплата не прошла</h1>
          <p className="text-white/70">{errorMessage}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl px-5 py-3 bg-white/10 hover:bg-white/20 transition-colors"
          >
            Вернуться на главную
          </Link>
          <Link
            href="mailto:support@nunto.ai"
            className="w-full sm:w-auto rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 transition-colors"
          >
            Нужна помощь
          </Link>
        </div>
      </div>
    </main>
  );
}
