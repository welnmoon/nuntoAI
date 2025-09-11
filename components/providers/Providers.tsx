// components/providers/Providers.tsx
"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { GlobalSidebarToggle } from "@/components/global-sidebar-toggle";
import { Chat } from "@prisma/client";
import { TvIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const isAuthenticated = !!session?.user;
  return (
    <SessionProvider session={session}>
      <ThemeProviders>
        {isAuthenticated ? (
          <SidebarProvider className="bg-gray-50 dark:bg-gray-900" defaultOpen>
            {/* Глобальная кнопка — всегда в левом верхнем углу */}
            <GlobalSidebarToggle />
            <AppSidebar chats={chats} />

            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        ) : (
          <div>{children}</div>
        )}
      </ThemeProviders>
    </SessionProvider>
  );
}
