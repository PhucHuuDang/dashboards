import React from "react";

import { Metadata, Viewport } from "next";

import { SidebarContainer } from "@/container/sidebar-container";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <SidebarContainer>{children}</SidebarContainer>;
};

export default DashboardLayout;
