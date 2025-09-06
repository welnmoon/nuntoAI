import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavItem({
  href,
  icon,
  label,
  collapsed,
  onClick,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <span
        className={cn(
          "min-w-0 truncate transition-opacity duration-200 text-md",
          collapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {label}
      </span>
    </>
  );

  const baseClasses =
    "flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-muted transition-colors";

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" className={baseClasses}>
      {content}
    </button>
  );
}
