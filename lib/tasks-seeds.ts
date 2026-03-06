import type { FileCellData } from "@/types/data-grid";

export interface Task {
  id: string;
  code: string;
  title: string | null;

  status: "todo" | "in-progress" | "done" | "canceled";
  priority: "low" | "medium" | "high";
  label: "bug" | "feature" | "enhancement" | "documentation";

  progress: number;
  dueDate: Date;
  assignee: {
    name: string;
    email: string;
    avatar: string;
  } | null;

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

export const MOCK_AVATARS = [
  {
    name: "Alice Smith",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/150?u=alice",
  },
  {
    name: "Bob Jones",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/150?u=bob",
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    avatar: "https://i.pravatar.cc/150?u=charlie",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    avatar: "https://i.pravatar.cc/150?u=diana",
  },
  {
    name: "Evan Wright",
    email: "evan@example.com",
    avatar: "https://i.pravatar.cc/150?u=evan",
  },
];

export const MOCK_TASKS: Task[] = Array.from({ length: 1000 }).map((_, i) => {
  const index = i + 1;

  const status =
    index % 4 === 0
      ? "done"
      : index % 4 === 1
        ? "todo"
        : index % 4 === 2
          ? "in-progress"
          : "canceled";

  let createdAt = new Date(
    new Date("2025-01-01").getTime() +
      (((index * 997) % 1000) / 1000) *
        (new Date("2026-03-06").getTime() - new Date("2025-01-01").getTime()),
  );

  // Guarantee high data density around recent days by overriding the first 150 tasks to the last 14 days
  if (index <= 150) {
    // Linear distribution over the last 14 days (14 * 24 * 60 * 60 * 1000)
    createdAt = new Date(Date.now() - (index / 150) * 1209600000);
  }

  return {
    id: `tsk_${String(index).padStart(4, "0")}`,
    code: `TASK-${String(index).padStart(4, "0")}`,
    title: `Task ${index}: Sample task title`,
    status,
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

    progress:
      status === "done"
        ? 100
        : status === "todo" || status === "canceled"
          ? 0
          : 10 + (index % 80),
    dueDate: new Date(createdAt.getTime() + ((index % 14) + 1) * 86400000),
    assignee:
      index % 7 === 0 ? null : MOCK_AVATARS[index % MOCK_AVATARS.length],

    estimatedHours: 1 + (index % 16),
    archived: index % 12 === 0,
    createdAt,
    updatedAt: new Date(
      createdAt.getTime() + (index % 5) * 86400000, // up to 5 days later
    ),
  };
});
