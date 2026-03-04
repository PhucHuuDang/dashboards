"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface RichAreaChartArea {
  dataKey: string;
  type?: "monotone" | "natural" | "linear" | "step";
  stackId?: string;
  strokeWidth?: number;
  fillOpacity?: [number, number];
}

export interface RichAreaChartProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  areas: RichAreaChartArea[];
  xAxisKey: string;
  xAxisFormatter?: (value: string) => string;
  tooltipLabelKey?: string;
  tooltipLabelFormatter?: (value: string) => string;
  showYAxis?: boolean;
  yAxisDomain?: [number | string, number | string];
  yAxisWidth?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  margin?: { left?: number; right?: number; top?: number; bottom?: number };
}

export const RichAreaChart = React.memo(function RichAreaChart({
  data,
  config,
  areas,
  xAxisKey,
  xAxisFormatter,
  tooltipLabelKey,
  tooltipLabelFormatter,
  showYAxis = true,
  yAxisDomain,
  yAxisWidth = 28,
  className = "aspect-auto h-[200px] w-full",
  showLegend = false,
  showGrid = true,
  margin = { left: 0, right: 8, top: 8, bottom: 0 },
}: RichAreaChartProps) {
  const id = React.useId();
  const safeId = id.replace(/:/g, "");

  return (
    <ChartContainer config={config} className={className}>
      <AreaChart data={data} margin={margin}>
        <defs>
          {areas.map((area) => (
            <linearGradient
              key={area.dataKey}
              id={`${safeId}-fill-${area.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${area.dataKey})`}
                stopOpacity={area.fillOpacity?.[0] ?? 0.4}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${area.dataKey})`}
                stopOpacity={area.fillOpacity?.[1] ?? 0.05}
              />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.08} />}
        <XAxis
          dataKey={xAxisKey}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={xAxisFormatter}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        {showYAxis && (
          <YAxis
            domain={yAxisDomain}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelKey={tooltipLabelKey}
              labelFormatter={tooltipLabelFormatter}
              indicator="dot"
            />
          }
        />
        {areas.map((area) => (
          <Area
            key={area.dataKey}
            dataKey={area.dataKey}
            type={area.type ?? "monotone"}
            fill={`url(#${safeId}-fill-${area.dataKey})`}
            stroke={`var(--color-${area.dataKey})`}
            strokeWidth={area.strokeWidth ?? 2}
            stackId={area.stackId}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        ))}
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent />}
            className="text-[10px]"
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
});
