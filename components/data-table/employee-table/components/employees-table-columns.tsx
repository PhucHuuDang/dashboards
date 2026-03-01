"use client";

import * as React from "react";

import {
  Award,
  Briefcase,
  Building2,
  CalendarIcon,
  CircleDashed,
  Clock,
  Ellipsis,
  Eye,
  Gauge,
  KeyRound,
  ListTodo,
  MonitorSmartphone,
  MoveRight,
  ScrollText,
  Skull,
  Star,
  Target,
  Text,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@/lib/format";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  EMPLOYEE_STATUS_COLOR,
  getDepartmentIcon,
  getEmployeeStatusIcon,
  getEmploymentTypeIcon,
  getPerformanceBgColor,
  getPerformanceColor,
  getPerformanceLevel,
} from "@/segment-features/employee/employee-constants";

import type { DataTableRowAction } from "@/types/data-table";
import {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  type Department,
  type Employee,
  type EmployeeStatus,
  type EmploymentType,
} from "@/types/employee";

import type { ColumnDef } from "@tanstack/react-table";

interface GetEmployeesTableColumnsProps {
  statusCounts: Record<EmployeeStatus, number>;
  departmentCounts: Record<Department, number>;
  employmentTypeCounts: Record<EmploymentType, number>;
  performanceScoreRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Employee> | null>
  >;
}

export function getEmployeesTableColumns({
  statusCounts,
  departmentCounts,
  employmentTypeCounts,
  performanceScoreRange,
  setRowAction,
}: GetEmployeesTableColumnsProps): ColumnDef<Employee>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      id: "name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Employee" />
      ),
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarImage
                src={employee.avatarUrl}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback>
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="max-w-[180px] truncate font-medium">
                {employee.firstName} {employee.lastName}
              </span>
              <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                {employee.role}
              </span>
            </div>
          </div>
        );
      },
      meta: {
        label: "Name",
        placeholder: "Search by name, email, role...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
      size: 240,
    },
    {
      id: "employeeCode",
      accessorKey: "employeeCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.getValue("employeeCode")}
        </span>
      ),
      size: 110,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string>("email");
        return (
          <button
            type="button"
            className="max-w-[200px] truncate text-muted-foreground hover:text-foreground transition-colors text-left"
            onClick={() => {
              navigator.clipboard.writeText(email);
              toast.success("Email copied to clipboard");
            }}
          >
            {email}
          </button>
        );
      },
      enableSorting: false,
      size: 220,
    },
    {
      id: "department",
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Department" />
      ),
      cell: ({ cell }) => {
        const department = cell.getValue<Department>();
        const Icon = getDepartmentIcon(department);
        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span>{department}</span>
          </Badge>
        );
      },
      meta: {
        label: "Department",
        variant: "multiSelect",
        options: DEPARTMENTS.map((dept) => ({
          label: dept,
          value: dept,
          count: departmentCounts[dept],
          icon: getDepartmentIcon(dept),
        })),
        icon: Building2,
      },
      enableColumnFilter: true,
      size: 160,
    },
    {
      id: "employmentType",
      accessorKey: "employmentType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => {
        const type = cell.getValue<EmploymentType>();
        const Icon = getEmploymentTypeIcon(type);
        return (
          <Badge variant="secondary" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{type}</span>
          </Badge>
        );
      },
      meta: {
        label: "Employment Type",
        variant: "multiSelect",
        options: EMPLOYMENT_TYPES.map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
          count: employmentTypeCounts[type],
          icon: getEmploymentTypeIcon(type),
        })),
        icon: Briefcase,
      },
      enableColumnFilter: true,
      size: 140,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<EmployeeStatus>();
        const Icon = getEmployeeStatusIcon(status);
        const colorClass = EMPLOYEE_STATUS_COLOR[status];
        return (
          <Badge
            variant="outline"
            className={`py-1 [&>svg]:size-3.5 ${colorClass}`}
          >
            <Icon />
            <span className="capitalize">{status.replace("-", " ")}</span>
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: EMPLOYEE_STATUSES.map((status) => ({
          label:
            status.charAt(0).toUpperCase() + status.slice(1).replace("-", " "),
          value: status,
          count: statusCounts[status],
          icon: getEmployeeStatusIcon(status),
        })),
        icon: CircleDashed,
      },
      enableColumnFilter: true,
      size: 140,
    },
    {
      id: "performanceScore",
      accessorKey: "performanceScore",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Performance" />
      ),
      cell: ({ cell }) => {
        const score = cell.getValue<number>();
        const colorClass = getPerformanceColor(score);
        const bgClass = getPerformanceBgColor(score);
        const level = getPerformanceLevel(score);
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress
              value={score}
              className="h-1.5 w-16"
              style={
                {
                  "--progress-bg": undefined,
                } as React.CSSProperties
              }
            >
              <div
                className={`size-full flex-1 transition-all rounded-full ${bgClass}`}
                style={{ transform: `translateX(-${100 - score}%)` }}
              />
            </Progress>
            <span className={`text-xs font-medium tabular-nums ${colorClass}`}>
              {score}
            </span>
            <span className="text-[10px] text-muted-foreground">{level}</span>
          </div>
        );
      },
      meta: {
        label: "Performance",
        variant: "range",
        range: [performanceScoreRange.min, performanceScoreRange.max],
        unit: "%",
        icon: Gauge,
      },
      enableColumnFilter: true,
      size: 180,
    },
    {
      id: "currentTasks",
      accessorKey: "currentTasks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Tasks" />
      ),
      cell: ({ cell }) => {
        const tasks = cell.getValue<number>();
        return (
          <Badge variant={tasks > 8 ? "destructive" : "secondary"}>
            {tasks}
          </Badge>
        );
      },
      size: 80,
    },
    {
      id: "joinDate",
      accessorKey: "joinDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Join Date" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>(), { month: "short" }),
      meta: {
        label: "Join Date",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
      size: 130,
    },
    {
      id: "lastActivity",
      accessorKey: "lastActivity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Last Active" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>(), { month: "short" }),
      size: 130,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const act = (variant: string) =>
          setRowAction({ row, variant: variant as never });

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => act("view")}>
                <Eye className="mr-2 size-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("assign-task")}>
                <ListTodo className="mr-2 size-4" />
                Assign Task
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("kpi-breakdown")}>
                <Target className="mr-2 size-4" />
                View Performance
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                HR & Admin
              </DropdownMenuLabel>

              <DropdownMenuItem onSelect={() => act("salary-history")}>
                <ScrollText className="mr-2 size-4" />
                Salary History
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("promotion-history")}>
                <Award className="mr-2 size-4" />
                Promotion History
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("attendance")}>
                <Clock className="mr-2 size-4" />
                Attendance Records
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("leave-requests")}>
                <CalendarIcon className="mr-2 size-4" />
                Leave Requests
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("equipment")}>
                <MonitorSmartphone className="mr-2 size-4" />
                Equipment Assigned
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("kpi-breakdown")}>
                <TrendingDown className="mr-2 size-4" />
                KPI Breakdown
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("skill-matrix")}>
                <Star className="mr-2 size-4" />
                Skill Matrix
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("access-permissions")}>
                <KeyRound className="mr-2 size-4" />
                Access Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act("transfer-department")}>
                <MoveRight className="mr-2 size-4" />
                Transfer Department
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => act("terminate")}
              >
                <Skull className="mr-2 size-4" />
                Terminate Employment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
