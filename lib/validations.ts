import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  createParser,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { type Task } from "@/lib/tasks-seeds";

import { flagConfig } from "@/config/flag";

import { TASK_LABELS, TASK_PRIORITIES, TASK_STATUSES } from "./task-constants";

import type { DateSelectorValue } from "@/components/reui/date-selector";

export const dateSelectorValueParser = createParser({
  parse(queryValue) {
    try {
      const parsed = JSON.parse(queryValue);
      if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
      if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);
      return parsed as DateSelectorValue;
    } catch {
      return null;
    }
  },
  serialize(value) {
    return JSON.stringify(value);
  },
});

export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Task>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum(TASK_STATUSES)).withDefault([]),
  priority: parseAsArrayOf(parseAsStringEnum(TASK_PRIORITIES)).withDefault([]),
  estimatedHours: parseAsArrayOf(parseAsInteger).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  dateRange: dateSelectorValueParser.withDefault(
    null as unknown as DateSelectorValue,
  ),
});

export const createTaskSchema = z.object({
  title: z.string(),
  label: z.enum(TASK_LABELS),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  estimatedHours: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.enum(TASK_LABELS).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  estimatedHours: z.number().optional(),
});

export type GetTasksSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
