import { Suspense } from "react";

// import { Shell } from "@/components/shell";
import { getValidFilters } from "@/lib/data-table";
import {
  getEstimatedHoursRange,
  getTaskPriorityCounts,
  getTaskStatusCounts,
  getTasks,
} from "@/lib/queries";
import { searchParamsCache } from "@/lib/validations";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KanbanColumnHandle } from "@/components/ui/kanban";
import { Shell } from "@/components/ui/shell";

import { FeatureFlagsProvider } from "./components/feature-flags-provider";
import { TasksTable } from "./components/tasks-table";

import type { SearchParams } from "@/types";

interface TaskTableWrapperProps {
  searchParams?: Promise<SearchParams>;
}

export default function TaskTableWrapper(props: TaskTableWrapperProps) {
  return (
    <Shell variant="sidebar">
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }
      >
        <FeatureFlagsProvider>
          <KanbanColumnHandle
            className={`transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl w-full min-w-full`}
          >
            <TasksTableWrapper {...props} />
          </KanbanColumnHandle>
        </FeatureFlagsProvider>
      </Suspense>
    </Shell>
  );
}

async function TasksTableWrapper(props: TaskTableWrapperProps) {
  const searchParams = (await props.searchParams) ?? {};
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  // console.log({ validFilters });

  const promises = Promise.all([
    getTasks({
      ...search,
      filters: validFilters,
    }),
    getTaskStatusCounts(),
    getTaskPriorityCounts(),
    getEstimatedHoursRange(),
  ]);

  return <TasksTable promises={promises} />;
}
