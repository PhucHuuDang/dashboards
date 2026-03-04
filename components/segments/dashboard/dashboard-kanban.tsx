"use client";

import { Fragment, useState } from "react";

import { TrendingUp, UserIcon } from "lucide-react";

import { StatisticCard } from "@/components/card-block/statistic-card";
import { RichAreaChart } from "@/components/charts/rich-area-chart";
import { RichPieChart } from "@/components/charts/rich-pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
} from "@/components/ui/kanban";

import TaskTableWrapper from "../../data-table/task-table/task-table-wrapper";

import type { ChartConfig } from "@/components/ui/chart";
import type { Prettify, SearchParams } from "@/types";

interface DashboardBlock {
  id: string;
  component: React.ReactNode;
}

interface DashboardKanbanProps {
  searchParams: Promise<SearchParams>;
}

const PIE_DATA = [
  { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Other", visitors: 90, fill: "var(--color-other)" },
];

const PIE_CONFIG = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

const AREA_DATA = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const AREA_CONFIG = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

function StatisticBlock() {
  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    users: [
      {
        id: "1",
        component: (
          <StatisticCard title="Users" description="100" icon={UserIcon} />
        ),
      },
    ],
    orders: [
      {
        id: "2",
        component: (
          <StatisticCard title="Orders" description="100" icon={UserIcon} />
        ),
      },
    ],
    products: [
      {
        id: "3",
        component: (
          <StatisticCard title="Products" description="100" icon={UserIcon} />
        ),
      },
    ],
    revenue: [
      {
        id: "4",
        component: (
          <StatisticCard title="Revenue" description="100" icon={UserIcon} />
        ),
      },
    ],
  });

  return (
    <>
      <KanbanColumnHandle className="w-full transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl">
        <Kanban<DashboardBlock>
          value={columns}
          onValueChange={setColumns}
          getItemValue={(item) => item.id}
        >
          <KanbanBoard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            {Object.entries(columns).map(([columnId, blocks]) => (
              <KanbanColumn key={columnId} value={columnId}>
                {blocks.map((block) => (
                  <Fragment key={`${columnId}-block-${block.id}`}>
                    {block.component}
                  </Fragment>
                ))}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </KanbanColumnHandle>
    </>
  );
}

function ChartsBlock() {
  return (
    <KanbanColumnHandle className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 w-full transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Donut Active</CardTitle>
          <CardDescription>January - June 2025</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <RichPieChart
            data={PIE_DATA}
            config={PIE_CONFIG}
            dataKey="visitors"
            nameKey="browser"
          />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month
            <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <RichAreaChart
            data={AREA_DATA}
            config={AREA_CONFIG}
            areas={[
              { dataKey: "mobile", stackId: "a", type: "natural" },
              { dataKey: "desktop", stackId: "a", type: "natural" },
            ]}
            xAxisKey="date"
            xAxisFormatter={(v) =>
              new Date(v).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            tooltipLabelFormatter={(v) =>
              new Date(v).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            showYAxis={false}
            showLegend
            className="aspect-auto h-[250px] w-full"
          />
        </CardContent>
      </Card>
    </KanbanColumnHandle>
  );
}

export const DashboardKanban = ({
  searchParams,
}: Prettify<
  DashboardKanbanProps & {
    blocks?: DashboardBlock[];
  }
>) => {
  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    totalUsers: [{ id: "1", component: <StatisticBlock /> }],
    charts: [{ id: "2", component: <ChartsBlock /> }],
    dataTable: [
      { id: "3", component: <TaskTableWrapper searchParams={searchParams} /> },
    ],
  });

  return (
    <Kanban<DashboardBlock>
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="overflow-hidden space-y-2 md:space-y-3 lg:space-y-4">
        {Object.entries(columns).map(([columnId, blocks]) => (
          <KanbanColumn key={columnId} value={columnId} className="min-w-full">
            <div>
              {blocks.map((block) => (
                <div key={`${columnId}-block-${block.id}`}>
                  {block.component}
                </div>
              ))}
            </div>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Kanban>
  );
};
