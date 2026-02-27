"use client";

import React from "react";

import { Activity, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ActivityEmptyStateProps {
  className?: string;
  title?: string;
  description?: string;
}

function ActivityEmptyState({
  className,
  title = "No activities yet",
  description = "Activities will appear here as your team works on tasks, projects, and more.",
}: ActivityEmptyStateProps) {
  return (
    <Empty className={cn("min-h-[320px] border border-dashed", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Activity className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" data-icon="inline-start" />
          Create first activity
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export default React.memo(ActivityEmptyState);
