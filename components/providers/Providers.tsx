// components/providers/Providers.tsx
"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalSidebarToggle } from "@/components/global-sidebar-toggle";
import { Toaster } from "react-hot-toast";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider className="bg-gray-50" defaultOpen>
        {/* Глобальная кнопка — всегда в левом верхнем углу */}
        <GlobalSidebarToggle />

        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
        
      </SidebarProvider>
    </SessionProvider>
  );
}
