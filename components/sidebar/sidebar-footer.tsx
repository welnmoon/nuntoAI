import { SidebarFooter } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";
import { Session } from "next-auth";

const SidebarFooterComponent = ({
  setOpenModal,
  session,
  isCollapsed,
}: {
  setOpenModal: (open: boolean) => void;
  session: Session | null;
  isCollapsed: boolean;
}) => {
  return (
    <SidebarFooter>
      <div
        onClick={() => setOpenModal(true)}
        className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-muted rounded-md transition-colors"
      >
        <UserCircle className="size-7 shrink-0" />
        <span
          className={cn(
            "min-w-0 truncate transition-opacity duration-200 ",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
        >
          {session?.user?.name || session?.user?.email || "Гость"}
        </span>
      </div>
    </SidebarFooter>
  );
};

export default SidebarFooterComponent;
