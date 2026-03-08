"use client";

import * as React from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import { formatGrowthPercent, type GrowthResult } from "@/lib/analytics-utils";
import { cn } from "@/lib/utils";

import { RichAreaChart } from "@/components/charts/rich-area-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";
import type { EmployeeGrowthChartPoint } from "@/features/employee/hooks/use-employee-analytics";

// ─── Chart config ────────────────────────────────────────────────────────────

const chartConfig = {
  total: { label: "Total", color: "hsl(217, 91%, 60%)" },
  active: { label: "Active", color: "hsl(152, 69%, 45%)" },
  onboarding: { label: "Onboarding", color: "hsl(213, 94%, 68%)" },
  onLeave: { label: "On Leave", color: "hsl(38, 92%, 55%)" },
} satisfies ChartConfig;

const areas = [
  {
    dataKey: "onLeave",
    type: "monotone" as const,
    fillOpacity: [0.2, 0.02] as [number, number],
  },
  {
    dataKey: "onboarding",
    type: "monotone" as const,
    fillOpacity: [0.25, 0.02] as [number, number],
  },
  {
    dataKey: "active",
    type: "monotone" as const,
    fillOpacity: [0.3, 0.03] as [number, number],
  },
  {
    dataKey: "total",
    type: "monotone" as const,
    strokeWidth: 2.5,
    fillOpacity: [0.15, 0.01] as [number, number],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface EmployeeGrowthChartProps {
  data: EmployeeGrowthChartPoint[];
  growth?: GrowthResult;
  className?: string;
}

export const EmployeeGrowthChart = React.memo(function EmployeeGrowthChart({
  data,
  growth,
  className,
}: EmployeeGrowthChartProps) {
  const xAxisFormatter = React.useCallback(
    (v: string) =>
      new Date(v).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    [],
  );

  const tooltipLabelFormatter = React.useCallback(
    (v: string) =>
      new Date(v).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  return (
    <Card className={cn("flex flex-col border rounded-2xl", className)}>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle className="text-base font-semibold">
            Employee Growth Trend
          </CardTitle>
          <CardDescription className="text-xs">
            Headcount by status over time
          </CardDescription>
        </div>
        {growth && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums",
              growth.trend === "up"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                : growth.trend === "down"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                  : "border-border bg-muted text-muted-foreground",
            )}
          >
            {growth.trend === "up" ? (
              <TrendingUp className="size-3.5" />
            ) : growth.trend === "down" ? (
              <TrendingDown className="size-3.5" />
            ) : null}
            {formatGrowthPercent(growth.growthPercent)}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-2 pt-2 sm:px-4">
        <RichAreaChart
          data={data}
          config={chartConfig}
          areas={areas}
          xAxisKey="date"
          xAxisFormatter={xAxisFormatter}
          tooltipLabelFormatter={tooltipLabelFormatter}
          showYAxis
          showLegend
          showGrid
          className="aspect-auto h-[260px] w-full"
          margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
});
