"use client";

import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  activeType: ActivityType | "all";
  onTypeChange: (type: ActivityType | "all") => void;
  onClear: () => void;
  className?: string;
}

function ActivityFilter({
  isOpen,
  activeType,
  onTypeChange,
  onClear,
  className,
}: ActivityFilterProps) {
  const hasActiveFilter = activeType !== "all";

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
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
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

            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClear}
                className="ml-auto text-muted-foreground"
                aria-label="Clear all filters"
              >
                <X className="size-3" data-icon="inline-start" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(ActivityFilter);
