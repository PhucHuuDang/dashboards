// @/lib/task-constants.ts
import type { Task } from "@/lib/tasks-seeds";

export const TASK_STATUSES: Task["status"][] = [
  "todo",
  "in-progress",
  "done",
  "canceled",
];

export const TASK_PRIORITIES: Task["priority"][] = ["low", "medium", "high"];

export const TASK_LABELS: Task["label"][] = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
];
