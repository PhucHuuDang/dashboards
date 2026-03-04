"use client";

import * as React from "react";

import { motion } from "motion/react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { cn } from "@/lib/utils";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const AnimatedActiveSector = React.memo(function AnimatedActiveSector(
  props: PieSectorDataItem,
) {
  const { cx = 0, cy = 0, outerRadius = 0 } = props;
  const expandedRadius = outerRadius + 12;

  return (
    <motion.g
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
      }}
    >
      <motion.g
        initial={{ scale: outerRadius / expandedRadius }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ transformOrigin: `${cx}px ${cy}px`, borderRadius: "16px" }}
      >
        <Sector
          {...props}
          outerRadius={expandedRadius}
          style={{ cursor: "pointer" }}
        />
      </motion.g>
    </motion.g>
  );
});

interface CenterLabel {
  value: string | number;
  label: string;
}

export interface RichPieChartProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  centerLabel?: CenterLabel;
  showLegend?: boolean;
  className?: string;
  animationDelay?: number;
}

export const RichPieChart = React.memo(function RichPieChart({
  data,
  config,
  dataKey,
  nameKey,
  innerRadius = 50,
  outerRadius = 70,
  paddingAngle = 3,
  centerLabel,
  showLegend = true,
  className,
  animationDelay = 300,
}: RichPieChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
    undefined,
  );

  const getColor = React.useCallback(
    (name: string) => {
      const entry = Object.entries(config).find(
        ([, v]) => v.label === name && "color" in v,
      );
      return entry?.[1]?.color as string | undefined;
    },
    [config],
  );

  const handleMouseEnter = React.useCallback(
    (_: unknown, index: number) => setActiveIndex(index),
    [],
  );
  const handleMouseLeave = React.useCallback(
    () => setActiveIndex(undefined),
    [],
  );

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center gap-6",
        className,
      )}
    >
      <ChartContainer
        config={config}
        className="aspect-square h-[200px] w-[200px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={2}
            stroke="hsl(var(--card))"
            paddingAngle={paddingAngle}
            activeIndex={activeIndex}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            activeShape={(props: PieSectorDataItem) => (
              <AnimatedActiveSector {...props} />
            )}
            animationBegin={animationDelay}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {centerLabel && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {centerLabel.value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 18}
                          className="fill-muted-foreground text-[10px]"
                        >
                          {centerLabel.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            )}
          </Pie>
        </PieChart>
      </ChartContainer>

      {showLegend && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {data.map((item, index) => {
            const name = String(item[nameKey]);
            const value = Number(item[dataKey]);
            const isActive = index === activeIndex;
            const color = getColor(name);

            return (
              <div
                key={name}
                className={cn(
                  "flex cursor-pointer items-center gap-2 transition-all hover:scale-105 ",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground/90 hover:text-foreground",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={cn(
                    "size-2.5 shrink-0 rounded-full transition-transform",
                    isActive && "scale-125",
                  )}
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium whitespace-nowrap">
                  {name}
                </span>
                <span className="text-[10px] font-semibold tabular-nums">
                  {value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
