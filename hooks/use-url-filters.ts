/**
 * @file use-url-filters.ts
 * @description Generic, composable nuqs hook for URL-backed filter/sort state.
 *
 * ─── Why this exists ──────────────────────────────────────────────────────────
 * nuqs gives us URL state primitives (`useQueryStates`). This hook wraps those
 * primitives into a **consistent, opinionated interface** that every feature
 * can use without re-implementing the same logic (clear, reset, hasActive, etc).
 *
 * ─── How to use it ───────────────────────────────────────────────────────────
 * 1. Define your parsers in `lib/your-feature-parsers.ts`:
 *    ```ts
 *    export const myParsers = {
 *      search: parseAsString.withDefault(""),
 *      status: parseAsString.withDefault("all"),
 *    } as const;
 *    ```
 *
 * 2. Define a defaults constant (stable module-level reference):
 *    ```ts
 *    export const MY_DEFAULTS = { search: "", status: "all" } as const;
 *    ```
 *
 * 3. Create a thin domain hook:
 *    ```ts
 *    export function useMyFilters() {
 *      return useUrlFilters(myParsers, MY_DEFAULTS);
 *    }
 *    ```
 *
 * 4. Consume it in any component:
 *    ```tsx
 *    const { params, setParams, clearParams, resetParam, hasActiveParams } =
 *      useMyFilters();
 *    ```
 *
 * ─── What you get ─────────────────────────────────────────────────────────────
 * | API              | Description                                              |
 * |------------------|----------------------------------------------------------|
 * | `params`         | All current URL param values (typed, never null)         |
 * | `setParams`      | Update one or more params — single atomic URL push       |
 * | `clearParams`    | Reset ALL params to defaults (removes them from URL)     |
 * | `resetParam(k)`  | Reset a single param `k` to its default                  |
 * | `hasActiveParams`| `true` when any param differs from its default           |
 */

"use client";

import { useCallback, useMemo } from "react";

import { useQueryStates } from "nuqs";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Nuqs parser map — any Record of nuqs parsers.
 * Kept intentionally loose so it works with all parser factory results.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParserMap = Record<string, any>;

/**
 * Extracts the resolved value type of a `useQueryStates` call.
 * `useQueryStates<P>` returns `[Values, Setter]`, so we grab index 0.
 */
type ParsedValues<TParsers extends ParserMap> = ReturnType<
  typeof useQueryStates<TParsers>
>[0];

export interface UseUrlFiltersOptions {
  /**
   * How URL changes are recorded in the browser history.
   * - `"push"` (default) — each filter change becomes a history entry
   *   (users can navigate back through filter states with the back button)
   * - `"replace"` — silently replaces the current entry (no back navigation)
   */
  history?: "push" | "replace";
  /**
   * When `false` (default) the Next.js Server Component re-renders on change,
   * which enables SSR-correct content for shareable URLs.
   * Set to `true` only if you deliberately want client-only URL updates.
   */
  shallow?: boolean;
  /** Scroll to top on URL change. Default: `false`. */
  scroll?: boolean;
  /**
   * Debounce URL writes in milliseconds.
   * Useful for high-frequency inputs (e.g. search boxes) — set to ~300ms
   * to avoid pushing a history entry on every keystroke.
   */
  throttleMs?: number;
}

export interface UseUrlFiltersReturn<TValues extends Record<string, unknown>> {
  /** All current URL param values — always typed, never null */
  params: TValues;
  /**
   * Atomically update one or more params in a single URL push.
   * Unspecified params are left unchanged.
   *
   * @example setParams({ sort: "asc", page: 1 })
   */
  setParams: (partial: Partial<TValues>) => void;
  /**
   * Reset ALL params to their defaults at once.
   * nuqs will remove default-valued params from the URL → clean link.
   */
  clearParams: () => void;
  /**
   * Reset a single param `key` to its default value.
   *
   * @example resetParam("sort")
   */
  resetParam: <K extends keyof TValues>(key: K) => void;
  /**
   * `true` when at least one param differs from its provided default.
   * Use this to drive "Clear filters" button visibility.
   */
  hasActiveParams: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Generic URL filter state hook.
 *
 * @param parsers  - nuqs parser map (from your `lib/xxx-parsers.ts`)
 * @param defaults - the default value for every key in `parsers`
 *                   **must be a stable module-level constant** to prevent
 *                   unnecessary re-renders / `useMemo` churn.
 * @param options  - optional nuqs behaviour overrides
 */
export function useUrlFilters<
  TParsers extends ParserMap,
  TValues extends Record<string, unknown> = ParsedValues<TParsers>,
>(
  parsers: TParsers,
  defaults: TValues,
  options: UseUrlFiltersOptions = {},
): UseUrlFiltersReturn<TValues> {
  const [rawValues, setQueryStates] = useQueryStates(parsers, {
    history: options.history ?? "push",
    shallow: options.shallow ?? false,
    scroll: options.scroll ?? false,
    ...(options.throttleMs !== undefined && {
      throttleMs: options.throttleMs,
    }),
  });

  // Cast to TValues — safe because `parsers` and `defaults` are co-authored
  const params = rawValues as TValues;

  /** Update one or more params atomically */
  const setParams = useCallback(
    (partial: Partial<TValues>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setQueryStates(partial as any);
    },
    [setQueryStates],
  );

  /** Reset every param to its default → nuqs strips them from the URL */
  const clearParams = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setQueryStates(defaults as any);
  }, [setQueryStates, defaults]);

  /** Reset a single param to its default */
  const resetParam = useCallback(
    <K extends keyof TValues>(key: K) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setQueryStates({ [key]: defaults[key] } as any);
    },
    [setQueryStates, defaults],
  );

  /** True when any param is not at its default value */
  const hasActiveParams = useMemo(
    () => Object.keys(defaults).some((key) => params[key] !== defaults[key]),
    [params, defaults],
  );

  return {
    params,
    setParams,
    clearParams,
    resetParam,
    hasActiveParams,
  };
}
