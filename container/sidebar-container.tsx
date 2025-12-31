"use client";
import React from "react";

import { SIDEBAR_CONSTANT } from "@/constant/sidebar-constant";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarRail,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  SidebarFooterChunk,
  SidebarGroupProjectChunk,
  SidebarHeaderChunk,
  TeamProps,
} from "@/components/chunks/sidebar-chunks";

export const SidebarContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const [activeTeam, setActiveTeam] = React.useState<TeamProps | undefined>(
    SIDEBAR_CONSTANT.teams?.items?.[0] ?? ({} as TeamProps)
  );

  if (!activeTeam) return null;

  return (
    <SidebarProvider className="">
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeaderChunk
          isMobile={isMobile}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
          teams={SIDEBAR_CONSTANT.teams}
        />

        <SidebarContent>
          <SidebarGroupProjectChunk
            isMobile={isMobile}
            projects={{
              label: "Settings",
              items: SIDEBAR_CONSTANT.projects?.items ?? [],
            }}
          />

          <SidebarGroupProjectChunk
            isMobile={isMobile}
            projects={{
              label: "Platform",
              items: SIDEBAR_CONSTANT.projects?.items ?? [],
            }}
          />
        </SidebarContent>

        <SidebarFooterChunk user={SIDEBAR_CONSTANT.user} isMobile={isMobile} />
        <SidebarRail />
      </Sidebar>

      {children}
    </SidebarProvider>
  );
};
