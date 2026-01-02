import { SidebarContainer } from "@/container/sidebar-container";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <SidebarContainer>{children}</SidebarContainer>;
};

export default DashboardLayout;
