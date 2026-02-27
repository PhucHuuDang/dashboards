import { Metadata } from "next";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import ActivitiesClient from "@/components/segments/activities/activities-client";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Track all recent activities across your workspace including tasks, projects, comments, and system updates.",
  keywords: [
    "activities",
    "activity log",
    "workspace",
    "tasks",
    "projects",
    "dashboard",
  ],
};

const ActivitiesPage = () => {
  return (
    <SidebarInsetContent>
      <ActivitiesClient />
    </SidebarInsetContent>
  );
};

export default ActivitiesPage;
