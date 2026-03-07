"use client";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── KPI Skeleton ────────────────────────────────────────────────────────────

export function AnalyticsKpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-1">
            <Skeleton className="h-3 w-24" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Chart Skeleton ──────────────────────────────────────────────────────────

interface AnalyticsChartSkeletonProps {
  className?: string;
  height?: number;
}

export function AnalyticsChartSkeleton({
  className,
  height = 260,
}: AnalyticsChartSkeletonProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-28" />
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <Skeleton className="w-full rounded-lg" style={{ height }} />
      </CardContent>
    </Card>
  );
}
