"use client";

import * as React from "react";

import {
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Phone,
  CreditCard,
} from "lucide-react";

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
import {
  formatCurrency,
  generateEquipment,
} from "@/features/employee/services/employee-action-data";
import { useEntityCache } from "@/hooks/use-entity-cache";

import type { Employee } from "@/types/employee";

const DEVICE_ICONS: Record<string, typeof Laptop> = {
  laptop: Laptop,
  monitor: Monitor,
  phone: Phone,
  keyboard: Keyboard,
  headset: Headphones,
  webcam: Monitor,
  badge: CreditCard,
};

const CONDITION_COLORS: Record<string, string> = {
  new: "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950",
  good: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950",
  fair: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950",
  damaged:
    "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950",
};

interface EquipmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EquipmentSheet({
  open,
  onOpenChange,
  employee,
}: EquipmentSheetProps) {
  const displayEmployee = useEntityCache(employee, open);

  const items = React.useMemo(
    () => (displayEmployee ? generateEquipment(displayEmployee) : []),
    [displayEmployee],
  );

  if (!displayEmployee) return null;

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:min-w-lg overflow-y-auto border mr-4 rounded-2xl overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle>Equipment Assigned</SheetTitle>
          <SheetDescription>
            {displayEmployee.firstName} {displayEmployee.lastName} —{" "}
            {items.length} items ({formatCurrency(totalValue)} total value)
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-3 pb-6">
          {items.map((item) => {
            const DeviceIcon = DEVICE_ICONS[item.type] ?? Laptop;
            const conditionColor = CONDITION_COLORS[item.condition] ?? "";

            return (
              <Card key={item.id} size="sm">
                <CardContent className="pt-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2 shrink-0">
                      <DeviceIcon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-medium truncate">
                          {item.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize shrink-0 ${conditionColor}`}
                        >
                          {item.condition}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div>
                          <span className="text-muted-foreground/60">
                            S/N:{" "}
                          </span>
                          <span className="font-mono">{item.serialNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground/60">
                            Value:{" "}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground/60">
                            Assigned:{" "}
                          </span>
                          <span>
                            {formatDate(item.assignedDate, { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground/60">
                            Return:{" "}
                          </span>
                          <span>
                            {item.returnDate
                              ? formatDate(item.returnDate, { month: "short" })
                              : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
