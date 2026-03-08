"use client";

import * as React from "react";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { EmploymentTypeChartPoint } from "@/features/employee/hooks/use-employee-analytics";

// ─── Config ──────────────────────────────────────────────────────────────────

const LABELS: Record<string, string> = {
  fullTime: "Full-time",
  partTime: "Part-time",
  contract: "Contract",
  intern: "Intern",
};

const chartConfig = {
  count: { label: "Employees" },
  fullTime: { label: "Full-time", color: "hsl(217, 91%, 60%)" },
  partTime: { label: "Part-time", color: "hsl(280, 65%, 60%)" },
  contract: { label: "Contract", color: "hsl(38, 92%, 55%)" },
  intern: { label: "Intern", color: "hsl(152, 69%, 45%)" },
} satisfies ChartConfig;

// ─── Component ───────────────────────────────────────────────────────────────

interface EmploymentTypeChartProps {
  data: EmploymentTypeChartPoint[];
  className?: string;
}

export const EmploymentTypeChart = React.memo(function EmploymentTypeChart({
  data,
  className,
}: EmploymentTypeChartProps) {
  const total = React.useMemo(
    () => data.reduce((s, d) => s + d.count, 0),
    [data],
  );

  const chartData = React.useMemo(
    () =>
      data.map((d) => ({
        type: LABELS[d.type] ?? d.type,
        count: d.count,
        fill: `var(--color-${d.type})`,
        percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
      })),
    [data, total],
  );

  const tickFormatter = React.useCallback((value: string) => value, []);

  return (
    <Card className={cn("flex flex-col border rounded-2xl", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Employment Type
        </CardTitle>
        <CardDescription className="text-xs">
          Breakdown by contract type
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 48, top: 8, bottom: 8 }}
          >
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              axisLine={false}
              width={72}
              fontSize={11}
              tickFormatter={tickFormatter}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              radius={[0, 6, 6, 0]}
              barSize={24}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ChartContainer>
        {/* Percentage labels */}
        <div className="mt-2 flex flex-wrap gap-3 px-2">
          {chartData.map((item) => (
            <div
              key={item.type}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div
                className="size-2 rounded-full"
                style={{
                  backgroundColor: `var(--color-${data.find((d) => LABELS[d.type] === item.type)?.type ?? "fullTime"})`,
                }}
              />
              <span className="font-medium">{item.type}</span>
              <span className="tabular-nums font-semibold text-foreground">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
