// внутри AppSidebarPopover (или страницы чата)
import { useState } from "react";
import toast from "react-hot-toast";

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
      if (!res.ok) {
        let message = `Не удалось ${!shared ? "включить" : "отключить"} доступ`;
        try {
          const j = await res.json();
          if (j?.error) message = j.error;
        } catch {}
        toast.error(message, { position: "top-left" });
        return;
      }
      const data: { publicId: string | null; visibility: "SHARED" | "PRIVATE" } =
        await res.json();
      const nowShared = data.visibility === "SHARED";
      setShared(nowShared);
      setPid(data.publicId ?? undefined);
      toast.success(nowShared ? "Публичный доступ включен" : "Публичный доступ отключен", {
        position: "top-left",
      });
      // тут можно дернуть стора, если хотите синхронизировать списки
    } finally {
      setLoading(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = pid ? `${origin}/p/${pid}` : "";

  return (
    <div>
      {loading ? (
        <span className="text-sm text-muted-foreground">Загрузка...</span>
      ) : (
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
                try {
                  await navigator.clipboard.writeText(link);
                  toast.success("Ссылка скопирована в буфер обмена", {
                    position: "top-left",
                  });
                } catch (e) {
                  toast.error("Не удалось скопировать ссылку", {
                    position: "top-left",
                  });
                }
              }}
              className="px-2 py-1 rounded hover:bg-muted"
            >
              Скопировать ссылку
            </button>
          )}
        </div>
      )}
    </div>
  );
}
