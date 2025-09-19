"use client";
import { useState } from "react";
import { pay } from "@/lib/pay";
import { LoaderCircle } from "lucide-react";

type PayButtonProps = {
  slug?: string;
  interval?: string;
  userId?: number;
};

export default function PayButton({
  slug = "pro",
  interval = "month",
  userId,
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="mt-6 w-full rounded-lg bg-zinc-800 opacity-80 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50 flex items-center justify-center"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await pay({ slug, interval, userId });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Не удалось начать оплату";
          alert(message);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : "Приобрести"}
    </button>
  );
}
