import { useCallback, useMemo, useState, useTransition } from "react";

import type { Activity } from "@/types/activity";

import type { ActivityFilterParams } from "@/hooks/use-activity-filters";

const PAGE_SIZE = 8;

interface UseActivityFeedOptions {
  /**
   * All filter/sort values — driven externally by `useActivityFilters`
   * (URL-backed). Keeping them as props here means the hook is purely
   * responsible for data logic, not for owning filter state.
   */
  filters: ActivityFilterParams;
}

export function useActivityFeed(
  initialActivities: () => Activity[],
  { filters }: UseActivityFeedOptions,
) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // Pagination — ephemeral (doesn't need to survive a refresh / share)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  // Detail sheet — ephemeral
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  // Filter panel open state — ephemeral UI preference
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  // ─── Derived: filtering + sorting ──────────────────────────────────────────

  const filtered = useMemo(() => {
    const { type, gender, position, q, sort } = filters;
    let result = activities;

    // 1. Filter by activity type
    if (type !== "all") {
      result = result.filter((a) => a.type === type);
    }

    // 2. Filter by gender
    if (gender !== "all") {
      result = result.filter((a) => (a.user.gender || "other") === gender);
    }

    // 3. Filter by position
    if (position !== "all") {
      result = result.filter(
        (a) => (a.user.position || "Unknown") === position,
      );
    }

    // 4. Full-text search
    if (q.trim()) {
      const lq = q.toLowerCase();
      result = result.filter(
        (a) =>
          a.user.name.toLowerCase().includes(lq) ||
          a.action.toLowerCase().includes(lq) ||
          a.entity.name.toLowerCase().includes(lq) ||
          a.description?.toLowerCase().includes(lq),
      );
    }

    // 5. Sort
    result = [...result].sort((a, b) => {
      if (sort === "desc") return b.timestamp.getTime() - a.timestamp.getTime();
      if (sort === "asc") return a.timestamp.getTime() - b.timestamp.getTime();
      if (sort === "performance") {
        return (
          (b.performance?.impactScore ?? 0) - (a.performance?.impactScore ?? 0)
        );
      }
      return 0;
    });

    return result;
  }, [filters, activities]);

  const visibleActivities = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  const selectedActivity = useMemo(
    () => activities.find((a) => a.id === selectedActivityId) ?? null,
    [activities, selectedActivityId],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleToggleFilter = useCallback(
    () => setIsFilterOpen((prev) => !prev),
    [],
  );

  /** Reset pagination when filters change */
  const resetPagination = useCallback(() => setVisibleCount(PAGE_SIZE), []);

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

  return {
    activities,
    filtered,
    visibleActivities,
    hasMore,
    isPending,
    selectedActivity,
    selectedActivityId,
    isFilterOpen,
    actions: {
      handleToggleFilter,
      resetPagination,
      handleLoadMore,
      handleOpenSheet,
      handleCloseSheet,
      handleAddComment,
    },
  };
}
