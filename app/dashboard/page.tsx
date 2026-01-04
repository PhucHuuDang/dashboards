import { RichAreaChart } from "@/components/charts/rich-area-chart";
import { RichPieChart } from "@/components/charts/rich-pie-chart";
import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { DashboardKanban } from "@/components/common/dashboard-kanban";
import { DashboardKanbanImplement } from "@/components/common/dashboard-kanban-implement";
import { StatisticCard } from "@/components/common/statistic-card";
import { DataGridDemo } from "@/components/data-grid/data-grid-demo";
import DataGridRenderPage from "@/components/data-grid/data-grid-render/data-grid-render-page";
import {
  DataGridSkeleton,
  DataGridSkeletonGrid,
  DataGridSkeletonToolbar,
} from "@/components/data-grid/data-grid-skeleton";
import TaskTableWrapper from "@/components/data-table/task-table/task-table-wrapper";
import { Prettify, SearchParams } from "@/types";
import { UserIcon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

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
        <DashboardKanbanImplement searchParams={searchParams} />

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
