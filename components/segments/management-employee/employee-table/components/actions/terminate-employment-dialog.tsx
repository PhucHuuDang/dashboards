"use client";

import * as React from "react";

import { AlertTriangle, CheckCircle2, Shield, Skull } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type { Employee } from "@/types/employee";

interface TerminateEmploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const CHECKLIST_ITEMS = [
  { id: "access", label: "Revoke system access & credentials" },
  { id: "equipment", label: "Equipment return verified" },
  { id: "knowledge", label: "Knowledge transfer completed" },
  { id: "exit-interview", label: "Exit interview conducted" },
  { id: "final-pay", label: "Final salary settlement calculated" },
  { id: "benefits", label: "Benefits termination processed" },
];

export function TerminateEmploymentDialog({
  open,
  onOpenChange,
  employee,
}: TerminateEmploymentDialogProps) {
  const [step, setStep] = React.useState(1);
  const [terminationType, setTerminationType] = React.useState("");
  const [lastDay, setLastDay] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [checklist, setChecklist] = React.useState<Record<string, boolean>>({});
  const [confirmText, setConfirmText] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setTerminationType("");
      setLastDay("");
      setNotes("");
      setChecklist({});
      setConfirmText("");
    }
  }, [open]);

  if (!employee) return null;

  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const allChecked = completedChecks === CHECKLIST_ITEMS.length;
  const confirmMatch =
    confirmText.toLowerCase() ===
    `${employee.firstName} ${employee.lastName}`.toLowerCase();

  function handleTerminate() {
    toast.success(
      `Termination processed for ${employee!.firstName} ${employee!.lastName}`,
    );
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Skull className="size-5" />
            Terminate Employment
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Please complete all steps carefully.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                  s === step
                    ? "bg-destructive text-destructive-foreground"
                    : s < step
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="size-3.5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-px flex-1 ${s < step ? "bg-green-500" : "bg-muted"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive shrink-0" />
                <p className="text-sm font-medium">
                  {employee.firstName} {employee.lastName} —{" "}
                  {employee.employeeCode}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {employee.role} · {employee.department} · Since{" "}
                {employee.joinDate.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Termination Type</Label>
                <Select
                  value={terminationType}
                  onValueChange={setTerminationType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resigned">Resigned</SelectItem>
                    <SelectItem value="terminated">
                      Terminated (For Cause)
                    </SelectItem>
                    <SelectItem value="layoff">Layoff / Redundancy</SelectItem>
                    <SelectItem value="contract-end">Contract End</SelectItem>
                    <SelectItem value="mutual">Mutual Separation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Last Working Day</Label>
                <Input
                  type="date"
                  value={lastDay}
                  onChange={(e) => setLastDay(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Notes / Exit Interview Summary</Label>
                <Textarea
                  placeholder="Document the reason and any exit interview notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Checklist */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Off-boarding Checklist</h4>
              <Badge variant="outline" className="text-xs">
                {completedChecks} / {CHECKLIST_ITEMS.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={checklist[item.id] ?? false}
                    onCheckedChange={(checked) =>
                      setChecklist((prev) => ({
                        ...prev,
                        [item.id]: !!checked,
                      }))
                    }
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>

            {!allChecked && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-600">
                  All items must be completed before proceeding.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-destructive" />
                <h4 className="text-sm font-medium text-destructive">
                  Final Confirmation Required
                </h4>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground">
                <p>
                  Type:{" "}
                  <span className="font-medium text-foreground capitalize">
                    {terminationType}
                  </span>
                </p>
                <p>
                  Last day:{" "}
                  <span className="font-medium text-foreground">{lastDay}</span>
                </p>
                <p>
                  Checklist:{" "}
                  <span className="font-medium text-foreground">
                    {completedChecks}/{CHECKLIST_ITEMS.length} completed
                  </span>
                </p>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label className="text-xs">
                  Type{" "}
                  <span className="font-bold">
                    {employee.firstName} {employee.lastName}
                  </span>{" "}
                  to confirm
                </Label>
                <Input
                  placeholder="Type full name..."
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="border-destructive/30"
                />
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant={step === 1 ? "default" : "default"}
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !terminationType || !lastDay : !allChecked}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleTerminate}
              disabled={!confirmMatch}
            >
              <Skull className="size-4 mr-1" />
              Confirm Termination
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
