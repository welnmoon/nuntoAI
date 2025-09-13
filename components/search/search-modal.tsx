import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Chat } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchInput from "./search-input";
import { ISODateString } from "next-auth";

const TZ = "Asia/Almaty";

function localDayKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
function sectionLabel(dayKey: string, exampleDate: Date) {
  const now = new Date();
  const todayKey = localDayKey(now);
  const yesterdayKey = localDayKey(new Date(now.getTime() - 86400000));
  if (dayKey === todayKey) return "Сегодня";
  if (dayKey === yesterdayKey) return "Вчера";
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(exampleDate);
}

type Props = {
  chats: Chat[];
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

const SearchModal = ({ chats, openModal, setOpenModal }: Props) => {
  const pathname = usePathname();
  useEffect(() => {
    setOpenModal(false);
  }, [pathname, setOpenModal]);

  const [searchTerm, setSearchTerm] = useState("");

  // 1) Фильтруем и сортируем один раз
  const filteredSorted = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const arr = q
      ? chats.filter((c) => c.title.toLowerCase().includes(q))
      : chats;
    return arr
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt as unknown as ISODateString).getTime() -
          new Date(a.createdAt as unknown as ISODateString).getTime()
      );
  }, [chats, searchTerm]);

  // 2) Группируем по дням и отбираем максимум 10 элементов в порядке: сегодня → вчера → остальные
  const { sections, visibleCount, totalCount } = useMemo(() => {
    const byDay = new Map<
      string,
      { key: string; items: Chat[]; sampleDate: Date }
    >();
    for (const chat of filteredSorted) {
      const d = new Date(chat.createdAt as unknown as ISODateString);
      const key = localDayKey(d);
      const group = byDay.get(key);
      if (group) group.items.push(chat);
      else byDay.set(key, { key, items: [chat], sampleDate: d });
    }

    const now = new Date();
    const todayKey = localDayKey(now);
    const yesterdayKey = localDayKey(new Date(now.getTime() - 86400000));
    const allKeysDesc = Array.from(byDay.keys()).sort().reverse();

    const ordered: string[] = [];
    if (byDay.has(todayKey)) ordered.push(todayKey);
    if (byDay.has(yesterdayKey)) ordered.push(yesterdayKey);
    for (const k of allKeysDesc)
      if (k !== todayKey && k !== yesterdayKey) ordered.push(k);

    const picked: { key: string; items: Chat[]; sampleDate: Date }[] = [];
    let total = 0;

    for (const k of ordered) {
      if (total >= 10) break;
      const g = byDay.get(k)!;
      const slice = g.items.slice(0, 10 - total);
      picked.push({ key: k, items: slice, sampleDate: g.sampleDate });
      total += slice.length;
    }

    return {
      sections: picked,
      visibleCount: total,
      totalCount: filteredSorted.length,
    };
  }, [filteredSorted]);

  const remaining = totalCount - visibleCount;

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/80" />

        <DialogContent className="w-[720px]  max-w-[calc(100%-2rem)] h-[560px] p-0 shadow-2xl shadow-black/40">
          {/* Внутренняя компоновка: колонка, скролл в контенте */}
          <div className="flex h-full flex-col">
            {/* Хедер фиксированный */}
            <div className="sticky top-0 z-10 bg-background/0 rounded-md backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b p-4">
              <SearchInput value={searchTerm} onValueChange={setSearchTerm} />
            </div>

            {/* Прокручиваемая зона со списком */}
            <div className="relative flex-1 overflow-y-auto p-3">
              {sections.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Пока нет чатов.
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map(({ key, items, sampleDate }) => (
                    <div key={key} className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">
                        {sectionLabel(key, sampleDate)}
                      </div>
                      <div className="space-y-1">
                        {items.map((chat) => (
                          <Link
                            key={chat.id}
                            href={`/home/chat/${chat.id}`}
                            className="block rounded-md px-2 py-1 hover:bg-muted transition-colors"
                            title={chat.title}
                          >
                            {chat.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {remaining > 0 && (
                <>
                  <div className="pointer-events-none sticky bottom-0 h-10 bg-gradient-to-t to-transparent" />
                  <div className="sticky bottom-0 flex justify-center pb-4">
                    <span className="rounded-md bg-background/95 px-2 py-1 text-xs text-muted-foreground border">
                      …и ещё {remaining}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default SearchModal;
