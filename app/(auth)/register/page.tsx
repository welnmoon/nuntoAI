"use server";
import RegisterForm from "@/components/form/register/register-form";
import { CLIENT_ROUTES } from "@/lib/client-routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect(CLIENT_ROUTES.home);
  }
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
