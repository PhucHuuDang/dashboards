"use client";

import * as React from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Minus,
  PalmtreeIcon,
  UserPlus,
  Users,
} from "lucide-react";

import { formatGrowthPercent, type GrowthResult } from "@/lib/analytics-utils";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Config ──────────────────────────────────────────────────────────────────

const KPI_ITEMS = [
  {
    key: "totalEmployees",
    label: "Total Employees",
    icon: Users,
    color: "text-foreground",
    trendUpColor: "text-emerald-600 dark:text-emerald-400",
    trendDownColor: "text-red-500 dark:text-red-400",
  },
  {
    key: "active",
    label: "Active",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    trendUpColor: "text-emerald-600 dark:text-emerald-400",
    trendDownColor: "text-red-500 dark:text-red-400",
  },
  {
    key: "onboarding",
    label: "Onboarding",
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    trendUpColor: "text-emerald-600 dark:text-emerald-400",
    trendDownColor: "text-red-500 dark:text-red-400",
  },
  {
    key: "onLeave",
    label: "On Leave",
    icon: PalmtreeIcon,
    color: "text-amber-600 dark:text-amber-400",
    trendUpColor: "text-amber-600 dark:text-amber-400",
    trendDownColor: "text-emerald-600 dark:text-emerald-400",
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

interface AnalyticsKpiCardsProps {
  values: Record<string, number>;
  growth: GrowthResult[];
}

export const AnalyticsKpiCards = React.memo(function AnalyticsKpiCards({
  values,
  growth,
}: AnalyticsKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {KPI_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = values[item.key] ?? 0;
        const g = growth.find((r) => r.key === item.key);

        const TrendIcon =
          g?.trend === "up"
            ? ArrowUpRight
            : g?.trend === "down"
              ? ArrowDownRight
              : Minus;

        const trendColor =
          g?.trend === "up"
            ? item.trendUpColor
            : g?.trend === "down"
              ? item.trendDownColor
              : "text-muted-foreground";

        return (
          <Card
            key={item.key}
            className="group relative overflow-hidden border transition-all duration-300 hover:shadow-sm hover:border-primary/30"
          >
            <CardHeader className="flex-row items-center justify-between pb-1">
              <CardTitle className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <div className="rounded-md p-1">
                  <Icon
                    className={cn("size-3.5", item.color)}
                    aria-hidden="true"
                  />
                </div>
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end justify-between gap-2">
                <span
                  className="text-2xl font-bold tabular-nums tracking-tight"
                  aria-label={`${item.label}: ${value}`}
                >
                  {value.toLocaleString()}
                </span>
                {g && (
                  <div
                    className={cn(
                      "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                      trendColor,
                    )}
                    aria-label={`Growth: ${formatGrowthPercent(g.growthPercent)}`}
                  >
                    <TrendIcon className="size-3" aria-hidden="true" />
                    <span>{formatGrowthPercent(g.growthPercent)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
