"use server";

import Login from "@/components/login/login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }
  return <Login />;
};

export default LoginPage;
