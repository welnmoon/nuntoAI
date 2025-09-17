export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <svg
          className="animate-spin h-5 w-5 text-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span>Загружаем рабочее пространство…</span>
      </div>
    </div>
  );
}

