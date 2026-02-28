"use client";

import React from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { MOCK_ACTIVITIES } from "@/mocks/activity-mock";

import { Button } from "@/components/ui/button";
import { useActivityFilters } from "@/hooks/use-activity-filters";

import { ActivityDetailSheet } from "./activity-detail-sheet";
import ActivityEmptyState from "./activity-empty-state";
import ActivityFilter from "./activity-filter";
import ActivityHeader from "./activity-header";
import ActivityItem from "./activity-item";
import ActivitySkeleton from "./activity-skeleton";
import { useActivityFeed } from "./use-activity-feed";

import type { ActivityFilterParams } from "@/hooks/use-activity-filters";

interface ActivitiesClientProps {
  /**
   * Server-parsed initial filter values (from `activitySearchParamsCache`).
   * Passed down from the RSC page so nuqs can hydrate in-sync with the
   * server-rendered HTML — no flash of unfiltered content.
   */
  initialFilters: ActivityFilterParams;
}

export default function ActivitiesClient({
  initialFilters: _initialFilters,
}: ActivitiesClientProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  // ── URL-backed filter state (generic hook) ───────────────────────────────
  const { params, setParams, clearParams, hasActiveParams } =
    useActivityFilters();

  // ── Data + derived state (receives filters as props) ─────────────────────
  const {
    filtered,
    visibleActivities,
    hasMore,
    isPending,
    selectedActivity,
    selectedActivityId,
    isFilterOpen,
    actions,
  } = useActivityFeed(() => MOCK_ACTIVITIES, { filters: params });

  /* Simulate initial data load */
  React.useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, []);

  // Convenience wrappers: update URL param + reset pagination together
  const handleSearchChange = React.useCallback(
    (value: string) => {
      setParams({ q: value });
      actions.resetPagination();
    },
    [setParams, actions],
  );

  const handleTypeChange = React.useCallback(
    (type: string) => {
      setParams({ type: type as ActivityFilterParams["type"] });
      actions.resetPagination();
    },
    [setParams, actions],
  );

  const handleGenderChange = React.useCallback(
    (gender: string) => {
      setParams({ gender });
      actions.resetPagination();
    },
    [setParams, actions],
  );

  const handlePositionChange = React.useCallback(
    (position: string) => {
      setParams({ position });
      actions.resetPagination();
    },
    [setParams, actions],
  );

  const handleSortChange = React.useCallback(
    (sort: string) => {
      setParams({ sort: sort as ActivityFilterParams["sort"] });
    },
    [setParams],
  );

  const handleClearFilters = React.useCallback(() => {
    clearParams();
    actions.resetPagination();
  }, [clearParams, actions]);

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <ActivityHeader
        searchQuery={params.q}
        onSearchChange={handleSearchChange}
        isFilterOpen={isFilterOpen}
        onToggleFilter={actions.handleToggleFilter}
      />

      <ActivityFilter
        isOpen={isFilterOpen}
        activeType={params.type}
        onTypeChange={handleTypeChange}
        genderFilter={params.gender}
        onGenderChange={handleGenderChange}
        positionFilter={params.position}
        onPositionChange={handlePositionChange}
        sortBy={params.sort}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveParams}
        onClear={handleClearFilters}
      />

      {/* Feed */}
      {isLoading ? (
        <ActivitySkeleton count={5} />
      ) : visibleActivities.length === 0 ? (
        <ActivityEmptyState
          title={
            params.q || params.type !== "all"
              ? "No matching activities"
              : "No activities yet"
          }
          description={
            params.q || params.type !== "all"
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
              onClick={actions.handleOpenSheet}
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
            onClick={actions.handleLoadMore}
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
              `Load more (${filtered.length - visibleActivities.length} remaining)`
            )}
          </Button>
        </div>
      )}

      {/* Detail Sheet */}
      <ActivityDetailSheet
        activity={selectedActivity}
        isOpen={!!selectedActivityId}
        onClose={actions.handleCloseSheet}
        onAddComment={actions.handleAddComment}
      />
    </div>
  );
}
