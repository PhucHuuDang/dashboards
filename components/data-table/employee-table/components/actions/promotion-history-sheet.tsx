"use client";

import * as React from "react";

import { ArrowRight, Award, TrendingUp } from "lucide-react";

import { formatDate } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatCurrency,
  generatePromotionHistory,
} from "@/segment-features/employee/employee-action-data";

import type { Employee } from "@/types/employee";

interface PromotionHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function PromotionHistorySheet({
  open,
  onOpenChange,
  employee,
}: PromotionHistorySheetProps) {
  const records = React.useMemo(
    () => (employee ? generatePromotionHistory(employee) : []),
    [employee],
  );

  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Promotion History</SheetTitle>
          <SheetDescription>
            {employee.firstName} {employee.lastName} — Career progression
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Total Promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{records.length}</p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Current Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{employee.role}</p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          {records.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Award className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No promotions recorded yet.
              </p>
            </div>
          ) : (
            <div className="relative space-y-0">
              <h4 className="text-sm font-medium mb-4">Career Timeline</h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                {[...records].reverse().map((promo) => {
                  const salaryIncrease = promo.salaryAfter - promo.salaryBefore;
                  const salaryPct = Math.round(
                    (salaryIncrease / promo.salaryBefore) * 100,
                  );

                  return (
                    <div key={promo.id} className="relative">
                      <div className="absolute -left-6 top-1 size-[22px] rounded-full border-2 border-primary bg-background flex items-center justify-center">
                        <TrendingUp className="size-3 text-primary" />
                      </div>

                      <Card size="sm">
                        <CardContent className="pt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(promo.date, { month: "short" })}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {promo.type}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {promo.fromRole}
                            </span>
                            <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="font-medium">{promo.toRole}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">
                                Salary Impact
                              </p>
                              <p className="font-medium text-green-600">
                                +{formatCurrency(salaryIncrease)} ({salaryPct}%)
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Perf. Score
                              </p>
                              <p className="font-medium">
                                {promo.performanceScore}/100
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Recommended By
                              </p>
                              <p className="font-medium truncate">
                                {promo.recommendedBy}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}

                {/* Hire Event */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 size-[22px] rounded-full border-2 border-muted-foreground bg-background flex items-center justify-center">
                    <div className="size-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div className="py-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(employee.joinDate, { month: "short" })} —
                      Hired as {records[0]?.fromRole ?? employee.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
