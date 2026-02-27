import React from "react";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface ActivitySkeletonProps {
  count?: number;
  className?: string;
}

function ActivitySkeletonItem({ isLast }: { isLast: boolean }) {
  return (
    <div className="relative flex gap-4" aria-hidden="true">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        <Skeleton className="z-10 mt-1.5 size-2.5 rounded-full" />
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>

      {/* Card */}
      <div className="mb-6 flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
        </div>
        <div className="pl-9">
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

function ActivitySkeleton({ count = 5, className }: ActivitySkeletonProps) {
  return (
    <div
      data-slot="activity-skeleton"
      className={cn("flex flex-col", className)}
      role="status"
      aria-label="Loading activities"
    >
      {Array.from({ length: count }, (_, i) => (
        <ActivitySkeletonItem key={i} isLast={i === count - 1} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default React.memo(ActivitySkeleton);
