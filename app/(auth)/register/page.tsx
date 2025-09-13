"use server";
import AuthSwitcher from "@/components/auth/auth-switcher";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect(CLIENT_ROUTES.home);
  }
  return <AuthSwitcher initial="register" />;
};

export default RegisterPage;
