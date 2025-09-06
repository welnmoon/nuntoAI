import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ColorThemeDropdown from "./color-theme-dropdown";

export function SettingsModal({
  settingsModalOpen,
  setSettingsModalOpen,
}: {
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
      <DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Настройки</DialogTitle>
        </DialogHeader>

        <ColorThemeDropdown />
      </DialogContent>
    </Dialog>
  );
}
