"use client";

import * as React from "react";

import { Award, GraduationCap } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

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
import {
  generateSkillMatrix,
  SKILL_LEVEL_LABELS,
} from "@/segment-features/employee/employee-action-data";

import type { Employee } from "@/types/employee";

const radarConfig = {
  current: { label: "Current Level", color: "hsl(var(--chart-1))" },
  target: { label: "Target Level", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const LEVEL_COLORS = [
  "",
  "bg-red-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-green-500",
];

interface SkillMatrixSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function SkillMatrixSheet({
  open,
  onOpenChange,
  employee,
}: SkillMatrixSheetProps) {
  const skills = React.useMemo(
    () => (employee ? generateSkillMatrix(employee) : []),
    [employee],
  );

  const categories = React.useMemo(() => {
    const map = new Map<string, typeof skills>();
    skills.forEach((s) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    });
    return Array.from(map.entries());
  }, [skills]);

  if (!employee) return null;

  const radarData = skills.slice(0, 8).map((s) => ({
    skill: s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name,
    current: s.level,
    target: s.targetLevel,
  }));

  const gapCount = skills.filter((s) => s.level < s.targetLevel).length;
  const certifiedCount = skills.filter((s) => s.certified).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Skill Matrix</SheetTitle>
          <SheetDescription>
            {employee.firstName} {employee.lastName} — {skills.length} skills
            tracked
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Total Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{skills.length}</p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Skill Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${gapCount > 0 ? "text-amber-600" : "text-green-600"}`}
                >
                  {gapCount}
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  Certified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <GraduationCap className="size-4 text-blue-500" />
                  <p className="text-2xl font-bold">{certifiedCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Skill Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={radarConfig} className="h-[250px] w-full">
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar
                    name="current"
                    dataKey="current"
                    stroke="var(--color-current)"
                    fill="var(--color-current)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="target"
                    dataKey="target"
                    stroke="var(--color-target)"
                    fill="var(--color-target)"
                    fillOpacity={0.1}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Categorized Skills */}
          {categories.map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-3">{category}</h4>
              <div className="space-y-2.5">
                {items.map((skill) => {
                  const hasGap = skill.level < skill.targetLevel;

                  return (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{skill.name}</span>
                          {skill.certified && (
                            <Award className="size-3.5 text-blue-500" />
                          )}
                          {hasGap && (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-amber-600 border-amber-200"
                            >
                              Gap
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {SKILL_LEVEL_LABELS[skill.level]}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              lvl <= skill.level
                                ? LEVEL_COLORS[skill.level]
                                : lvl <= skill.targetLevel
                                  ? "bg-muted-foreground/20 ring-1 ring-inset ring-muted-foreground/20"
                                  : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
