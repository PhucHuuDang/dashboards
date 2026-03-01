"use client";

import {
  AlertTriangle,
  CheckCircle2,
  PalmtreeIcon,
  UserPlus,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { EmployeeStatus } from "@/types/employee";

interface EmployeesStatsCardsProps {
  statusCounts: Record<EmployeeStatus, number>;
  atRiskCount: number;
}

const stats = [
  {
    key: "total" as const,
    label: "Total Employees",
    icon: Users,
    color: "text-foreground",
    bg: "bg-muted",
  },
  {
    key: "active" as const,
    label: "Active",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  {
    key: "onboarding" as const,
    label: "Onboarding",
    icon: UserPlus,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    key: "on-leave" as const,
    label: "On Leave",
    icon: PalmtreeIcon,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
  },
  {
    key: "atRisk" as const,
    label: "Performance At Risk",
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
  },
];

export function EmployeesStatsCards({
  statusCounts,
  atRiskCount,
}: EmployeesStatsCardsProps) {
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  function getValue(key: string) {
    if (key === "total") return total;
    if (key === "atRisk") return atRiskCount;
    return statusCounts[key as EmployeeStatus] ?? 0;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = getValue(stat.key);

        return (
          <Card
            key={stat.key}
            size="sm"
            className="hover:border-primary border transition-all duration-300 mb-2 hover:shadow-sm"
          >
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                <div className={`rounded-md p-1.5 `}>
                  <Icon className={`size-4 ${stat.color}`} />
                </div>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
