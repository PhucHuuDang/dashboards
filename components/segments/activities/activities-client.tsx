"use client";

import React, { useCallback, useMemo, useState, useTransition } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { MOCK_ACTIVITIES } from "@/mocks/activity-mock";

import { Button } from "@/components/ui/button";

import { ActivityDetailSheet } from "./activity-detail-sheet";
import ActivityEmptyState from "./activity-empty-state";
import ActivityFilter from "./activity-filter";
import ActivityHeader from "./activity-header";
import ActivityItem from "./activity-item";
import ActivitySkeleton from "./activity-skeleton";

import type { Activity, ActivityType as TActivityType } from "@/types/activity";

const PAGE_SIZE = 8;

export default function ActivitiesClient() {
  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeType, setActiveType] = useState<TActivityType | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  // Detail Sheet state
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  // Local state for activities to allow updating comments.
  // Using lazy initialization `() => MOCK_ACTIVITIES` per Vercel best practices
  // to avoid re-evaluating the mock array on every re-render.
  const [activities, setActivities] = useState<Activity[]>(
    () => MOCK_ACTIVITIES,
  );

  /* Simulate initial load */
  React.useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Derived                                                            */
  /* ------------------------------------------------------------------ */
  const filtered = useMemo(() => {
    let result = activities;

    if (activeType !== "all") {
      result = result.filter((a) => a.type === activeType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.user.name.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.entity.name.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeType, searchQuery, activities]);

  const visibleActivities = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                           */
  /* ------------------------------------------------------------------ */
  const handleToggleFilter = useCallback(
    () => setIsFilterOpen((prev) => !prev),
    [],
  );

  const handleTypeChange = useCallback((type: TActivityType | "all") => {
    setActiveType(type);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveType("all");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    });
  }, []);

  const handleOpenSheet = useCallback((id: string) => {
    setSelectedActivityId(id);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedActivityId(null);
  }, []);

  const handleAddComment = useCallback((activityId: string, text: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;

        return {
          ...act,
          comments: [
            ...(act.comments || []),
            {
              id: `c-${Date.now()}`,
              content: text,
              timestamp: new Date(),
              user: {
                id: "admin",
                name: "Admin User",
                email: "admin@example.com",
                avatarUrl: "",
              },
            },
          ],
        };
      }),
    );
  }, []);

  const selectedActivity = useMemo(
    () => activities.find((a) => a.id === selectedActivityId) || null,
    [activities, selectedActivityId],
  );

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <ActivityHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isFilterOpen={isFilterOpen}
        onToggleFilter={handleToggleFilter}
      />

      <ActivityFilter
        isOpen={isFilterOpen}
        activeType={activeType}
        onTypeChange={handleTypeChange}
        onClear={handleClearFilters}
      />

      {/* Feed */}
      {isLoading ? (
        <ActivitySkeleton count={5} />
      ) : visibleActivities.length === 0 ? (
        <ActivityEmptyState
          title={
            searchQuery || activeType !== "all"
              ? "No matching activities"
              : "No activities yet"
          }
          description={
            searchQuery || activeType !== "all"
              ? "Try adjusting your filters or search query."
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col">
          {visibleActivities.map((activity, idx) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              index={idx}
              isLast={idx === visibleActivities.length - 1 && !hasMore}
              onClick={handleOpenSheet}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {!isLoading && hasMore && (
        <div className="flex justify-center pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={isPending}
            className={cn("min-w-[120px]", isPending && "opacity-70")}
          >
            {isPending ? (
              <>
                <Loader2
                  className="size-3.5 animate-spin"
                  data-icon="inline-start"
                />
                Loading…
              </>
            ) : (
              `Load more (${filtered.length - visibleCount} remaining)`
            )}
          </Button>
        </div>
      )}

      {/* Detail Sheet */}
      <ActivityDetailSheet
        activity={selectedActivity}
        isOpen={!!selectedActivityId}
        onClose={handleCloseSheet}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
