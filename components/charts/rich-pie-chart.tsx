"use client";

import { ChartPieIcon, SettingsIcon, TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";
import { motion } from "motion/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
// Animated Sector wrapper component with smooth spring animation
const AnimatedActiveSector = (props: PieSectorDataItem) => {
  const { cx = 0, cy = 0, outerRadius = 0 } = props;
  const expandedRadius = outerRadius + 10;

  return (
    <motion.g
      initial={{ scale: 1 }}
      animate={{
        scale: 1,
      }}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
      }}
    >
      <motion.g
        initial={{ scale: outerRadius / expandedRadius }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <Sector
          {...props}
          outerRadius={expandedRadius}
          style={{ cursor: "pointer" }}
        />
      </motion.g>
    </motion.g>
  );
};

export const description = "A donut chart with an active sector";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--color-foreground)",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface RichPieChartProps {
  data: DataItem[];

  width?: number;
  height?: number;

  className?: string;
}

export function RichPieChart() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // const [showStatusBar, setShowStatusBar] = React.useState<boolean>(true);
  // const [showActivityBar, setShowActivityBar] = React.useState<boolean>(false);
  // const [showPanel, setShowPanel] = React.useState<boolean>(false);

  const [dropdownValue, setDropdownValue] = useState<
    Record<string, boolean | string>
  >({
    showStatusBar: true,
    showActivityBar: false,
    showPanel: false,
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center flex justify-between pb-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ChartPieIcon className="h-4 w-4" />
            Pie Chart - Donut Active
          </CardTitle>
          <CardDescription>January - June 2025</CardDescription>
        </div>

        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2 bg-muted-foreground/10 hover:bg-muted-foreground/20 rounded-full cursor-pointer transition-colors duration-300">
                <SettingsIcon className="h-4 w-4 text-foreground  " />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-background"
              align="start"
              alignOffset={10}
              side="bottom"
              sideOffset={10}
            >
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={dropdownValue.showStatusBar as boolean}
                onCheckedChange={(value) =>
                  setDropdownValue({ ...dropdownValue, showStatusBar: value })
                }
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dropdownValue.showActivityBar as boolean}
                onCheckedChange={(value) =>
                  setDropdownValue({ ...dropdownValue, showActivityBar: value })
                }
                disabled
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dropdownValue.showPanel as boolean}
                onCheckedChange={(value) =>
                  setDropdownValue({ ...dropdownValue, showPanel: value })
                }
              >
                Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        {/* <div className="flex flex-col sm:flex-row items-center gap-0"> */}
        {/* Chart */}
        <ChartContainer config={chartConfig} className="min-w-64 w-full ">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={50}
              outerRadius={70}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, index) => {
                setActiveIndex(index);
              }}
              onMouseLeave={() => {
                setActiveIndex(undefined);
              }}
              activeShape={(props: PieSectorDataItem) => (
                <AnimatedActiveSector {...props} />
              )}
              animationBegin={300}
            />
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-col sm:gap-1.5">
          {chartData.map((item, index) => {
            // console.log({ item });

            const isActive = index === activeIndex;

            const color =
              chartConfig[item.browser as keyof typeof chartConfig]?.color;
            return (
              <div
                key={item.browser}
                className={cn(
                  "flex items-center gap-2 cursor-pointer transition-all text-foreground hover:scale-105",
                  isActive
                    ? "text-foreground "
                    : ` text-muted-foreground/90 hover:text-foreground`
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full shrink-0",
                    isActive && "scale-125"
                  )}
                  style={{
                    backgroundColor: `${color}`,
                  }}
                />
                <span className="text-sm font-medium capitalize">
                  {item.browser}
                </span>
                <span className="text-xs font-semibold tabular-nums ">
                  {item.visitors.toLocaleString()}
                </span>
              </div>
            );
          })}
          {/* </div> */}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
