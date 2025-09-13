"use server";

import AuthSwitcher from "@/components/auth/auth-switcher";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect(CLIENT_ROUTES.home);
  }
  return <AuthSwitcher initial="login" />;
};

export default LoginPage;
