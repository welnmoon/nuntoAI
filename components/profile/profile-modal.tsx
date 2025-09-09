// components/profile/profile-modal.tsx
"use client";

import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";

import { Session } from "next-auth";
import { Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileModal({
  openModal,
  setOpenModal,
  session,
  setSettingsModalOpen,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  session: Session | null;
  setSettingsModalOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-transparent" />
        <DialogContent
          aria-label="User Profile Modal"
          showCloseButton={false}
          className="
      top-auto bottom-15 left-32
      -translate-x-1/2 translate-y-0
      w-65 px-3 py-3 
    "
        >
          <div className="justify-center flex flex-col gap-2">
            <p className="flex gap-2 items-center px-2 py-1">
              <UserCircle className="size-4 text-gray-500" />

              <span
                className={cn(
                  "min-w-0 truncate transition-opacity duration-200 text-gray-500"
                )}
              >
                {session?.user?.email || "Гость"}
              </span>
            </p>
            <p
              onClick={() => setSettingsModalOpen(true)}
              className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition-colors duration-200"
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
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
