/**
 * @file use-activity-filters.ts
 * @description Activity-specific URL filter hook — a thin wrapper over
 * `useUrlFilters` with the activity parsers and defaults baked in.
 *
 * Adding a new filter? Just:
 * 1. Add the parser to `lib/activity-parsers.ts`
 * 2. Add the default value to `ACTIVITY_DEFAULTS` below
 * That's it — the types propagate automatically.
 */

"use client";

import { activityParamsParsers } from "@/lib/activity-parsers";
import type { ActivityFilterParams } from "@/lib/activity-parsers";

import { useUrlFilters } from "@/hooks/use-url-filters";

import type { UseUrlFiltersReturn } from "@/hooks/use-url-filters";

// ─── Re-exports ───────────────────────────────────────────────────────────────
// So consumers only need to import from this file:
export type { ActivityFilterParams };
export type UseActivityFiltersReturn =
  UseUrlFiltersReturn<ActivityFilterParams>;

// ─── Stable defaults (module-level = stable reference = no useMemo churn) ────

const ACTIVITY_DEFAULTS: ActivityFilterParams = {
  q: "",
  type: "all",
  gender: "all",
  position: "all",
  sort: "desc",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * URL-backed filter state for the Activities page.
 *
 * Returns `{ params, setParams, clearParams, resetParam, hasActiveParams }`.
 * All state lives in the URL — shareable, bookmark-able, SSR-rendered.
 *
 * @example
 * ```tsx
 * const { params, setParams, clearParams, hasActiveParams } = useActivityFilters();
 *
 * // Update one param:
 * setParams({ type: "task" });
 *
 * // Reset a single param:
 * resetParam("sort");
 *
 * // Clear everything:
 * clearParams();
 * ```
 */
export function useActivityFilters(): UseActivityFiltersReturn {
  return useUrlFilters(activityParamsParsers, ACTIVITY_DEFAULTS, {
    history: "push",
    shallow: false,
  });
}
