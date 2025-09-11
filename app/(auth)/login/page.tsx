"use server";

import Login from "@/components/login/login";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect(CLIENT_ROUTES.home);
  }
  return <Login />;
};

export default LoginPage;
