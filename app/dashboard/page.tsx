import { Metadata } from "next";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { DataGridDemo } from "@/components/data-grid/data-grid-demo";
import DataGridRenderPage from "@/components/data-grid/data-grid-render/data-grid-render-page";
import {
  DataGridSkeleton,
  DataGridSkeletonGrid,
  DataGridSkeletonToolbar,
} from "@/components/data-grid/data-grid-skeleton";
import { DashboardKanban } from "@/features/dashboard/components/dashboard-kanban";
import { Prettify, SearchParams } from "@/types";

export const metadata: Metadata = {
  title: "Performance Statistics & Overview | Dashboard",
  description:
    "Get comprehensive real-time statistics and an overview of your organization's performance, user engagement, and system health metrics.",
  keywords: [
    "dashboard statistics",
    "performance overview",
    "system health metrics",
    "user engagement analytics",
    "live workspace statistics",
  ],
  alternates: {
    canonical: "https://dashboards-three-drab.vercel.app/dashboard",
  },
  openGraph: {
    title: "Performance Statistics & Overview | Dashboard",
    description:
      "Get comprehensive real-time statistics and an overview of your organization's performance, user engagement, and system health metrics.",
    url: "https://dashboards-three-drab.vercel.app/dashboard",
    siteName: "Dashboards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Performance Statistics & Overview | Dashboard",
    description:
      "Get comprehensive real-time statistics and an overview of your organization's performance.",
  },
};

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

const DashboardPage = ({ searchParams }: Prettify<DashboardPageProps>) => {
  return (
    <SidebarInsetContent>
      <div>
        <DashboardKanban searchParams={searchParams} />

        {/* Data Grid */}
        {/* <Suspense
          fallback={
            <DataGridSkeleton className="container flex flex-col gap-4 py-4">
              <DataGridSkeletonToolbar actionCount={5} />
              <DataGridSkeletonGrid />
            </DataGridSkeleton>
          }
        >
          <DataGridDemo />
        </Suspense> */}

        {/* Data Grid Render */}

        {/* <DataGridRenderPage /> */}

        {/* Task Table */}
        {/* <TaskTableWrapper /> */}
      </div>
    </SidebarInsetContent>
  );
};

export default DashboardPage;
