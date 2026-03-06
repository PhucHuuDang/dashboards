// hooks/use-dashboard-analytics.ts
import { useMemo } from "react";

import { useQueryState } from "nuqs";

import { computeGrowth, getDateRangeFromSelector } from "@/lib/analytics-utils";
import { dateSelectorValueParser } from "@/lib/validations";

import {
  DASHBOARD_ANALYTICS_DATA,
  DailyDashboardData,
} from "@/mocks/mock-dashboard-analytics";

export interface DashboardMetric {
  value: number;
  growth: number;
  trend: "up" | "down" | "neutral";
}

function aggregateDashboard(
  data: DailyDashboardData[],
  start: Date,
  end: Date,
) {
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  const filtered = data.filter((d) => d.date >= startStr && d.date <= endStr);

  if (filtered.length === 0) {
    const last = data[data.length - 1];
    return {
      users: last?.visitors.total ?? 0,
      orders: last?.orders ?? 0,
      products: last?.products ?? 0,
      revenue: last?.revenue ?? 0,
    };
  }

  const latest = filtered[filtered.length - 1];
  let orders = 0;
  let revenue = 0;

  for (const day of filtered) {
    orders += day.orders;
    revenue += day.revenue;
  }

  return {
    users: latest.visitors.total,
    orders,
    products: latest.products,
    revenue,
  };
}

export function useDashboardAnalytics() {
  const [dateRange] = useQueryState("dateRange", dateSelectorValueParser);

  return useMemo(() => {
    const { start, end, prevStart, prevEnd, days } =
      getDateRangeFromSelector(dateRange);

    const currentAgg = aggregateDashboard(DASHBOARD_ANALYTICS_DATA, start, end);
    const prevAgg = aggregateDashboard(
      DASHBOARD_ANALYTICS_DATA,
      prevStart,
      prevEnd,
    );

    return {
      dateRange: { start, end, days },
      metrics: {
        users: computeGrowth(currentAgg.users, prevAgg.users, "users"),
        orders: computeGrowth(currentAgg.orders, prevAgg.orders, "orders"),
        products: computeGrowth(
          currentAgg.products,
          prevAgg.products,
          "products",
        ),
        revenue: computeGrowth(currentAgg.revenue, prevAgg.revenue, "revenue"),
      },
      timeseries: DASHBOARD_ANALYTICS_DATA.filter((d) => {
        return (
          d.date >= start.toISOString().slice(0, 10) &&
          d.date <= end.toISOString().slice(0, 10)
        );
      }),
    };
  }, [dateRange]);
}
