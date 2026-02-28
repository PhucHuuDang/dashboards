"use client";

import React, { useState } from "react";

import { format } from "date-fns";
import { motion, type Variants } from "framer-motion";
import {
  ActivityIcon,
  ClockIcon,
  FileCode2Icon,
  SendIcon,
  StarIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Activity } from "@/types/activity";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  created:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800",
  updated:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  deleted:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

interface ActivityDetailSheetProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (activityId: string, text: string) => void;
}

export function ActivityDetailSheet({
  activity,
  isOpen,
  onClose,
  onAddComment,
}: ActivityDetailSheetProps) {
  const [commentText, setCommentText] = useState("");

  // Alias to activeActivity to satisfy existing JSX references
  // without needing to rewrite the entire 400-line component render block.
  const activeActivity = activity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeActivity) return;

    // Use activeActivity.id to ensure we always have an ID even if activity prop is null
    onAddComment(activeActivity.id, commentText);
    setCommentText("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md  mr-4 rounded-2xl"
      >
        {activeActivity ? (
          <>
            <SheetHeader className="border-border bg-muted/30 border-b px-6 py-5">
              <div className="flex items-center justify-between gap-4 pr-6">
                <SheetTitle className="text-foreground text-lg font-semibold tracking-tight">
                  Activity Details
                </SheetTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    STATUS_BADGE_CLASS[activeActivity.status],
                  )}
                >
                  {activeActivity.status}
                </Badge>
              </div>
              <SheetDescription className="sr-only">
                View details and comments for this activity.
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1 px-6 py-6" id="activity-sheet-scroll">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6"
              >
                {/* Main Activity Info */}
                <motion.div variants={fadeUpVariant} className="flex gap-4">
                  <Avatar className="mt-1 size-10 shadow-sm">
                    <AvatarImage
                      src={activeActivity.user.avatarUrl}
                      alt={activeActivity.user.name}
                    />
                    <AvatarFallback>
                      {getInitials(activeActivity.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground text-sm font-medium">
                        {activeActivity.user.name}
                      </p>
                      <time className="text-muted-foreground text-xs">
                        {format(activeActivity.timestamp, "MMM d, h:mm a")}
                      </time>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {activeActivity.action}{" "}
                      <a
                        href={activeActivity.entity.href}
                        className="text-primary font-medium hover:underline underline-offset-2"
                      >
                        {activeActivity.entity.name}
                      </a>
                    </p>
                  </div>
                </motion.div>

                {/* Description Block */}
                {activeActivity.description && (
                  <motion.div variants={fadeUpVariant}>
                    <div className="border-border bg-muted/50 rounded-xl border p-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {activeActivity.description}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Assignee & Tags */}
                {(activeActivity.assignee || activeActivity.tags) && (
                  <motion.div
                    variants={fadeUpVariant}
                    className="mt-2 flex flex-wrap gap-8"
                  >
                    {activeActivity.assignee && (
                      <div className="space-y-3">
                        <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                          Assignee
                        </h4>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-6 shadow-sm">
                            <AvatarImage
                              src={activeActivity.assignee.avatarUrl}
                            />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(activeActivity.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground text-sm font-medium">
                            {activeActivity.assignee.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {activeActivity.tags && activeActivity.tags.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {activeActivity.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-secondary/60 text-secondary-foreground font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Performance Insights Details */}
                {activeActivity.performance && (
                  <motion.div
                    variants={fadeUpVariant}
                    className="mt-2 space-y-3"
                  >
                    <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      Performance Insights
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {activeActivity.performance.timeToComplete && (
                        <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm">
                          <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <ClockIcon className="text-muted-foreground size-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-muted-foreground truncate text-[11px] font-medium uppercase tracking-wider">
                              Time Taken
                            </p>
                            <p className="text-foreground truncate text-sm font-semibold">
                              {activeActivity.performance.timeToComplete}
                            </p>
                          </div>
                        </div>
                      )}
                      {activeActivity.performance.impactScore !== undefined && (
                        <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm">
                          <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <ActivityIcon className="text-emerald-500 size-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-muted-foreground truncate text-[11px] font-medium uppercase tracking-wider">
                              Impact
                            </p>
                            <p className="text-foreground truncate text-sm font-semibold">
                              {activeActivity.performance.impactScore} / 100
                            </p>
                          </div>
                        </div>
                      )}
                      {activeActivity.performance.linesOfCode !== undefined && (
                        <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm">
                          <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <FileCode2Icon className="text-sky-500 size-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-muted-foreground truncate text-[11px] font-medium uppercase tracking-wider">
                              Changes
                            </p>
                            <p className="text-foreground text-sm font-semibold">
                              {activeActivity.performance.linesOfCode}{" "}
                              <span className="text-muted-foreground font-normal">
                                LOC
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                      {activeActivity.performance.rating && (
                        <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm">
                          <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
                            <StarIcon className="text-amber-500 size-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-muted-foreground truncate text-[11px] font-medium uppercase tracking-wider">
                              Rating
                            </p>
                            <p className="text-foreground capitalize truncate text-sm font-semibold">
                              {activeActivity.performance.rating}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.div variants={fadeUpVariant}>
                  <Separator className="my-2" />
                </motion.div>

                {/* Comments Section */}
                <motion.div variants={fadeUpVariant} className="space-y-6">
                  <h3 className="text-foreground text-sm font-medium">
                    Comments{" "}
                    {activeActivity.comments?.length
                      ? `(${activeActivity.comments.length})`
                      : ""}
                  </h3>

                  {activeActivity.comments &&
                  activeActivity.comments.length > 0 ? (
                    <div className="space-y-6">
                      {activeActivity.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={comment.user.avatarUrl}
                              alt={comment.user.name}
                            />
                            <AvatarFallback>
                              {getInitials(comment.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-foreground text-sm font-medium">
                                {comment.user.name}
                              </span>
                              <time className="text-muted-foreground shrink-0 text-xs">
                                {format(comment.timestamp, "MMM d, h:mm a")}
                              </time>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No comments yet. Be the first to add one.
                    </p>
                  )}
                </motion.div>
              </motion.div>
            </ScrollArea>

            {/* Comment Input Footer */}
            <div className="border-t bg-card p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!commentText.trim()}
                  className="shrink-0"
                  aria-label="Send comment"
                >
                  <SendIcon className="size-4" />
                </Button>
              </form>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
