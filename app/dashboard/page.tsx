import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "The statistics of the dashboard show the performance of the website.",
};

const DashboardPage = () => {
  return <SidebarInsetContent>DashboardPage</SidebarInsetContent>;
};

export default DashboardPage;
