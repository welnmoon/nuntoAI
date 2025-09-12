import Link from "next/link";
import { LogInIcon } from "lucide-react";

const HeaderLogInBtn = () => {
  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2 font-medium
      text-white bg-gradient-to-r from-cyan-500 to-sky-500 shadow-sm ring-1 ring-white/10
      hover:from-cyan-400 hover:to-sky-400 active:from-cyan-500 active:to-sky-500/90
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      Войти <LogInIcon size={16} />
    </Link>
  );
};

export default HeaderLogInBtn;
