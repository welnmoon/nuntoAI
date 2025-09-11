// components/profile/profile-modal.tsx
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Session } from "next-auth";
import { Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LogOutBtn from "../buttons/log-out-btn";

export default function ProfileModal({
  openModal,
  setOpenModal,
  session,
  setSettingsModalOpen,
  trigger,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  session: Session | null;
  setSettingsModalOpen: (open: boolean) => void;
  trigger: React.ReactNode;
}) {
  const isAuthenticated = !!session?.user;
  return (
    <Popover open={openModal} onOpenChange={setOpenModal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-fit min-w-56 px-3 py-3"
      >
        <div className="justify-center flex flex-col gap-2">
          <p className="flex gap-2 items-center px-2 py-1">
            <UserCircle className="size-4 text-gray-500 dark:text-gray-400" />

            <span
              className={cn(
                "min-w-0 truncate transition-opacity duration-200 text-gray-500 dark:text-gray-400"
              )}
            >
              {session?.user?.email || "Гость"}
            </span>
          </p>
          <p
            onClick={() => setSettingsModalOpen(true)}
            className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-md transition-colors duration-200"
          >
            <Settings color="gray" className="size-4" />

            <span
              className={cn(
                "min-w-0 truncate transition-opacity duration-200 "
              )}
            >
              Настройки
            </span>
          </p>
          {isAuthenticated && <LogOutBtn />}
        </div>
      </PopoverContent>
    </Popover>
  );
}
