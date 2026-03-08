"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { RichPieChart } from "@/components/charts/rich-pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";
import type { DepartmentChartPoint } from "@/features/employee/hooks/use-employee-analytics";

// ─── Chart config ────────────────────────────────────────────────────────────

const chartConfig = {
  value: { label: "Employees" },
  engineering: { label: "Engineering", color: "hsl(217, 91%, 60%)" },
  marketing: { label: "Marketing", color: "hsl(280, 65%, 60%)" },
  hr: { label: "HR", color: "hsl(152, 69%, 45%)" },
  finance: { label: "Finance", color: "hsl(38, 92%, 55%)" },
  sales: { label: "Sales", color: "hsl(340, 82%, 60%)" },
  legal: { label: "Legal", color: "hsl(190, 70%, 50%)" },
} satisfies ChartConfig;

// ─── Component ───────────────────────────────────────────────────────────────

interface DepartmentDistributionChartProps {
  data: DepartmentChartPoint[];
  totalEmployees: number;
  className?: string;
}

export const DepartmentDistributionChart = React.memo(
  function DepartmentDistributionChart({
    data,
    totalEmployees,
    className,
  }: DepartmentDistributionChartProps) {
    // Map fill colors using config keys
    const chartData = React.useMemo(
      () =>
        data.map((d) => ({
          ...d,
          fill: `var(--color-${d.name.toLowerCase()})`,
        })),
      [data],
    );

    return (
      <Card
        className={cn("flex flex-col h-full border rounded-2xl", className)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Department Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Employees by department
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-4">
          <RichPieChart
            data={chartData}
            config={chartConfig}
            dataKey="value"
            nameKey="name"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            cornerRadius={4}
            centerLabel={{
              value: totalEmployees.toLocaleString(),
              label: "Total",
            }}
            showLegend
            animationDelay={400}
          />
        </CardContent>
      </Card>
    );
  },
);
