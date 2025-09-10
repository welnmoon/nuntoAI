import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogOutBtn = () => {
  return (
    <button
      onClick={() => signOut()}
      className="w-full flex gap-2 items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition-colors duration-200"
    >
      <LogOut size={15} className="text-red-500" />
      <span className="text-red-500">Выйти</span>
    </button>
  );
};

export default LogOutBtn;
