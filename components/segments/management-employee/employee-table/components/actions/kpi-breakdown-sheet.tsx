"use client";

import * as React from "react";

import { Lightbulb, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntityCache } from "@/hooks/use-entity-cache";
import { generateKPIData } from "@/segment-features/employee/employee-action-data";
import {
  getPerformanceColor,
  getPerformanceLevel,
} from "@/segment-features/employee/employee-constants";

import type { Employee } from "@/types/employee";

const trendConfig = {
  overall: { label: "Score", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const radarConfig = {
  score: { label: "Score", color: "hsl(var(--chart-1))" },
  teamAverage: { label: "Team Avg", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface KPIBreakdownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function KPIBreakdownSheet({
  open,
  onOpenChange,
  employee,
}: KPIBreakdownSheetProps) {
  const displayEmployee = useEntityCache(employee, open);

  const kpiData = React.useMemo(
    () => (displayEmployee ? generateKPIData(displayEmployee) : []),
    [displayEmployee],
  );

  if (!displayEmployee || kpiData.length === 0) return null;

  const latestQuarter = kpiData[kpiData.length - 1]!;
  const previousQuarter =
    kpiData.length > 1 ? kpiData[kpiData.length - 2] : null;
  const trend = previousQuarter
    ? latestQuarter.overall - previousQuarter.overall
    : 0;

  const trendData = kpiData.map((q) => ({
    quarter: q.quarter.replace("20", ""),
    overall: q.overall,
    target: 75,
  }));

  const radarData = latestQuarter.metrics.map((m) => ({
    metric: m.name,
    score: m.score,
    teamAverage: m.teamAverage,
  }));

  const weakMetrics = latestQuarter.metrics
    .filter((m) => m.score < m.target)
    .sort((a, b) => a.score - b.score);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:min-w-lg overflow-y-auto border mr-4 rounded-2xl overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle>KPI Breakdown</SheetTitle>
          <SheetDescription>
            {displayEmployee.firstName} {displayEmployee.lastName} — Performance
            Analytics
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Overall Score */}
          <div className="grid grid-cols-3 gap-3">
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Latest Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold tabular-nums ${getPerformanceColor(latestQuarter.overall)}`}
                >
                  {latestQuarter.overall}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getPerformanceLevel(latestQuarter.overall)}
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  QoQ Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={`size-4 ${trend >= 0 ? "text-green-500" : "text-red-500 rotate-180"}`}
                  />
                  <p
                    className={`text-2xl font-bold tabular-nums ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {trend >= 0 ? "+" : ""}
                    {trend}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Quarter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{latestQuarter.quarter}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trend">Trend</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Skills Radar — {latestQuarter.quarter}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={radarConfig}
                    className="h-[250px] w-full"
                  >
                    <RadarChart
                      data={radarData}
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                    >
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Radar
                        name="score"
                        dataKey="score"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="teamAverage"
                        dataKey="teamAverage"
                        stroke="var(--color-teamAverage)"
                        fill="var(--color-teamAverage)"
                        fillOpacity={0.1}
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    </RadarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              {weakMetrics.length > 0 && (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="size-4 text-amber-500" />
                      <CardTitle className="text-sm">
                        AI Recommendations
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {weakMetrics.slice(0, 3).map((metric) => (
                      <div
                        key={metric.name}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {metric.name}
                          </span>{" "}
                          is at {metric.score}% (target: {metric.target}%).
                          Consider focused training or pair mentoring to close
                          the gap.
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trend" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quarterly Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={trendConfig}
                    className="h-[220px] w-full"
                  >
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="quarter"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="overall"
                        stroke="var(--color-overall)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="var(--color-target)"
                        strokeWidth={1}
                        strokeDasharray="6 3"
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Metric Breakdown */}
              {latestQuarter.metrics.map((metric) => {
                const color = getPerformanceColor(metric.score);
                const gap = metric.target - metric.score;

                return (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{metric.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {metric.weight}% weight
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold tabular-nums ${color}`}>
                          {metric.score}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          / {metric.target}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full transition-all ${metric.score >= metric.target ? "bg-green-500" : metric.score >= metric.target * 0.8 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${metric.score}%` }}
                      />
                      <div
                        className="absolute h-full w-px bg-foreground/30"
                        style={{ left: `${metric.target}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Team avg: {metric.teamAverage}</span>
                      {gap > 0 && (
                        <span className="text-amber-600">Gap: {gap} pts</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
