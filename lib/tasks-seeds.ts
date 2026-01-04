import type { FileCellData } from "@/types/data-grid";

export interface Task {
  id: string;
  code: string;
  title: string | null;

  status: "todo" | "in-progress" | "done" | "canceled";
  priority: "low" | "medium" | "high";
  label: "bug" | "feature" | "enhancement" | "documentation";

  estimatedHours: number;
  archived: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewTask {
  code: string;
  title?: string | null;

  status?: Task["status"];
  priority?: Task["priority"];
  label?: Task["label"];

  estimatedHours?: number;
  archived?: boolean;
}

export interface Skater {
  id: string;
  order: number;

  name: string | null;
  email: string | null;

  stance: "regular" | "goofy";
  style: "street" | "vert" | "park" | "freestyle" | "all-around";
  status: "amateur" | "sponsored" | "pro" | "legend";

  yearsSkating: number;
  startedSkating: Date | null;

  isPro: boolean;
  tricks?: string[];
  media?: FileCellData[];

  createdAt: Date;
  updatedAt: Date;
}

export const MOCK_SKATERS: Skater[] = [
  {
    id: "sk_001",
    order: 1,
    name: "Tony Hawk",
    email: "tony@skate.com",
    stance: "regular",
    style: "vert",
    status: "legend",
    yearsSkating: 40,
    startedSkating: new Date("1980-01-01"),
    isPro: true,
    tricks: ["900", "Kickflip"],
    media: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const MOCK_TASKS: Task[] = Array.from({ length: 100 }).map((_, i) => {
  const index = i + 1;

  return {
    id: `tsk_${String(index).padStart(3, "0")}`,
    code: `TASK-${String(index).padStart(3, "0")}`,
    title: `Task ${index}: Sample task title`,
    status:
      index % 4 === 0
        ? "done"
        : index % 4 === 1
        ? "todo"
        : index % 4 === 2
        ? "in-progress"
        : "canceled",
    priority: index % 3 === 0 ? "high" : index % 3 === 1 ? "medium" : "low",
    label:
      index % 5 === 0
        ? "bug"
        : index % 5 === 1
        ? "feature"
        : index % 5 === 2
        ? "enhancement"
        : index % 5 === 3
        ? "documentation"
        : "bug",
    estimatedHours: 1 + (index % 16),
    archived: index % 12 === 0,
    createdAt: new Date(2025, index % 12, 1 + (index % 27)),
    updatedAt: new Date(2025, index % 12, 5 + (index % 23)),
  };
});
