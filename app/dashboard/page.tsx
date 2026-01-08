import { Metadata } from "next";
import { Prettify, SearchParams } from "@/types";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { DashboardKanban } from "@/components/segments/dashboard/dashboard-kanban";

import { DataGridDemo } from "@/components/data-grid/data-grid-demo";
import DataGridRenderPage from "@/components/data-grid/data-grid-render/data-grid-render-page";
import {
  DataGridSkeleton,
  DataGridSkeletonGrid,
  DataGridSkeletonToolbar,
} from "@/components/data-grid/data-grid-skeleton";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "The statistics of the dashboard show the performance of the website.",
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
