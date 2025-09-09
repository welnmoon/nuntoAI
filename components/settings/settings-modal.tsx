"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import ColorThemeSelect from "./color-theme-dropdown";

export function SettingsModal({
  settingsModalOpen,
  setSettingsModalOpen,
}: {
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/80" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
          </DialogHeader>

          <ColorThemeSelect />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
