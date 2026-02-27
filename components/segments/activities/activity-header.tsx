"use client";

import React from "react";

import { Download, Filter, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActivityHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  className?: string;
}

function ActivityHeader({
  searchQuery,
  onSearchChange,
  isFilterOpen,
  onToggleFilter,
  className,
}: ActivityHeaderProps) {
  return (
    <div
      data-slot="activity-header"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>
        <p className="text-sm text-muted-foreground">
          Track all recent activities across your workspace
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search activities…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 w-full pl-8 sm:w-56"
            aria-label="Search activities"
          />
        </div>

        <Button
          variant={isFilterOpen ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleFilter}
          aria-expanded={isFilterOpen}
          aria-label="Toggle filters"
        >
          <Filter className="size-3.5" data-icon="inline-start" />
          Filters
        </Button>

        <Button variant="outline" size="sm" aria-label="Export activities">
          <Download className="size-3.5" data-icon="inline-start" />
          Export
        </Button>
      </div>
    </div>
  );
}

export default React.memo(ActivityHeader);
