import { RichAreaChart } from "@/components/charts/rich-area-chart";
import { RichPieChart } from "@/components/charts/rich-pie-chart";
import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { DashboardKanban } from "@/components/common/dashboard-kanban";
import { StatisticCard } from "@/components/common/statistic-card";
import { UserIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "The statistics of the dashboard show the performance of the website.",
};

const DashboardPage = () => {
  return (
    <SidebarInsetContent>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
          <StatisticCard
            title="Total Users"
            description="100"
            icon={UserIcon}
          />

          <StatisticCard
            title="Total Orders"
            description="100"
            icon={UserIcon}
          />

          <StatisticCard
            title="Total Revenue"
            description="100"
            icon={UserIcon}
          />

          <StatisticCard
            title="Total Products"
            description="100"
            icon={UserIcon}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 gap-y-4">
          <RichPieChart />
          <RichAreaChart />
        </div>
        {/* <DashboardKanban /> */}
      </div>
    </SidebarInsetContent>
  );
};

export default DashboardPage;
