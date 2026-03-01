"use client";

import * as React from "react";

import { Calendar, Shield, ShieldAlert } from "lucide-react";

import { formatDate } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEntityCache } from "@/hooks/use-entity-cache";
import {
  generatePermissions,
  PermissionGroup,
  RISK_LEVEL_COLORS,
} from "@/segment-features/employee/employee-action-data";

import type { Employee } from "@/types/employee";

interface AccessPermissionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function AccessPermissionsSheet({
  open,
  onOpenChange,
  employee,
}: AccessPermissionsSheetProps) {
  const displayEmployee = useEntityCache(employee, open);

  const groups = React.useMemo(
    () => (displayEmployee ? generatePermissions(displayEmployee) : []),
    [displayEmployee],
  );

  if (!displayEmployee) return null;

  const highRiskCount = groups.filter(
    (g) => g.riskLevel === "high" || g.riskLevel === "critical",
  ).length;
  const expiringCount = groups.filter((g: PermissionGroup) => {
    if (!g.expiresAt) return false;
    const daysLeft = Math.ceil(
      (g.expiresAt.getTime() - new Date().getTime()) / 86400000,
    );
    return daysLeft > 0 && daysLeft < 90;
  }).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:min-w-md overflow-y-auto border mr-4 rounded-2xl overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle>Access Permissions</SheetTitle>
          <SheetDescription>
            {displayEmployee.firstName} {displayEmployee.lastName} —{" "}
            {groups.length} permission groups
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Warnings */}
          {(highRiskCount > 0 || expiringCount > 0) && (
            <div className="space-y-2">
              {highRiskCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                  <ShieldAlert className="size-4 text-red-600 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {highRiskCount} high-risk permission group(s) assigned
                  </p>
                </div>
              )}
              {expiringCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                  <Calendar className="size-4 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {expiringCount} permission(s) expiring within 90 days
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Permission Groups */}
          <div className="space-y-3">
            {groups.map((group) => {
              const riskColor = RISK_LEVEL_COLORS[group.riskLevel] ?? "";
              const isExpiring =
                group.expiresAt &&
                Math.ceil(
                  (group.expiresAt.getTime() - new Date().getTime()) / 86400000,
                ) < 90;

              return (
                <Card key={group.id} size="sm">
                  <CardContent className="pt-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4 text-muted-foreground shrink-0" />
                        <h4 className="text-sm font-medium">{group.name}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize shrink-0 ${riskColor}`}
                      >
                        {group.riskLevel}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {group.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {group.permissions.map((perm) => (
                        <Badge
                          key={perm}
                          variant="secondary"
                          className="text-[10px] font-mono"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                      <span>Granted by {group.grantedBy}</span>
                      <div className="flex items-center gap-2">
                        <span>
                          Since{" "}
                          {formatDate(group.assignedDate, { month: "short" })}
                        </span>
                        {group.expiresAt && (
                          <span
                            className={
                              isExpiring ? "text-amber-600 font-medium" : ""
                            }
                          >
                            Exp:{" "}
                            {formatDate(group.expiresAt, { month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
