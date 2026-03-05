"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useFeatureFlags } from "@/components/data-table/task-table/components/feature-flags-provider";
import { useDataTable } from "@/hooks/use-data-table";

import {
  AccessPermissionsSheet,
  AttendanceSheet,
  EquipmentSheet,
  KPIBreakdownSheet,
  LeaveRequestsSheet,
  PromotionHistorySheet,
  SalaryHistorySheet,
  SkillMatrixSheet,
  TerminateEmploymentDialog,
  TransferDepartmentDialog,
  type EmployeeActionVariant,
} from "./actions";
import { AssignTaskDialog } from "./assign-task-dialog";
import { EmployeeProfileSheet } from "./employee-profile-sheet";
import { EmployeesStatsCards } from "./employees-stats-cards";
import { EmployeesTableActionBar } from "./employees-table-action-bar";
import { getEmployeesTableColumns } from "./employees-table-columns";
import { EmployeesTableToolbarActions } from "./employees-table-toolbar-actions";

import type { DataTableRowAction } from "@/types/data-table";
import type { Employee } from "@/types/employee";

import type {
  getEmployeeDepartmentCounts,
  getEmployeeStatusCounts,
  getEmployees,
  getEmploymentTypeCounts,
  getPerformanceAtRiskCount,
  getPerformanceScoreRange,
} from "@/segment-features/employee/employee-queries";

interface EmployeesTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getEmployees>>,
      Awaited<ReturnType<typeof getEmployeeStatusCounts>>,
      Awaited<ReturnType<typeof getEmployeeDepartmentCounts>>,
      Awaited<ReturnType<typeof getEmploymentTypeCounts>>,
      Awaited<ReturnType<typeof getPerformanceScoreRange>>,
      Awaited<ReturnType<typeof getPerformanceAtRiskCount>>,
    ]
  >;
}

export function EmployeesTable({ promises }: EmployeesTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const [
    { data, pageCount },
    statusCounts,
    departmentCounts,
    employmentTypeCounts,
    performanceScoreRange,
    atRiskCount,
  ] = React.use(promises);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Employee> | null>(null);
  const [assignTaskOpen, setAssignTaskOpen] = React.useState(false);
  const [assignTaskEmployees, setAssignTaskEmployees] = React.useState<
    Employee[]
  >([]);

  const columns = React.useMemo(
    () =>
      getEmployeesTableColumns({
        statusCounts,
        departmentCounts,
        employmentTypeCounts,
        performanceScoreRange,
        setRowAction,
      }),
    [
      statusCounts,
      departmentCounts,
      employmentTypeCounts,
      performanceScoreRange,
    ],
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "joinDate", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    scroll: true,
  });

  const actionVariant = rowAction?.variant as EmployeeActionVariant | undefined;
  const actionEmployee = rowAction?.row?.original ?? null;

  React.useEffect(() => {
    if (actionVariant === "assign-task" && actionEmployee) {
      setAssignTaskEmployees([actionEmployee]);
      setAssignTaskOpen(true);
      setRowAction(null);
    }
  }, [actionVariant, actionEmployee]);

  const clearAction = React.useCallback(() => setRowAction(null), []);

  const handleBulkAssignTask = React.useCallback(() => {
    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original);
    if (selected.length > 0) {
      setAssignTaskEmployees(selected);
      setAssignTaskOpen(true);
    }
  }, [table]);

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        table={table}
        actionBar={
          <EmployeesTableActionBar
            table={table}
            onAssignTask={handleBulkAssignTask}
          />
        }
      >
        {enableAdvancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            {filterFlag === "advancedFilters" ? (
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            ) : (
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
            )}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <EmployeesTableToolbarActions table={table} />
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}
      </DataTable>

      {/* Profile Sheet */}
      <EmployeeProfileSheet
        open={actionVariant === "view"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Assign Task Dialog */}
      <AssignTaskDialog
        open={assignTaskOpen}
        onOpenChange={setAssignTaskOpen}
        employees={assignTaskEmployees}
      />

      {/* Salary History */}
      <SalaryHistorySheet
        open={actionVariant === "salary-history"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Promotion History */}
      <PromotionHistorySheet
        open={actionVariant === "promotion-history"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Attendance Records */}
      <AttendanceSheet
        open={actionVariant === "attendance"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Leave Requests */}
      <LeaveRequestsSheet
        open={actionVariant === "leave-requests"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Equipment Assigned */}
      <EquipmentSheet
        open={actionVariant === "equipment"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* KPI Breakdown */}
      <KPIBreakdownSheet
        open={actionVariant === "kpi-breakdown"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Skill Matrix */}
      <SkillMatrixSheet
        open={actionVariant === "skill-matrix"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Access Permissions */}
      <AccessPermissionsSheet
        open={actionVariant === "access-permissions"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Transfer Department */}
      <TransferDepartmentDialog
        open={actionVariant === "transfer-department"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />

      {/* Terminate Employment */}
      <TerminateEmploymentDialog
        open={actionVariant === "terminate"}
        onOpenChange={clearAction}
        employee={actionEmployee}
      />
    </div>
  );
}
