// lib/analytics-utils.ts
// Pure utility functions for the Employee Analytics Dashboard.
// No React imports — safe to use anywhere.

import type { DailyEmployeeData } from "@/mocks/mock-employee-analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateRangePreset = "today" | "3d" | "7d" | "14d" | "30d";

export interface DateRange {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  days: number;
}

export type GrowthTrend = "up" | "down" | "neutral";

export interface GrowthResult {
  key: string;
  value: number;
  previousValue: number;
  growthPercent: number;
  trend: GrowthTrend;
}

export interface AggregatedAnalytics {
  totalEmployees: number;
  active: number;
  onboarding: number;
  onLeave: number;
  departments: Record<string, number>;
  employmentTypes: Record<string, number>;
  performance: Record<string, number>;
}

import type { DateSelectorValue } from "@/components/reui/date-selector";

// ─── Date Range ───────────────────────────────────────────────────────────────

/** Compute current and previous date ranges for comparison from DateSelectorValue. */
export function getDateRangeFromSelector(
  value: DateSelectorValue | null,
): DateRange {
  let start = new Date();
  start.setHours(0, 0, 0, 0);
  let end = new Date(start);

  if (value?.startDate) {
    start = new Date(value.startDate);
    start.setHours(0, 0, 0, 0);
    if (value.endDate) {
      end = new Date(value.endDate);
      end.setHours(0, 0, 0, 0);
    } else {
      end = new Date(start);
    }
  } else {
    // Default to last 30 days if no valid date is provided
    start.setDate(start.getDate() - 29);
  }

  // Ensure start is before end
  if (start.getTime() > end.getTime()) {
    const temp = start;
    start = end;
    end = temp;
  }

  // Calculate difference in days (inclusive)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Previous period
  const prevEnd = new Date(start);
  prevEnd.setDate(start.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - (days - 1));

  return { start, end, prevStart, prevEnd, days };
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

/** Average the daily data within a date range. */
export function aggregateRange(
  data: DailyEmployeeData[],
  start: Date,
  end: Date,
): AggregatedAnalytics {
  const startStr = toDateStr(start);
  const endStr = toDateStr(end);

  const filtered = data.filter((d) => d.date >= startStr && d.date <= endStr);

  if (filtered.length === 0) {
    // Fallback to last available entry to avoid NaN
    const last = data[data.length - 1];
    return {
      totalEmployees: last?.totalEmployees ?? 0,
      active: last?.active ?? 0,
      onboarding: last?.onboarding ?? 0,
      onLeave: last?.onLeave ?? 0,
      departments: last?.departments ?? {},
      employmentTypes: last?.employmentTypes ?? {},
      performance: last?.performance ?? {},
    };
  }

  // Use the last day's snapshot for point-in-time values (total, active, etc.)
  const latest = filtered[filtered.length - 1];

  // Average the distribution data
  const departments: Record<string, number> = {};
  const employmentTypes: Record<string, number> = {};
  const performance: Record<string, number> = {};

  for (const day of filtered) {
    for (const [k, v] of Object.entries(day.departments)) {
      departments[k] = (departments[k] ?? 0) + v;
    }
    for (const [k, v] of Object.entries(day.employmentTypes)) {
      employmentTypes[k] = (employmentTypes[k] ?? 0) + v;
    }
    for (const [k, v] of Object.entries(day.performance)) {
      performance[k] = (performance[k] ?? 0) + v;
    }
  }

  const n = filtered.length;
  for (const k in departments) departments[k] = Math.round(departments[k] / n);
  for (const k in employmentTypes)
    employmentTypes[k] = Math.round(employmentTypes[k] / n);
  for (const k in performance) performance[k] = Math.round(performance[k] / n);

  return {
    totalEmployees: latest.totalEmployees,
    active: latest.active,
    onboarding: latest.onboarding,
    onLeave: latest.onLeave,
    departments,
    employmentTypes,
    performance,
  };
}

// ─── Growth Calculation ───────────────────────────────────────────────────────

export function computeGrowth(
  currentValue: number,
  previousValue: number,
  key: string,
): GrowthResult {
  if (previousValue === 0) {
    return {
      key,
      value: currentValue,
      previousValue: 0,
      growthPercent: currentValue > 0 ? 100 : 0,
      trend: currentValue > 0 ? "up" : "neutral",
    };
  }

  const growthPercent = ((currentValue - previousValue) / previousValue) * 100;

  let trend: GrowthTrend = "neutral";
  if (growthPercent > 1) trend = "up";
  else if (growthPercent < -1) trend = "down";

  return {
    key,
    value: currentValue,
    previousValue,
    growthPercent: Math.round(growthPercent * 10) / 10,
    trend,
  };
}

export function computeAllGrowth(
  current: AggregatedAnalytics,
  previous: AggregatedAnalytics,
): GrowthResult[] {
  return [
    computeGrowth(
      current.totalEmployees,
      previous.totalEmployees,
      "totalEmployees",
    ),
    computeGrowth(current.active, previous.active, "active"),
    computeGrowth(current.onboarding, previous.onboarding, "onboarding"),
    computeGrowth(current.onLeave, previous.onLeave, "onLeave"),
  ];
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatGrowthPercent(n: number): string {
  if (Math.abs(n) < 1) return "~0%";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Filter raw daily data for a date range (inclusive). */
export function filterDataByRange(
  data: DailyEmployeeData[],
  start: Date,
  end: Date,
): DailyEmployeeData[] {
  const startStr = toDateStr(start);
  const endStr = toDateStr(end);
  return data.filter((d) => d.date >= startStr && d.date <= endStr);
}
