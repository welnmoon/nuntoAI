// components/profile/profile-modal.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Session } from "next-auth";
import { Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileModal({
  openModal,
  setOpenModal,
  session,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  session: Session | null;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (!session) {
    router.replace("/login");
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-transparent" />
        <DialogContent
          showCloseButton={false}
          className="
      top-auto bottom-15 left-32
      -translate-x-1/2 translate-y-0
      w-65 px-3 py-3 
    "
        >
          <div className="justify-center flex flex-col gap-2">
            <p className="flex gap-2 items-center">
              <UserCircle color="gray" className="size-4 " />

              <span
                className={cn(
                  "min-w-0 truncate transition-opacity duration-200 color-gray-600"
                )}
              >
                {session?.user?.email || "Гость"}
              </span>
            </p>
            <p className="flex gap-2 items-center">
              <Settings color="gray" className="size-4" />

              <span
                className={cn(
                  "min-w-0 truncate transition-opacity duration-200"
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
