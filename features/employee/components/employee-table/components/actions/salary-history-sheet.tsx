"use client";

import * as React from "react";

import { Download, Eye, EyeOff, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { formatDate } from "@/lib/format";

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
import {
  formatCurrency,
  generateSalaryHistory,
} from "@/features/employee/services/employee-action-data";
import { useEntityCache } from "@/hooks/use-entity-cache";

import type { Employee } from "@/types/employee";

const chartConfig = {
  baseSalary: { label: "Base Salary", color: "hsl(var(--chart-1))" },
  total: { label: "Total Comp", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface SalaryHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function SalaryHistorySheet({
  open,
  onOpenChange,
  employee,
}: SalaryHistorySheetProps) {
  const [masked, setMasked] = React.useState(false);
  const displayEmployee = useEntityCache(employee, open);

  const records = React.useMemo(
    () => (displayEmployee ? generateSalaryHistory(displayEmployee) : []),
    [displayEmployee],
  );

  if (!displayEmployee) return null;

  const latest = records[records.length - 1];
  const previous = records.length > 1 ? records[records.length - 2] : null;
  const growthPct = previous
    ? Math.round(
        ((latest!.baseSalary - previous.baseSalary) / previous.baseSalary) *
          100,
      )
    : 0;

  const chartData = records.map((r) => ({
    year: r.effectiveDate.getFullYear().toString(),
    baseSalary: r.baseSalary,
    total: r.total,
  }));

  const mask = (value: string) => (masked ? "••••••" : value);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:min-w-xl overflow-y-auto border mr-4 rounded-2xl overflow-hidden"
      >
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <SheetTitle>Salary History</SheetTitle>
              <SheetDescription>
                {displayEmployee.firstName} {displayEmployee.lastName} —{" "}
                {displayEmployee.employeeCode}
              </SheetDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMasked(!masked)}
              >
                {masked ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Current Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold tabular-nums">
                  {mask(formatCurrency(latest!.baseSalary))}
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Total Comp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold tabular-nums">
                  {mask(formatCurrency(latest!.total))}
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  YoY Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <TrendingUp className="size-4 text-green-500" />
                  <p className="text-lg font-bold tabular-nums text-green-600">
                    {growthPct}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salary Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Compensation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
                >
                  <defs>
                    <linearGradient id="salBase" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-baseSalary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-baseSalary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="salTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-total)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-total)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (masked ? "•••" : `${v / 1000}k`)}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          masked ? "••••••" : formatCurrency(value as number)
                        }
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="baseSalary"
                    stroke="var(--color-baseSalary)"
                    fill="url(#salBase)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-total)"
                    fill="url(#salTotal)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* History Table */}
          <div>
            <h4 className="text-sm font-medium mb-3">History</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Base</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Equity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...records].reverse().map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">
                        {formatDate(r.effectiveDate, { month: "short" })}
                      </TableCell>
                      <TableCell className="font-mono text-xs tabular-nums">
                        {mask(formatCurrency(r.baseSalary))}
                      </TableCell>
                      <TableCell className="font-mono text-xs tabular-nums">
                        {mask(formatCurrency(r.bonus))}
                      </TableCell>
                      <TableCell className="font-mono text-xs tabular-nums">
                        {r.equity > 0 ? mask(formatCurrency(r.equity)) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {r.reason}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.approvedBy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
