// components/providers/Providers.tsx
"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { GlobalSidebarToggle } from "@/components/global-sidebar-toggle";
import { Chat } from "@prisma/client";
import { ThemeProviders } from "./theme-provider";

export function Providers({
  children,
  session,
  chats,
}: {
  children: React.ReactNode;
  session?: Session | null;
  chats?: Chat[];
}) {
  return (
    <ThemeProviders>
      <AuthGate chats={chats}>{children}</AuthGate>
    </ThemeProviders>
  );
}

function AuthGate({
  children,
  chats,
}: {
  children: React.ReactNode;
  chats?: Chat[];
}) {
  const { data: clientSession, status } = useSession();
  const isAuthenticated = !!clientSession?.user;

  if (status === "loading") {
    return <div>{children}</div>;
  }

  return isAuthenticated ? (
    <SidebarProvider className="bg-gray-50 dark:bg-gray-900" defaultOpen>
      <GlobalSidebarToggle />
      <AppSidebar chats={chats} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  ) : (
    <div>{children}</div>
  );
}
