import { cn } from "@/lib/utils";
import { TvIcon } from "lucide-react";

const LogotypeNunto = ({
  isCollapsed,
  textStyle,
}: {
  isCollapsed?: boolean;
  textStyle?: string;
}) => {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative grid place-items-center size-8 rounded-lg bg-[var(--accent-bg)] ring-1 ring-border text-primary transition-transform duration-200 hover:scale-[1.03]">
        <TvIcon className="size-4" />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[var(--accent)]" />
      </div>
      <span
        className={cn(
          "shrink-0 text-lg font-semibold tracking-tight  bg-clip-text text-transparent",
          isCollapsed && "hidden",
          textStyle
            ? textStyle
            : "bg-gradient-to-r from-neutral-900 to-neutral-600"
        )}
      >
        Nunto AI
      </span>
    </div>
  );
};

export default LogotypeNunto;
