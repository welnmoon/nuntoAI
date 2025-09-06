// внутри AppSidebarPopover (или страницы чата)
import { useState } from "react";

export function ShareToggle({
  chatId,
  isShared,
  publicId,
}: {
  chatId: number;
  isShared: boolean;
  publicId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(isShared);
  const [pid, setPid] = useState(publicId);
  const onToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: !shared }),
      });
      if (!res.ok) return;
      const data: { publicId: string | null; visibility: "SHARED" | "PRIVATE" } = await res.json();
      setShared(data.visibility === "SHARED");
      setPid(data.publicId ?? undefined);
      // тут можно дернуть стора, если хотите синхронизировать списки
    } finally {
      setLoading(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL ?? "");
  const link = pid ? `${origin}/p/${pid}` : "";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        disabled={loading}
        className="px-2 py-1 rounded hover:bg-muted"
      >
        {shared ? "Отключить доступ" : "Поделиться"}
      </button>
      {shared && pid && (
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(link);
          }}
          className="px-2 py-1 rounded hover:bg-muted"
        >
          Скопировать ссылку
        </button>
      )}
    </div>
  );
}
