// components/providers/Providers.tsx
"use client";

import { useSession } from "next-auth/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { GlobalSidebarToggle } from "@/components/global-sidebar-toggle";
import { Chat } from "@prisma/client";
import { ThemeProviders } from "./theme-provider";
import ModelSelect from "../chat/model-select";
import { useSelectedModelsStore } from "@/store/selected-models-store";
import { useChatController } from "../chat/use-chat-controller";
import { MessageCircleDashed, MessageCircleIcon } from "lucide-react";
import VerticalDivider from "../vertical-divider";

export function Providers({
  children,

  chats,
}: {
  children: React.ReactNode;

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
  const selectedModel = useSelectedModelsStore((s) => s.selectedModel);
  const setSelectedModel = useSelectedModelsStore((s) => s.setSelectedModel);
  const { tariffSlug, isTemporary, toggleTemporary } = useChatController({});

  return isAuthenticated ? (
    <SidebarProvider className="bg-gray-50 dark:bg-gray-900" defaultOpen>
      <GlobalSidebarToggle />
      <AppSidebar chats={chats} />
      <SidebarInset>
        <div className="sticky items-center flex gap-4 mr-5 top-5 z-20 flex justify-end">
          <ModelSelect
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            tariffSlug={tariffSlug}
          />

          <VerticalDivider />
          <MessageCircleDashed
            className={`cursor-pointer  ${
              !isTemporary && "text-black dark:text-white"
            } size-6`}
            style={isTemporary ? { color: "var(--accent)" } : {}}
            onClick={toggleTemporary}
          />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <div>{children}</div>
  );
}
