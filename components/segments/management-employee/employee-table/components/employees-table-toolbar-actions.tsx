"use client";

import { Download, Plus } from "lucide-react";

import { exportTableToCSV } from "@/lib/export";

import { Button } from "@/components/ui/button";

import type { Employee } from "@/types/employee";

import type { Table } from "@tanstack/react-table";

interface EmployeesTableToolbarActionsProps {
  table: Table<Employee>;
}

export function EmployeesTableToolbarActions({
  table,
}: EmployeesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm">
        <Plus />
        Add Employee
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "employees",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
    </div>
  );
}
