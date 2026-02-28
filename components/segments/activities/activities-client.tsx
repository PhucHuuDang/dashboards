"use client";

import React from "react";

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
import { useActivityFeed } from "./use-activity-feed";

export default function ActivitiesClient() {
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    filtered,
    visibleActivities,
    hasMore,
    isPending,
    selectedActivity,
    selectedActivityId,
    filters,
    actions,
  } = useActivityFeed(() => MOCK_ACTIVITIES);

  /* Simulate initial load */
  React.useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <ActivityHeader
        searchQuery={filters.searchQuery}
        onSearchChange={actions.handleSearchChange}
        isFilterOpen={filters.isFilterOpen}
        onToggleFilter={actions.handleToggleFilter}
      />

      <ActivityFilter
        isOpen={filters.isFilterOpen}
        activeType={filters.activeType}
        onTypeChange={actions.handleTypeChange}
        genderFilter={filters.genderFilter}
        onGenderChange={actions.setGenderFilter}
        positionFilter={filters.positionFilter}
        onPositionChange={actions.setPositionFilter}
        sortBy={filters.sortBy}
        onSortChange={actions.handleSortChange}
        onClear={actions.handleClearFilters}
      />

      {/* Feed */}
      {isLoading ? (
        <ActivitySkeleton count={5} />
      ) : visibleActivities.length === 0 ? (
        <ActivityEmptyState
          title={
            filters.searchQuery || filters.activeType !== "all"
              ? "No matching activities"
              : "No activities yet"
          }
          description={
            filters.searchQuery || filters.activeType !== "all"
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
