import { Suspense } from "react";

import { getValidFilters } from "@/lib/data-table";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FeatureFlagsProvider } from "@/components/data-table/task-table/components/feature-flags-provider";
import {
  getEmployeeDepartmentCounts,
  getEmployeeStatusCounts,
  getEmployees,
  getEmploymentTypeCounts,
  getPerformanceAtRiskCount,
  getPerformanceScoreRange,
} from "@/segment-features/employee/employee-queries";
import { employeeSearchParamsCache } from "@/segment-features/employee/employee-validations";

import { EmployeesTable } from "./components/employees-table";

import type { SearchParams } from "@/types";

interface EmployeeTableWrapperProps {
  searchParams?: Promise<SearchParams>;
}

export default function EmployeeTableWrapper(props: EmployeeTableWrapperProps) {
  return (
    <div>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={12}
            filterCount={3}
            cellWidths={[
              "2.5rem",
              "15rem",
              "7rem",
              "14rem",
              "10rem",
              "9rem",
              "9rem",
              "12rem",
              "5rem",
              "8rem",
              "8rem",
              "2.5rem",
            ]}
            shrinkZero
          />
        }
      >
        <FeatureFlagsProvider>
          <EmployeesTableContent {...props} />
        </FeatureFlagsProvider>
      </Suspense>
    </div>
  );
}

async function EmployeesTableContent(props: EmployeeTableWrapperProps) {
  const searchParams = (await props.searchParams) ?? {};
  const search = employeeSearchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getEmployees({
      ...search,
      filters: validFilters,
    }),
    getEmployeeStatusCounts(search),
    getEmployeeDepartmentCounts(search),
    getEmploymentTypeCounts(search),
    getPerformanceScoreRange(search),
    getPerformanceAtRiskCount(search),
  ]);

  return <EmployeesTable promises={promises} />;
}
