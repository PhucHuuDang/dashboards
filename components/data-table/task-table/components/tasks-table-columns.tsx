"use client";

import * as React from "react";

import {
  ArrowUpDown,
  CalendarIcon,
  CircleDashed,
  Clock,
  Ellipsis,
  Text,
} from "lucide-react";

import { formatDate } from "@/lib/format";
import {
  TASK_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task-constants";
import { type Task } from "@/lib/tasks-seeds";

import { getPriorityIcon, getStatusIcon } from "@/app/lib/utils";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

import type { DataTableRowAction } from "@/types/data-table";

import type { ColumnDef } from "@tanstack/react-table";

// import { updateTask } from "../lib/actions";

interface GetTasksTableColumnsProps {
  statusCounts: Record<Task["status"], number>;
  priorityCounts: Record<Task["priority"], number>;
  estimatedHoursRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Task> | null>
  >;
}

export function getTasksTableColumns({
  statusCounts,
  priorityCounts,
  estimatedHoursRange,
  setRowAction,
}: GetTasksTableColumnsProps): ColumnDef<Task>[] {
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
      id: "code",
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Task" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("code")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Title" />
      ),
      cell: ({ row }) => {
        const label = TASK_LABELS.find((label) => label === row.original.label);

        return (
          <div className="flex items-center gap-2">
            {label && <Badge variant="outline">{label}</Badge>}
            <span className="max-w-125 truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "assignee",
      accessorKey: "assignee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Assignee" />
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignee;
        if (!assignee)
          return (
            <span className="text-muted-foreground text-sm">Unassigned</span>
          );

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{assignee.name}</span>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        // const status = tasks.status.enumValues.find(
        //   (status) => status === cell.getValue<Task["status"]>()
        // );

        const status = TASK_STATUSES.find(
          (status) => status === cell.getValue<Task["status"]>(),
        );

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{status}</span>
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: TASK_STATUSES.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status],
          icon: getStatusIcon(status),
        })),
        icon: CircleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "progress",
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Progress" />
      ),
      cell: ({ row }) => {
        const progress = row.original.progress;
        return (
          <div className="flex items-center gap-2 w-24">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground min-w-8">
              {progress}%
            </span>
          </div>
        );
      },
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Priority" />
      ),
      cell: ({ cell }) => {
        const priority = TASK_PRIORITIES.find(
          (priority) => priority === cell.getValue<Task["priority"]>(),
        );

        if (!priority) return null;

        const Icon = getPriorityIcon(priority);

        return (
          <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="capitalize">{priority}</span>
          </Badge>
        );
      },
      meta: {
        label: "Priority",
        variant: "multiSelect",
        options: TASK_PRIORITIES.map((priority) => ({
          label: priority.charAt(0).toUpperCase() + priority.slice(1),
          value: priority,
          count: priorityCounts[priority],
          icon: getPriorityIcon(priority),
        })),
        icon: ArrowUpDown,
      },
      enableColumnFilter: true,
    },
    {
      id: "estimatedHours",
      accessorKey: "estimatedHours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Est. Hours" />
      ),
      cell: ({ cell }) => {
        const estimatedHours = cell.getValue<number>();
        return <div className="w-20 text-right">{estimatedHours}</div>;
      },
      meta: {
        label: "Est. Hours",
        variant: "range",
        range: [estimatedHoursRange.min, estimatedHoursRange.max],
        unit: "hr",
        icon: Clock,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Due Date" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={() => {
                      startUpdateTransition(() => {
                        // toast.promise(
                        //   updateTask({
                        //     id: row.original.id,
                        //     label: value as Task["label"],
                        //   }),
                        //   {
                        //     loading: "Updating...",
                        //     success: "Label updated",
                        //     error: (err) => getErrorMessage(err),
                        //   }
                        // );
                      });
                    }}
                  >
                    {TASK_LABELS.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
