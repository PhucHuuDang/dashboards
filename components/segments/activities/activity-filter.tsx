"use client";

import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ActivityType } from "@/types/activity";

const ACTIVITY_TYPE_OPTIONS: { label: string; value: ActivityType | "all" }[] =
  [
    { label: "All", value: "all" },
    { label: "Tasks", value: "task" },
    { label: "Projects", value: "project" },
    { label: "Comments", value: "comment" },
    { label: "System", value: "system" },
    { label: "Status", value: "status" },
  ];

interface ActivityFilterProps {
  isOpen: boolean;
  activeType: string;
  onTypeChange: (type: string) => void;
  genderFilter: string;
  onGenderChange: (val: string) => void;
  positionFilter: string;
  onPositionChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  /** Computed by the parent from URL state — true when any filter is non-default */
  hasActiveFilters: boolean;
  onClear: () => void;
  className?: string;
}

function ActivityFilter({
  isOpen,
  activeType,
  onTypeChange,
  genderFilter,
  onGenderChange,
  positionFilter,
  onPositionChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClear,
  className,
}: ActivityFilterProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          data-slot="activity-filter"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side: Type Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-muted-foreground">
                Type
              </span>

              {ACTIVITY_TYPE_OPTIONS.map(({ label, value }) => {
                const isActive = activeType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onTypeChange(value)}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                    aria-pressed={isActive}
                    aria-label={`Filter by ${label}`}
                  >
                    <Badge
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isActive && "shadow-sm",
                      )}
                    >
                      {label}
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Right side: Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-7 w-[120px] text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Latest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                  <SelectItem value="performance">Top Impact</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genderFilter} onValueChange={onGenderChange}>
                <SelectTrigger className="h-7 w-[110px] text-xs">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={positionFilter} onValueChange={onPositionChange}>
                <SelectTrigger className="h-7 w-[160px] text-xs">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Senior Frontend Engineer">
                    Senior Frontend
                  </SelectItem>
                  <SelectItem value="Product Manager">
                    Product Manager
                  </SelectItem>
                  <SelectItem value="UX Designer">UX Designer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps</SelectItem>
                  <SelectItem value="Backend Developer">Backend</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={onClear}
                  className="text-muted-foreground"
                  aria-label="Clear all filters"
                >
                  <X className="size-3" data-icon="inline-start" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(ActivityFilter);
