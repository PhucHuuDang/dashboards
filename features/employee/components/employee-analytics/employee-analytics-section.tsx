"use client";

import * as React from "react";

import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";

import { DateSelectorPopover } from "@/components/patterns/date-selector-popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEmployeeAnalytics } from "@/features/employee/hooks/use-employee-analytics";

import { AnalyticsChartSkeleton } from "./analytics-chart-skeleton";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { DepartmentDistributionChart } from "./department-distribution-chart";
import { EmployeeGrowthChart } from "./employee-growth-chart";
import { EmploymentTypeChart } from "./employment-type-chart";
import { PerformanceDistributionChart } from "./performance-distribution-chart";

// ─── Date preset config ──────────────────────────────────────────────────────

// ─── Lazy wrapper ────────────────────────────────────────────────────────────

function LazyChart({
  children,
  skeleton,

  className,
}: {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "200px 0px",
  });

  return (
    <div ref={ref} className={cn("size-full", className)}>
      {inView ? children : skeleton}
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function EmployeeAnalyticsSection() {
  const {
    preset,
    setPreset,
    currentAggregated,
    growth,
    growthChartData,
    departmentChartData,
    employmentTypeChartData,
    performanceChartData,
    totalGrowth,
  } = useEmployeeAnalytics();

  const kpiValues = React.useMemo(
    () => ({
      totalEmployees: currentAggregated.totalEmployees,
      active: currentAggregated.active,
      onboarding: currentAggregated.onboarding,
      onLeave: currentAggregated.onLeave,
    }),
    [currentAggregated],
  );

  return (
    <section className="space-y-5" aria-label="Employee Analytics">
      <div className="flex items-center justify-between sticky top-10 z-10 border p-4 rounded-2xl bg-background/50 backdrop-blur-md shadow-sm dark:backdrop-brightness-50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage employee records, onboarding, performance, and task
            assignment.
          </p>
        </div>

        <DateSelectorPopover
          value={preset}
          onChange={setPreset}
          className="w-[200px]"
        />
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <AnalyticsKpiCards values={kpiValues} growth={growth} />

      {/* ── Charts Grid ──────────────────────────────────────────────────── */}
      {/* Area chart spans 2 cols */}

      <ResizablePanelGroup
        orientation="horizontal"
        className="w-full h-full gap-2"
      >
        <ResizablePanel defaultSize={35} minSize="35%" maxSize="70%">
          <LazyChart skeleton={<AnalyticsChartSkeleton height={260} />}>
            <DepartmentDistributionChart
              data={departmentChartData}
              totalEmployees={currentAggregated.totalEmployees}
            />
          </LazyChart>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={70} minSize="30%" maxSize="75%">
          <LazyChart
            skeleton={
              <AnalyticsChartSkeleton className="md:col-span-2" height={260} />
            }
          >
            <EmployeeGrowthChart
              data={growthChartData}
              growth={totalGrowth}
              className="md:col-span-2"
            />
          </LazyChart>
        </ResizablePanel>
      </ResizablePanelGroup>

      <ResizablePanelGroup
        orientation="horizontal"
        className="w-full h-full gap-2"
      >
        {/* Pie chart */}
        <ResizablePanel defaultSize={60} minSize="30%" maxSize="70%">
          <LazyChart skeleton={<AnalyticsChartSkeleton height={200} />}>
            <EmploymentTypeChart data={employmentTypeChartData} />
          </LazyChart>
        </ResizablePanel>

        <ResizableHandle withHandle />
        {/* Employment type */}
        <ResizablePanel defaultSize={34} minSize="30%" maxSize="75%">
          <LazyChart skeleton={<AnalyticsChartSkeleton height={200} />}>
            <PerformanceDistributionChart data={performanceChartData} />
          </LazyChart>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
