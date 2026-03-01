"use client";

import * as React from "react";

import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { formatDate } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEntityCache } from "@/hooks/use-entity-cache";
import { generateLeaveData } from "@/segment-features/employee/employee-action-data";

import type { Employee } from "@/types/employee";

const STATUS_BADGE: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof CheckCircle2;
  }
> = {
  approved: { variant: "default", icon: CheckCircle2 },
  pending: { variant: "secondary", icon: Clock },
  rejected: { variant: "destructive", icon: XCircle },
};

interface LeaveRequestsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function LeaveRequestsSheet({
  open,
  onOpenChange,
  employee,
}: LeaveRequestsSheetProps) {
  const displayEmployee = useEntityCache(employee, open);

  const data = React.useMemo(
    () => (displayEmployee ? generateLeaveData(displayEmployee) : null),
    [displayEmployee],
  );

  if (!displayEmployee || !data) return null;

  const balanceItems = [
    { label: "Annual Leave", ...data.balance.annual, color: "bg-blue-500" },
    { label: "Sick Leave", ...data.balance.sick, color: "bg-amber-500" },
    {
      label: "Personal Leave",
      ...data.balance.personal,
      color: "bg-purple-500",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:min-w-lg overflow-y-auto border mr-4 rounded-2xl overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle>Leave Requests</SheetTitle>
          <SheetDescription>
            {displayEmployee.firstName} {displayEmployee.lastName} — 2026
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Leave Balance */}
          <div>
            <h4 className="text-sm font-medium mb-3">Leave Balance</h4>
            <div className="space-y-4">
              {balanceItems.map((item) => {
                const remaining = item.total - item.used - item.pending;
                const usedPct = (item.used / item.total) * 100;
                const pendingPct = (item.pending / item.total) * 100;

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">
                        {remaining} of {item.total} remaining
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`absolute h-full ${item.color} transition-all`}
                        style={{ width: `${usedPct}%` }}
                      />
                      <div
                        className={`absolute h-full ${item.color} opacity-40 transition-all`}
                        style={{ left: `${usedPct}%`, width: `${pendingPct}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Used: {item.used}d</span>
                      {item.pending > 0 && (
                        <span>Pending: {item.pending}d</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requests Table */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Requests</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.requests.map((req) => {
                    const statusConfig = STATUS_BADGE[req.status]!;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {req.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDate(req.startDate, {
                            month: "short",
                            day: "numeric",
                          })}
                          {" — "}
                          {formatDate(req.endDate, {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-xs tabular-nums font-medium">
                          {req.days}d
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusConfig.variant}
                            className="text-xs gap-1"
                          >
                            <StatusIcon className="size-3" />
                            <span className="capitalize">{req.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {req.approvedBy ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
