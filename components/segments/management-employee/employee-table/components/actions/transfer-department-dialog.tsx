"use client";

import * as React from "react";

import { AlertTriangle, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEntityCache } from "@/hooks/use-entity-cache";
import { ROLES_BY_DEPARTMENT } from "@/segment-features/employee/employee-constants";

import { DEPARTMENTS, type Department, type Employee } from "@/types/employee";

interface TransferDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function TransferDepartmentDialog({
  open,
  onOpenChange,
  employee,
}: TransferDepartmentDialogProps) {
  const displayEmployee = useEntityCache(employee, open);
  const [toDept, setToDept] = React.useState<string>("");
  const [toRole, setToRole] = React.useState<string>("");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setToDept("");
      setToRole("");
      setReason("");
    }
  }, [open]);

  if (!displayEmployee) return null;

  const availableRoles = toDept
    ? (ROLES_BY_DEPARTMENT[toDept as Department] ?? [])
    : [];
  const isSameDept = toDept === displayEmployee.department;

  function handleSubmit() {
    if (!toDept || !toRole) {
      toast.error("Please select a department and role");
      return;
    }
    toast.success(
      `Transfer request submitted: ${displayEmployee!.firstName} ${displayEmployee!.lastName} → ${toDept} (${toRole})`,
    );
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:min-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Transfer Department
          </AlertDialogTitle>
          <AlertDialogDescription>
            Transfer {displayEmployee.firstName} {displayEmployee.lastName} to a
            different department. This requires HR approval.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          {/* Current → New */}
          <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-sm font-medium">
                {displayEmployee.department}
              </p>
              <p className="text-xs text-muted-foreground">
                {displayEmployee.role}
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground">New</p>
              <p className="text-sm font-medium">{toDept || "—"}</p>
              <p className="text-xs text-muted-foreground">{toRole || "—"}</p>
            </div>
          </div>

          {isSameDept && toDept && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-600">
                This is the same department. Consider a role change instead.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>New Department</Label>
              <Select
                value={toDept}
                onValueChange={(v) => {
                  setToDept(v);
                  setToRole("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>New Role</Label>
              <Select
                value={toRole}
                onValueChange={setToRole}
                disabled={!toDept}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      toDept ? "Select role" : "Select department first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Reason for Transfer</Label>
              <Textarea
                placeholder="Describe the reason for this transfer..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-1">
            <p className="text-xs font-medium">Approval Workflow</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Step 1
              </Badge>
              <span>Current Manager Approval</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Step 2
              </Badge>
              <span>New Manager Approval</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                Step 3
              </Badge>
              <span>HR Final Review</span>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={!toDept || !toRole}>
            Submit Transfer Request
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
