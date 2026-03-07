"use client";

import React from "react";

import { motion } from "framer-motion";
import {
  ClipboardList,
  FolderKanban,
  MessageSquare,
  RefreshCw,
  Server,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { Activity, ActivityStatus, ActivityType } from "@/types/activity";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  task: ClipboardList,
  project: FolderKanban,
  comment: MessageSquare,
  system: Server,
  status: RefreshCw,
};

const STATUS_COLOR: Record<ActivityStatus, string> = {
  completed: "bg-emerald-500",
  created: "bg-sky-500",
  updated: "bg-amber-500",
  deleted: "bg-rose-500",
};

const STATUS_BADGE_CLASS: Record<ActivityStatus, string> = {
  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  created:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800",
  updated:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  deleted:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
};

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ActivityItemProps {
  activity: Activity;
  isLast?: boolean;
  index?: number;
  onClick?: (id: string) => void;
}

function ActivityItem({
  activity,
  isLast = false,
  index = 0,
  onClick,
}: ActivityItemProps) {
  const Icon = TYPE_ICON[activity.type];

  return (
    <motion.div
      data-slot="activity-item"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      style={{ contentVisibility: "auto" }}
      className="group relative flex gap-4"
      role="article"
      aria-label={`${activity.user.name} ${activity.action} ${activity.entity.name}`}
    >
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <div
          className={cn(
            "z-10 mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-background",
            STATUS_COLOR[activity.status],
          )}
          aria-hidden="true"
        />
        {/* Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-border" aria-hidden="true" />
        )}
      </div>

      {/* Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(activity.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(activity.id);
          }
        }}
        className={cn(
          "mb-6 flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left",
          "shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] transition-all duration-200",
          "hover:shadow-[0_4px_12px_0_rgb(0_0_0/0.06)] hover:border-border/80 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar size="sm">
              {activity.user.avatarUrl ? (
                <AvatarImage
                  src={activity.user.avatarUrl}
                  alt={activity.user.name}
                />
              ) : null}
              <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 text-sm leading-relaxed">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <a
                href={activity.entity.href}
                className="font-medium text-primary hover:underline underline-offset-2"
              >
                {activity.entity.name}
              </a>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "hidden text-[0.65rem] capitalize sm:inline-flex",
                STATUS_BADGE_CLASS[activity.status],
              )}
            >
              {activity.status}
            </Badge>
            <Icon
              className="hidden size-3.5 text-muted-foreground sm:block"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Description */}
        {activity.description && (
          <p className="pl-9 text-xs leading-relaxed text-muted-foreground">
            {activity.description}
          </p>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 pl-9">
          <time
            dateTime={activity.timestamp.toISOString()}
            className="text-xs text-muted-foreground/70"
          >
            {formatRelativeTime(activity.timestamp)}
          </time>
          {/* Mobile badge */}
          <Badge
            variant="outline"
            className={cn(
              "text-[0.6rem] capitalize sm:hidden",
              STATUS_BADGE_CLASS[activity.status],
            )}
          >
            {activity.status}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(ActivityItem);
