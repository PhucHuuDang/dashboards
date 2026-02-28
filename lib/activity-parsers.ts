/**
 * @file activity-parsers.ts
 * @description nuqs parsers for the Activities page filter & sort URL params.
 *
 * This is the **single source of truth** for every URL param used on the
 * Activities page. Import these parsers on both the server (for SSR via
 * `createSearchParamsCache`) and the client (for `useQueryStates`).
 *
 * URL Design
 * ----------
 * - All defaults are omitted from the URL (clean links when nothing is filtered).
 * - `q`        → search text          e.g. ?q=alice
 * - `type`     → activity type        e.g. ?type=task
 * - `gender`   → gender filter        e.g. ?gender=female
 * - `position` → role/position filter e.g. ?position=DevOps+Engineer
 * - `sort`     → sort order           e.g. ?sort=performance
 */

import { parseAsString, createSearchParamsCache } from "nuqs/server";

import type { ActivityType } from "@/types/activity";

// ─── Individual parsers ───────────────────────────────────────────────────────

export const activitySearchParser = parseAsString.withDefault("");

export const activityTypeParser = parseAsString.withDefault(
  "all" as ActivityType | "all",
);

export const activityGenderParser = parseAsString.withDefault("all");

export const activityPositionParser = parseAsString.withDefault("all");

export const activitySortParser = parseAsString.withDefault(
  "desc" as "desc" | "asc" | "performance",
);

// ─── Parsers map (used by useQueryStates on the client) ───────────────────────

/**
 * All activity filter parsers in a single record.
 * Pass this directly to `useQueryStates(activityParamsParsers)`.
 */
export const activityParamsParsers = {
  q: activitySearchParser,
  type: activityTypeParser,
  gender: activityGenderParser,
  position: activityPositionParser,
  sort: activitySortParser,
} as const;

// ─── Server-side cache (used by the RSC page) ────────────────────────────────

/**
 * Server-side search params cache.
 *
 * Usage in page.tsx (Server Component):
 * ```ts
 * const params = await activitySearchParamsCache.parse(searchParams);
 * ```
 * The parsed `params` object is then forwarded to the client component as
 * `initialFilters`, enabling **SSR hydration** with the correct filter values.
 */
export const activitySearchParamsCache = createSearchParamsCache(
  activityParamsParsers,
);

// ─── Derived types ────────────────────────────────────────────────────────────

/** Shape of all resolved activity filter/sort params. */
export type ActivityFilterParams = {
  q: string;
  type: ActivityType | "all";
  gender: string;
  position: string;
  sort: "desc" | "asc" | "performance";
};
