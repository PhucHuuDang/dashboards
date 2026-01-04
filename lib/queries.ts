// ./lib/queries.ts (mock version)
import type { GetTasksSchema } from "./validations";
import { MOCK_TASKS, Task } from "@/lib/tasks-seeds";
import { paginate, sortData } from "@/lib/mock-utils";

export async function getTasks(input: GetTasksSchema) {
  try {
    let data: Task[] = [...MOCK_TASKS];

    // title filter
    if (input.title) {
      data = data.filter(
        (t) =>
          t.title?.toLowerCase().includes(input.title.toLowerCase()) ?? false
      );
    }

    // status filter
    if (input.status.length) {
      data = data.filter((t) => input.status.includes(t.status));
    }

    // priority filter
    if (input.priority.length) {
      data = data.filter((t) => input.priority.includes(t.priority));
    }

    // estimatedHours range
    if (input.estimatedHours.length) {
      const [min, max] = input.estimatedHours;
      data = data.filter(
        (t) =>
          (min ? t.estimatedHours >= min : true) &&
          (max ? t.estimatedHours <= max : true)
      );
    }

    // createdAt range
    if (input.createdAt.length) {
      const [from, to] = input.createdAt;
      data = data.filter(
        (t) =>
          (from ? t.createdAt >= new Date(from) : true) &&
          (to ? t.createdAt <= new Date(to) : true)
      );
    }

    // sort
    data = sortData<Task>(
      data,
      input.sort.map((s) => ({ id: s.id as keyof Task, desc: s.desc }))
    );

    const total = data.length;
    const pageData = paginate<Task>(data, input.page, input.perPage);

    // console.log(input.perPage);

    // console.log({ total, pageData });

    return {
      data: pageData,
      pageCount: Math.ceil(total / input.perPage),
    };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getTaskStatusCounts(): Promise<
  Record<Task["status"], number>
> {
  return MOCK_TASKS.reduce(
    (acc, task) => {
      acc[task.status]++;
      return acc;
    },
    {
      todo: 0,
      "in-progress": 0,
      done: 0,
      canceled: 0,
    }
  );
}

export async function getTaskPriorityCounts() {
  return MOCK_TASKS.reduce(
    (acc, task) => {
      acc[task.priority]++;
      return acc;
    },
    {
      low: 0,
      medium: 0,
      high: 0,
    }
  );
}

export async function getEstimatedHoursRange() {
  const hours = MOCK_TASKS.map((t) => t.estimatedHours);

  return {
    min: Math.min(...hours),
    max: Math.max(...hours),
  };
}
