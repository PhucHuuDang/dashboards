"use client";

import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";

import { formatDate } from "@/lib/format";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EMPLOYEE_STATUS_COLOR,
  getPerformanceBgColor,
  getPerformanceColor,
  getPerformanceLevel,
} from "@/segment-features/employee/employee-constants";

import type { Employee } from "@/types/employee";

interface EmployeeProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EmployeeProfileSheet({
  open,
  onOpenChange,
  employee,
}: EmployeeProfileSheetProps) {
  if (!employee) return null;

  const statusColor = EMPLOYEE_STATUS_COLOR[employee.status];
  const perfColor = getPerformanceColor(employee.performanceScore);
  const perfBg = getPerformanceBgColor(employee.performanceScore);
  const perfLevel = getPerformanceLevel(employee.performanceScore);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-0">
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              <AvatarImage
                src={employee.avatarUrl}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback>
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <SheetTitle className="text-lg">
                {employee.firstName} {employee.lastName}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span>{employee.role}</span>
                <span className="text-muted-foreground/50">·</span>
                <span>{employee.department}</span>
              </SheetDescription>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${statusColor}`}
                >
                  {employee.status.replace("-", " ")}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {employee.employmentType}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <Tabs defaultValue="overview" className="px-4">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            {/* Contact Info */}
            <section className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contact Information
              </h4>
              <div className="space-y-2">
                <InfoRow icon={Mail} label="Email" value={employee.email} />
                <InfoRow icon={Phone} label="Phone" value={employee.phone} />
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={employee.department}
                />
                <InfoRow icon={Briefcase} label="Role" value={employee.role} />
                <InfoRow
                  icon={User}
                  label="Reporting To"
                  value={employee.reportingManager}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Join Date"
                  value={formatDate(employee.joinDate)}
                />
                <InfoRow
                  icon={FileText}
                  label="Contract"
                  value={employee.contractType}
                />
              </div>
            </section>

            {/* Performance Summary */}
            <section className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Performance
              </h4>
              <div className="flex items-center gap-3">
                <Progress
                  value={employee.performanceScore}
                  className="h-2 flex-1"
                >
                  <div
                    className={`size-full flex-1 transition-all rounded-full ${perfBg}`}
                    style={{
                      transform: `translateX(-${100 - employee.performanceScore}%)`,
                    }}
                  />
                </Progress>
                <span
                  className={`text-sm font-semibold tabular-nums ${perfColor}`}
                >
                  {employee.performanceScore}%
                </span>
                <Badge variant="outline" className="text-xs">
                  {perfLevel}
                </Badge>
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Activity
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <StatBlock
                  label="Active Tasks"
                  value={String(employee.currentTasks)}
                />
                <StatBlock
                  label="Last Active"
                  value={formatDate(employee.lastActivity, { month: "short" })}
                />
                <StatBlock label="Employee ID" value={employee.employeeCode} />
                <StatBlock
                  label="Joined"
                  value={formatDate(employee.joinDate, { month: "short" })}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <EmptyTabContent
              title="Tasks"
              description="View assigned tasks, deadlines, and completion rates."
            />
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <EmptyTabContent
              title="Performance"
              description="KPI charts, quarterly reviews, peer and manager feedback."
            />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <EmptyTabContent
              title="Documents"
              description="Employee documents, contracts, and certifications."
            />
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <EmptyTabContent
              title="Notes"
              description="Internal notes, comments, and activity log."
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function EmptyTabContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <FileText className="size-5 text-muted-foreground" />
      </div>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        {description}
      </p>
    </div>
  );
}
