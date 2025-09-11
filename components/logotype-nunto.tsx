import { cn } from "@/lib/utils";
import { TvIcon } from "lucide-react";

const LogotypeNunto = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className="flex gap-2 items-center">
      <TvIcon className="size-6 shrink-0" />
      <span
        className={cn("shrink-0 text-bold text-lg", isCollapsed && "hidden")}
      >
        Nunto AI
      </span>
    </div>
  );
};

export default LogotypeNunto;
