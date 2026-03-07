"use client";

import { Fragment, useState, useMemo } from "react";

import { TrendingUp, UserIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { dateSelectorValueParser } from "@/lib/validations";

import { StatisticCard } from "@/components/card-block/statistic-card";
import { RichAreaChart } from "@/components/charts/rich-area-chart";
import { RichPieChart } from "@/components/charts/rich-pie-chart";
import TaskTableWrapper from "@/components/data-table/task-table/task-table-wrapper";
import { DateSelectorPopover } from "@/components/patterns/date-selector-popover";
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
import { useDashboardAnalytics } from "@/features/dashboard/hooks/use-dashboard-analytics";

import type { ChartConfig } from "@/components/ui/chart";
import type { Prettify, SearchParams } from "@/types";

interface DashboardBlock {
  id: string;
  component: React.ReactNode;
}

interface DashboardKanbanProps {
  searchParams: Promise<SearchParams>;
}

// removed static PIE_DATA and AREA_DATA

function StatisticBlock() {
  const { metrics } = useDashboardAnalytics();
  const nf = new Intl.NumberFormat("en-US");

  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    users: [{ id: "1", component: null as unknown as React.ReactElement }],
    orders: [{ id: "2", component: null as unknown as React.ReactElement }],
    products: [{ id: "3", component: null as unknown as React.ReactElement }],
    revenue: [{ id: "4", component: null as unknown as React.ReactElement }],
  });

  const renderCard = (id: string) => {
    switch (id) {
      case "1":
        return (
          <StatisticCard
            title="Visitors"
            description={`${nf.format(metrics.users.value)} (${metrics.users.growthPercent > 0 ? "+" : ""}${metrics.users.growthPercent}%)`}
            icon={UserIcon}
          />
        );
      case "2":
        return (
          <StatisticCard
            title="Orders"
            description={`${nf.format(metrics.orders.value)} (${metrics.orders.growthPercent > 0 ? "+" : ""}${metrics.orders.growthPercent}%)`}
            icon={UserIcon}
          />
        );
      case "3":
        return (
          <StatisticCard
            title="Products"
            description={`${nf.format(metrics.products.value)} (${metrics.products.growthPercent > 0 ? "+" : ""}${metrics.products.growthPercent}%)`}
            icon={UserIcon}
          />
        );
      case "4":
        return (
          <StatisticCard
            title="Revenue"
            description={`$${nf.format(metrics.revenue.value)} (${metrics.revenue.growthPercent > 0 ? "+" : ""}${metrics.revenue.growthPercent}%)`}
            icon={UserIcon}
          />
        );
      default:
        return null;
    }
  };

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
                    {renderCard(block.id)}
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
  const { timeseries, metrics, dateRange } = useDashboardAnalytics();

  const areaData = useMemo(() => {
    const data = timeseries.map((d) => ({
      date: d.date,
      desktop: d.visitors.desktop,
      mobile: d.visitors.mobile,
    }));

    if (data.length === 1 && data[0]) {
      const point = data[0];
      const startOfDay = new Date(point.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(point.date);
      endOfDay.setHours(23, 59, 59, 999);

      return [
        { ...point, date: startOfDay.toISOString() },
        { ...point, date: endOfDay.toISOString() },
      ];
    }

    return data;
  }, [timeseries]);

  const pieData = useMemo(() => {
    let chrome = 0,
      safari = 0,
      firefox = 0,
      edge = 0,
      other = 0;
    timeseries.forEach((d) => {
      chrome += d.browsers.chrome;
      safari += d.browsers.safari;
      firefox += d.browsers.firefox;
      edge += d.browsers.edge;
      other += d.browsers.other;
    });
    return [
      { browser: "Chrome", visitors: chrome, fill: "var(--color-chrome)" },
      { browser: "Safari", visitors: safari, fill: "var(--color-safari)" },
      { browser: "Firefox", visitors: firefox, fill: "var(--color-firefox)" },
      { browser: "Edge", visitors: edge, fill: "var(--color-edge)" },
      { browser: "Other", visitors: other, fill: "var(--color-other)" },
    ];
  }, [timeseries]);

  const PIE_CONFIG = {
    visitors: { label: "Visitors" },
    chrome: { label: "Chrome", color: "var(--chart-1)" },
    safari: { label: "Safari", color: "var(--chart-2)" },
    firefox: { label: "Firefox", color: "var(--chart-3)" },
    edge: { label: "Edge", color: "var(--chart-4)" },
    other: { label: "Other", color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const AREA_CONFIG = {
    visitors: { label: "Visitors" },
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <KanbanColumnHandle className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 w-full transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Browser Distribution</CardTitle>
          <CardDescription>
            Selected Date Range ({dateRange.days} days)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-0">
          <RichPieChart
            data={pieData}
            config={PIE_CONFIG}
            dataKey="visitors"
            nameKey="browser"
          />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Visits trending {metrics.users.trend} by{" "}
            {metrics.users.growthPercent > 0 ? "+" : ""}
            {metrics.users.growthPercent}%
            {metrics.users.trend !== "neutral" && (
              <TrendingUp
                className={`size-4 ${metrics.users.trend === "down" ? "rotate-180 text-red-500" : "text-green-500"}`}
              />
            )}
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitor breakdown for the selected timeframe
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Visitor Acquisition</CardTitle>
            <CardDescription>
              Desktop vs Mobile trend over the selected {dateRange.days} days
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <RichAreaChart
            data={areaData}
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
  const [dateRange, setDateRange] = useQueryState(
    "dateRange",
    dateSelectorValueParser.withOptions({ shallow: false }),
  );

  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    totalUsers: [{ id: "1", component: null as unknown as React.ReactElement }],
    charts: [{ id: "2", component: null as unknown as React.ReactElement }],
    dataTable: [{ id: "3", component: null as unknown as React.ReactElement }],
  });

  const renderBlock = (id: string) => {
    switch (id) {
      case "1":
        return <StatisticBlock />;
      case "2":
        return <ChartsBlock />;
      case "3":
        return <TaskTableWrapper searchParams={searchParams} />;
      default:
        return null;
    }
  };

  return (
    <Kanban<DashboardBlock>
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <div className="flex items-center justify-between p-4 rounded-xl sticky top-1 z-20 background/80 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics overview and active tasks.
          </p>
        </div>
        <DateSelectorPopover
          value={dateRange ?? undefined}
          onChange={(val) => setDateRange(val ?? null)}
        />
      </div>

      <KanbanBoard className="overflow-hidden space-y-2 md:space-y-3 lg:space-y-4">
        {Object.entries(columns).map(([columnId, blocks]) => (
          <KanbanColumn key={columnId} value={columnId} className="min-w-full">
            <div>
              {blocks.map((block) => (
                <div key={`${columnId}-block-${block.id}`}>
                  {renderBlock(block.id)}
                </div>
              ))}
            </div>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Kanban>
  );
};
