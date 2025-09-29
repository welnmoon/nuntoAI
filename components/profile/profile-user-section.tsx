"use client";

import { getTariffLabelById } from "@/constants/allowed-models";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown, Mail, User2, Hash, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { useRouter } from "next/navigation";
import LogOutBtn from "../buttons/log-out-btn";

const tariffBadgeClass: Record<number, string> = {
  0: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100", // Free
  1: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100", // Pro
  2: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100", // Enterprise
};

export default function ProfileUserSection({ user }: { user: User }) {
  const router = useRouter();
  const tariffId = user?.tariffId ?? 0;
  const tariffLabel = getTariffLabelById(tariffId) ?? "Free";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto max-w-3xl"
        >
          <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="relative h-32 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,99,235,0.15),transparent_50%),radial-gradient(120%_120%_at_100%_0%,rgba(245,158,11,0.18),transparent_50%),linear-gradient(90deg,rgba(99,102,241,0.10),rgba(59,130,246,0.10))]"></div>

            {/* Аватар и тариф */}
            <div className="-mt-12 px-6 flex items-end gap-4">
              <div className="shrink-0">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    width={96}
                    height={96}
                    className="rounded-2xl border-4 border-white dark:border-zinc-900 shadow-md object-cover w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-md bg-zinc-200 dark:bg-zinc-800 grid place-items-center">
                    <User2 className="w-10 h-10 text-zinc-500" />
                  </div>
                )}
              </div>

              <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {user?.name || "Профиль пользователя"}
                  </h1>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Аккаунт • защищён{" "}
                    <ShieldCheck className="inline w-4 h-4 mb-0.5" />
                  </p>
                </div>
                <Badge
                  className={`rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-1 ${tariffBadgeClass[tariffId]}`}
                >
                  <Crown className="w-3.5 h-3.5" /> {tariffLabel}
                </Badge>
              </div>
            </div>

            <CardHeader className="sr-only">
              <CardTitle>Профиль пользователя</CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Имя
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <User2 className="w-4 h-4 text-zinc-500" />
                    <span>{user?.name || "Не указано"}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Email
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 break-all">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <span>{user?.email || "Не указано"}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    ID пользователя
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Hash className="w-4 h-4 text-zinc-500" />
                    <span className="truncate">{user?.id || "Неизвестно"}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Тариф
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Crown className="w-4 h-4 text-zinc-500" />
                    <span>{tariffLabel}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="rounded-2xl h-11 sm:w-auto w-full">
                    Настройки профиля
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-2xl h-11 sm:w-auto w-full"
                  >
                    Управление подпиской
                  </Button>
                  <Button
                    onClick={() => router.push(CLIENT_ROUTES.docs)}
                    variant="outline"
                    className="rounded-2xl h-11 sm:w-auto w-full"
                  >
                    Документация
                  </Button>
                </div>
                <LogOutBtn />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
