"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { DiagonalStripeBarChart } from "@/components/charts/diagonal-stripe-bar-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";
import type { PerformanceChartPoint } from "@/hooks/use-employee-analytics";

// ─── Config ──────────────────────────────────────────────────────────────────

const LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
};

const chartConfig = {
  excellent: { label: "Excellent", color: "hsl(152, 69%, 45%)" },
  good: { label: "Good", color: "hsl(217, 91%, 60%)" },
  average: { label: "Average", color: "hsl(38, 92%, 55%)" },
  poor: { label: "Poor", color: "hsl(0, 72%, 55%)" },
} satisfies ChartConfig;

// Stripe pattern only for Average & Poor
const bars = [
  {
    dataKey: "excellent",
    radius: [6, 6, 0, 0] as [number, number, number, number],
    patternOpacity: 0,
    stripeOpacity: 0,
  },
  {
    dataKey: "good",
    radius: [6, 6, 0, 0] as [number, number, number, number],
    patternOpacity: 0,
    stripeOpacity: 0,
  },
  {
    dataKey: "average",
    radius: [6, 6, 0, 0] as [number, number, number, number],
    patternOpacity: 0.15,
    stripeOpacity: 0.5,
  },
  {
    dataKey: "poor",
    radius: [6, 6, 0, 0] as [number, number, number, number],
    patternOpacity: 0.2,
    stripeOpacity: 0.7,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface PerformanceDistributionChartProps {
  data: PerformanceChartPoint[];
  className?: string;
}

export const PerformanceDistributionChart = React.memo(
  function PerformanceDistributionChart({
    data,
    className,
  }: PerformanceDistributionChartProps) {
    // Reshape data: each level -> its own column in a single row
    const chartData = React.useMemo(() => {
      const row: Record<string, unknown> = { category: "Performance" };
      for (const d of data) {
        row[d.level] = d.count;
      }
      return [row];
    }, [data]);

    const total = React.useMemo(
      () => data.reduce((s, d) => s + d.count, 0),
      [data],
    );

    return (
      <Card className={cn("flex flex-col h-full", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Performance Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Employee ratings overview
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <DiagonalStripeBarChart
            data={chartData}
            config={chartConfig}
            bars={bars}
            categoryKey="category"
            className="aspect-auto h-[180px] w-full"
            showLegend
            margin={{ left: 12, right: 12, top: 12, bottom: 4 }}
          />
          {/* Summary pills */}
          <div className="mt-3 flex flex-wrap gap-2 px-2">
            {data.map((d) => {
              const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
              return (
                <div
                  key={d.level}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <div
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        chartConfig[d.level as keyof typeof chartConfig]?.color,
                    }}
                  />
                  <span className="font-medium">
                    {LABELS[d.level] ?? d.level}
                  </span>
                  <span className="tabular-nums font-semibold text-foreground">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  },
);
