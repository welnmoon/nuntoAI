"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNav } from "@/constants/header-nav";

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex gap-1">
      {headerNav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ring-1 ring-transparent hover:ring-white/10 hover:bg-white/5 text-white/80 hover:text-white after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:origin-left after:scale-x-0 after:bg-cyan-400 after:transition-transform ${
              active ? "text-white after:scale-x-100 after:bg-cyan-400" : ""
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderNav;
