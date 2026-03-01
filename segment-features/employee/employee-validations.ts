import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

import { flagConfig } from "@/config/flag";

import type { Employee } from "@/types/employee";
import {
  EMPLOYEE_STATUSES,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
} from "@/types/employee";

export const employeeSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Employee>().withDefault([
    { id: "joinDate", desc: true },
  ]),
  // simple filters
  name: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum([...EMPLOYEE_STATUSES])).withDefault(
    [],
  ),
  department: parseAsArrayOf(parseAsStringEnum([...DEPARTMENTS])).withDefault(
    [],
  ),
  employmentType: parseAsArrayOf(
    parseAsStringEnum([...EMPLOYMENT_TYPES]),
  ).withDefault([]),
  performanceScore: parseAsArrayOf(parseAsInteger).withDefault([]),
  joinDate: parseAsArrayOf(parseAsInteger).withDefault([]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetEmployeesSchema = Awaited<
  ReturnType<typeof employeeSearchParamsCache.parse>
>;

export const assignTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.date().optional(),
  notifyEmail: z.boolean(),
});

export type AssignTaskSchema = z.infer<typeof assignTaskSchema>;
