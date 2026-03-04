"use client";

import * as React from "react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface DiagonalStripeBar {
  dataKey: string;
  patternOpacity?: number;
  stripeOpacity?: number;
  stripeWidth?: number;
  radius?: number | [number, number, number, number];
}

export interface DiagonalStripeBarChartProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  bars: DiagonalStripeBar[];
  categoryKey: string;
  layout?: "vertical" | "horizontal";
  categoryWidth?: number;
  categoryFormatter?: (value: string) => string;
  tooltipContent?: React.ReactElement;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  margin?: { left?: number; right?: number; top?: number; bottom?: number };
}

export const DiagonalStripeBarChart = React.memo(
  function DiagonalStripeBarChart({
    data,
    config,
    bars,
    categoryKey,
    layout = "horizontal",
    categoryWidth = 72,
    categoryFormatter,
    tooltipContent,
    className = "aspect-auto h-[220px] w-full",
    showLegend = false,
    showGrid = false,
    margin = { top: 20, right: 12, bottom: 12, left: 12 },
  }: DiagonalStripeBarChartProps) {
    const id = React.useId();
    const safeId = id.replace(/:/g, "");
    const isVertical = layout === "vertical";

    return (
      <ChartContainer config={config} className={className}>
        <BarChart data={data} layout={layout} margin={margin}>
          <defs>
            {bars.map((bar) => {
              const sw = bar.stripeWidth ?? 1.5;
              const so = bar.stripeOpacity ?? 0.6;
              return (
                <pattern
                  key={bar.dataKey}
                  id={`${safeId}-stripe-${bar.dataKey}`}
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                >
                  <rect
                    width="8"
                    height="8"
                    fill={`var(--color-${bar.dataKey})`}
                    opacity={bar.patternOpacity ?? 0.1}
                  />
                  <path
                    d="M0,8 L8,0 M4,12 L12,4 M-4,4 L4,-4"
                    stroke={`var(--color-${bar.dataKey})`}
                    strokeWidth={sw}
                    opacity={so}
                  />
                  <path
                    d="M2,10 L10,2 M6,14 L14,6 M-2,6 L6,-2"
                    stroke={`var(--color-${bar.dataKey})`}
                    strokeWidth={sw * 0.67}
                    opacity={so * 0.5}
                  />
                </pattern>
              );
            })}
          </defs>
          {showGrid && (
            <CartesianGrid
              horizontal={!isVertical}
              vertical={isVertical}
              strokeDasharray="3 3"
              opacity={0.08}
            />
          )}
          {isVertical ? (
            <>
              <XAxis
                type="number"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                dataKey={categoryKey}
                type="category"
                width={categoryWidth}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={categoryFormatter}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={categoryKey}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={categoryFormatter}
              />
            </>
          )}
          <ChartTooltip
            cursor={false}
            content={
              tooltipContent ?? (
                <ChartTooltipContent labelKey={categoryKey} indicator="dot" />
              )
            }
          />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={`url(#${safeId}-stripe-${bar.dataKey})`}
              stroke={`var(--color-${bar.dataKey})`}
              strokeWidth={1}
              radius={bar.radius ?? [4, 4, 4, 4]}
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
        </BarChart>
      </ChartContainer>
    );
  },
);
