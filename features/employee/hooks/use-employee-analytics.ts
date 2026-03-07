"use client";

import { useCallback, useMemo } from "react";

import { useQueryState } from "nuqs";

import {
  aggregateRange,
  computeAllGrowth,
  filterDataByRange,
  getDateRangeFromSelector,
  type AggregatedAnalytics,
  type GrowthResult,
} from "@/lib/analytics-utils";

import { EMPLOYEE_ANALYTICS_DATA } from "@/features/employee/mocks/mock-employee-analytics";
import { dateSelectorValueParser } from "@/features/employee/services/employee-validations";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

import type { DateSelectorValue } from "@/components/reui/date-selector";

// ─── Chart data shapes ───────────────────────────────────────────────────────

export interface EmployeeGrowthChartPoint {
  date: string;
  total: number;
  active: number;
  onboarding: number;
  onLeave: number;
  [key: string]: string | number;
}

export interface DepartmentChartPoint {
  name: string;
  value: number;
  fill: string;
}

export interface EmploymentTypeChartPoint {
  type: string;
  count: number;
  fill: string;
}

export interface PerformanceChartPoint {
  level: string;
  count: number;
}

// ─── Color maps ──────────────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, string> = {
  Engineering: "var(--color-engineering)",
  Marketing: "var(--color-marketing)",
  HR: "var(--color-hr)",
  Finance: "var(--color-finance)",
  Sales: "var(--color-sales)",
  Legal: "var(--color-legal)",
};

const EMP_TYPE_COLORS: Record<string, string> = {
  fullTime: "var(--color-fullTime)",
  partTime: "var(--color-partTime)",
  contract: "var(--color-contract)",
  intern: "var(--color-intern)",
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseEmployeeAnalyticsReturn {
  preset: DateSelectorValue;
  setPreset: (preset: DateSelectorValue | undefined) => void;
  currentAggregated: AggregatedAnalytics;
  growth: GrowthResult[];
  growthChartData: EmployeeGrowthChartPoint[];
  departmentChartData: DepartmentChartPoint[];
  employmentTypeChartData: EmploymentTypeChartPoint[];
  performanceChartData: PerformanceChartPoint[];
  totalGrowth: GrowthResult | undefined;
}

export function useEmployeeAnalytics(): UseEmployeeAnalyticsReturn {
  const [preset, setPresetRaw] = useQueryState(
    "dateRange",
    dateSelectorValueParser.withDefault({
      period: "day",
      operator: "between",
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
    } as DateSelectorValue),
  );

  const setPreset = useDebouncedCallback(
    useCallback(
      (p: DateSelectorValue | undefined) => {
        if (p) setPresetRaw(p);
      },
      [setPresetRaw],
    ),
    150,
  );

  // Stable reference to the data
  const data = EMPLOYEE_ANALYTICS_DATA;

  const dateRange = useMemo(() => getDateRangeFromSelector(preset), [preset]);

  // Filtered ranges
  const currentFiltered = useMemo(
    () => filterDataByRange(data, dateRange.start, dateRange.end),
    [data, dateRange],
  );

  // Aggregated
  const currentAggregated = useMemo(
    () => aggregateRange(data, dateRange.start, dateRange.end),
    [data, dateRange],
  );

  const previousAggregated = useMemo(
    () => aggregateRange(data, dateRange.prevStart, dateRange.prevEnd),
    [data, dateRange],
  );

  // Growth calculations
  const growth = useMemo(
    () => computeAllGrowth(currentAggregated, previousAggregated),
    [currentAggregated, previousAggregated],
  );

  const totalGrowth = useMemo(
    () => growth.find((g) => g.key === "totalEmployees"),
    [growth],
  );

  // ─── Chart Data ─────────────────────────────────────────────────────────

  const growthChartData = useMemo(
    (): EmployeeGrowthChartPoint[] =>
      currentFiltered.map((d) => ({
        date: d.date,
        total: d.totalEmployees,
        active: d.active,
        onboarding: d.onboarding,
        onLeave: d.onLeave,
      })),
    [currentFiltered],
  );

  const departmentChartData = useMemo(
    (): DepartmentChartPoint[] =>
      Object.entries(currentAggregated.departments).map(([name, value]) => ({
        name,
        value,
        fill: DEPT_COLORS[name] ?? "var(--chart-1)",
      })),
    [currentAggregated.departments],
  );

  const employmentTypeChartData = useMemo(
    (): EmploymentTypeChartPoint[] =>
      Object.entries(currentAggregated.employmentTypes).map(
        ([type, count]) => ({
          type,
          count,
          fill: EMP_TYPE_COLORS[type] ?? "var(--chart-1)",
        }),
      ),
    [currentAggregated.employmentTypes],
  );

  const performanceChartData = useMemo(
    (): PerformanceChartPoint[] =>
      Object.entries(currentAggregated.performance).map(([level, count]) => ({
        level,
        count,
      })),
    [currentAggregated.performance],
  );

  return {
    preset,
    setPreset,
    currentAggregated,
    growth,
    growthChartData,
    departmentChartData,
    employmentTypeChartData,
    performanceChartData,
    totalGrowth,
  };
}
