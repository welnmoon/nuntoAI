import { CLIENT_ROUTES } from "@/lib/client-routes";
import { LogIn } from "lucide-react";
import { redirect } from "next/navigation";

const LogInBtn = () => {
  return (
    <button
      onClick={() => redirect(CLIENT_ROUTES.login)}
      className="bg-black dark:bg-white  text-white rounded-xl w-full flex gap-2 
      items-center cursor-pointer hover:bg-gray-900 px-5 py-1 
      transition-colors duration-200"
    >
      <LogIn size={15} className="text-white dark:text-black" />
      <span className="text-white dark:text-black">Войти</span>
    </button>
  );
};

export default LogInBtn;
