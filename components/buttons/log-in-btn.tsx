import { CLIENT_ROUTES } from "@/lib/client-routes";
import { LogIn } from "lucide-react";
import { redirect } from "next/navigation";

const LogInBtn = () => {
  return (
    <button
      onClick={() => redirect(CLIENT_ROUTES.login)}
      className="bg-black text-white rounded-xl w-full flex gap-2 
      items-center cursor-pointer hover:bg-gray-900 px-5 py-1 
      transition-colors duration-200"
    >
      <LogIn size={15} className="text-white" />
      <span className="text-white">Войти</span>
    </button>
  );
};

export default LogInBtn;
