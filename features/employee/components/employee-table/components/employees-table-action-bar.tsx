"use client";

import * as React from "react";

import { Archive, CheckCircle2, Download, ListTodo, X } from "lucide-react";
import { toast } from "sonner";

import { exportTableToCSV } from "@/lib/export";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EMPLOYEE_STATUSES, type Employee } from "@/types/employee";

import type { Table } from "@tanstack/react-table";

interface EmployeesTableActionBarProps {
  table: Table<Employee>;
  onAssignTask?: () => void;
}

export function EmployeesTableActionBar({
  table,
  onAssignTask,
}: EmployeesTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table],
  );

  const onStatusChange = React.useCallback(
    (status: string) => {
      toast.success(
        `Status updated to "${status}" for ${rows.length} employee(s)`,
      );
    },
    [rows.length],
  );

  const onExport = React.useCallback(() => {
    exportTableToCSV(table, {
      excludeColumns: ["select", "actions"],
      onlySelected: true,
    });
  }, [table]);

  const onArchive = React.useCallback(() => {
    toast.success(`${rows.length} employee(s) archived`);
    table.toggleAllRowsSelected(false);
  }, [rows.length, table]);

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <X />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionBarItem>
              <CheckCircle2 />
              Status
            </ActionBarItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {EMPLOYEE_STATUSES.map((status) => (
              <DropdownMenuItem
                key={status}
                className="capitalize"
                onClick={() => onStatusChange(status)}
              >
                {status.replace("-", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ActionBarItem onClick={onAssignTask}>
          <ListTodo />
          Assign Task
        </ActionBarItem>
        <ActionBarItem onClick={onExport}>
          <Download />
          Export
        </ActionBarItem>
        <ActionBarItem variant="destructive" onClick={onArchive}>
          <Archive />
          Archive
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
}
