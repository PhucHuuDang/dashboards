import { useCallback, useMemo, useState, useTransition } from "react";

import type { Activity, ActivityType as TActivityType } from "@/types/activity";

const PAGE_SIZE = 8;

export function useActivityFeed(initialActivities: () => Activity[]) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [activeType, setActiveType] = useState<TActivityType | "all">("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"desc" | "asc" | "performance">("desc");

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  // Detail Sheet State
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  // Derived State
  const filtered = useMemo(() => {
    let result = activities;

    // 1. Filter by activity type
    if (activeType !== "all") {
      result = result.filter((a) => a.type === activeType);
    }

    // 2. Filter by gender
    if (genderFilter !== "all") {
      result = result.filter(
        (a) => (a.user.gender || "other") === genderFilter,
      );
    }

    // 3. Filter by position
    if (positionFilter !== "all") {
      result = result.filter(
        (a) => (a.user.position || "Unknown") === positionFilter,
      );
    }

    // 4. Filter by text search
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

    // 5. Sort the results
    result = [...result].sort((a, b) => {
      if (sortBy === "desc") {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      if (sortBy === "asc") {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
      if (sortBy === "performance") {
        const scoreA = a.performance?.impactScore || 0;
        const scoreB = b.performance?.impactScore || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

    return result;
  }, [
    activeType,
    genderFilter,
    positionFilter,
    searchQuery,
    sortBy,
    activities,
  ]);

  const visibleActivities = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMore = visibleCount < filtered.length;

  const selectedActivity = useMemo(
    () => activities.find((a) => a.id === selectedActivityId) || null,
    [activities, selectedActivityId],
  );

  // Handlers
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
    setGenderFilter("all");
    setPositionFilter("all");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSortChange = useCallback((val: string) => {
    setSortBy(val as "desc" | "asc" | "performance");
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

  return {
    activities,
    filtered,
    visibleActivities,
    hasMore,
    isPending,
    selectedActivity,
    selectedActivityId,
    filters: {
      searchQuery,
      activeType,
      genderFilter,
      positionFilter,
      sortBy,
      isFilterOpen,
    },
    actions: {
      handleSearchChange,
      handleTypeChange,
      setGenderFilter,
      setPositionFilter,
      handleSortChange,
      handleClearFilters,
      handleToggleFilter,
      handleLoadMore,
      handleOpenSheet,
      handleCloseSheet,
      handleAddComment,
    },
  };
}
