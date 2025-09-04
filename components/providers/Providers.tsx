// components/providers/Providers.tsx
"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { GlobalSidebarToggle } from "@/components/global-sidebar-toggle";
import { Chat } from "@prisma/client";

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
    <SessionProvider session={session}>
      <SidebarProvider className="bg-gray-50" defaultOpen>
        {/* Глобальная кнопка — всегда в левом верхнем углу */}
        <GlobalSidebarToggle />

        <AppSidebar chats={chats} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
