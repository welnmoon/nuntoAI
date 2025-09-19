import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import ProfileUserSection from "@/components/profile/profile-user-section";
import { prisma } from "@/prisma/prisma-client";
import { CLIENT_ROUTES } from "@/lib/client-routes";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const { user } = session;
  const dbUser = await prisma.user.findUnique({
    where: {
      id: Number(user.id),
    },
  });

  if (!dbUser) {
    redirect(CLIENT_ROUTES.login);
  }
  return (
    <>
      <ProfileUserSection user={dbUser} />
    </>
  );
}
