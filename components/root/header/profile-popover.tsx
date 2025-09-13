import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export function ProfilePopover({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const signOutHandler = () => {
    signOut();
    toast.success("Вы успешно вышли из системы!");
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-full w-10 h-10
             bg-gradient-to-r from-cyan-500/80 to-sky-500/80 text-white
             hover:from-cyan-400 hover:to-sky-400 transition-colors
             focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <User size={18} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-1">
          {isAuthenticated && (
            <div>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={16} />
                Профиль
              </Link>
              <button
                className="flex text-red-500 cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                onClick={() => signOutHandler()}
              >
                <LogOut size={16} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
