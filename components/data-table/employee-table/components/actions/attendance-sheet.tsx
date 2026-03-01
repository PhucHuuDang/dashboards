"use client";

import * as React from "react";

import { AlertTriangle, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
import { generateAttendance } from "@/segment-features/employee/employee-action-data";

import type { Employee } from "@/types/employee";

const chartConfig = {
  present: { label: "Present", color: "hsl(var(--chart-1))" },
  remote: { label: "Remote", color: "hsl(var(--chart-2))" },
  late: { label: "Late", color: "hsl(var(--chart-3))" },
  absent: { label: "Absent", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-500",
  remote: "bg-blue-500",
  late: "bg-amber-500",
  absent: "bg-red-500",
  "half-day": "bg-orange-400",
  holiday: "bg-gray-300 dark:bg-gray-700",
};

interface AttendanceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function AttendanceSheet({
  open,
  onOpenChange,
  employee,
}: AttendanceSheetProps) {
  const data = React.useMemo(
    () => (employee ? generateAttendance(employee) : null),
    [employee],
  );

  const weeklyData = React.useMemo(() => {
    if (!data?.days) return [];

    const weeks: Record<string, Record<string, number>> = {};

    data.days.forEach((day) => {
      const weekStart = new Date(day.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

      const key = `W${Math.ceil(
        (weekStart.getDate() + 6 - weekStart.getDay()) / 7,
      )}`;

      if (!weeks[key])
        weeks[key] = { present: 0, remote: 0, late: 0, absent: 0 };

      if (day.status === "present" || day.status === "half-day")
        weeks[key]!.present++;
      else if (day.status === "remote") weeks[key]!.remote++;
      else if (day.status === "late") weeks[key]!.late++;
      else if (day.status === "absent") weeks[key]!.absent++;
    });

    return Object.entries(weeks)
      .slice(-8)
      .map(([week, counts]) => ({ week, ...counts }));
  }, [data]);

  if (!employee || !data) return null;

  // const weeklyData = React.useMemo(() => {
  //   const weeks: Record<string, Record<string, number>> = {};
  //   data.days.forEach((day) => {
  //     const weekStart = new Date(day.date);
  //     weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  //     const key = `W${Math.ceil((weekStart.getDate() + 6 - weekStart.getDay()) / 7)}`;
  //     if (!weeks[key])
  //       weeks[key] = { present: 0, remote: 0, late: 0, absent: 0 };
  //     if (day.status === "present" || day.status === "half-day")
  //       weeks[key]!.present++;
  //     else if (day.status === "remote") weeks[key]!.remote++;
  //     else if (day.status === "late") weeks[key]!.late++;
  //     else if (day.status === "absent") weeks[key]!.absent++;
  //   });
  //   return Object.entries(weeks)
  //     .slice(-8)
  //     .map(([week, counts]) => ({ week, ...counts }));
  // }, [data.days]);

  const anomalies = data.days.filter(
    (d) => d.status === "late" || d.status === "absent",
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <SheetTitle>Attendance Records</SheetTitle>
              <SheetDescription>
                {employee.firstName} {employee.lastName} — Jan–Feb 2026
              </SheetDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-1" />
              Export
            </Button>
          </div>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Attendance Rate"
              value={`${data.attendanceRate}%`}
              highlight={data.attendanceRate < 80}
            />
            <StatCard label="Present Days" value={String(data.present)} />
            <StatCard
              label="Late Check-ins"
              value={String(data.late)}
              highlight={data.late > 5}
            />
            <StatCard label="Overtime Hours" value={`${data.overtimeHours}h`} />
          </div>

          {/* Weekly Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Weekly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="present"
                    stackId="a"
                    fill="var(--color-present)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="remote"
                    stackId="a"
                    fill="var(--color-remote)"
                  />
                  <Bar dataKey="late" stackId="a" fill="var(--color-late)" />
                  <Bar
                    dataKey="absent"
                    stackId="a"
                    fill="var(--color-absent)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Attendance Calendar Grid */}
          <div>
            <h4 className="text-sm font-medium mb-3">Daily View</h4>
            <div className="flex flex-wrap gap-1">
              {data.days.map((day, i) => (
                <div
                  key={i}
                  className={`size-6 rounded-sm ${STATUS_COLORS[day.status] ?? "bg-muted"}`}
                  title={`${day.date.toLocaleDateString()} — ${day.status}${day.checkIn ? ` (${day.checkIn})` : ""}`}
                />
              ))}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
              {Object.entries(STATUS_COLORS)
                .filter(([k]) => k !== "holiday")
                .map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div className={`size-2.5 rounded-sm ${color}`} />
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Anomalies */}
          {anomalies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="size-4 text-amber-500" />
                <h4 className="text-sm font-medium">Flagged Days</h4>
                <Badge variant="secondary" className="text-xs">
                  {anomalies.length}
                </Badge>
              </div>
              <div className="rounded-md border max-h-[200px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anomalies.slice(0, 15).map((day, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">
                          {day.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${day.status === "absent" ? "text-red-600 border-red-200" : "text-amber-600 border-amber-200"}`}
                          >
                            {day.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {day.checkIn ?? "—"}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {day.checkOut ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs text-muted-foreground font-normal">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-lg font-bold tabular-nums ${highlight ? "text-amber-600" : ""}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
