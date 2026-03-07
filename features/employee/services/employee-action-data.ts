import type { Employee } from "@/types/employee";

// ─── Salary History ────────────────────────────────────────────────
export interface SalaryRecord {
  id: string;
  effectiveDate: Date;
  baseSalary: number;
  bonus: number;
  equity: number;
  total: number;
  reason: string;
  approvedBy: string;
  currency: string;
}

export function generateSalaryHistory(employee: Employee): SalaryRecord[] {
  const joinYear = employee.joinDate.getFullYear();
  const currentYear = 2026;
  const records: SalaryRecord[] = [];
  let base = 55000 + Math.floor(Math.random() * 60000);

  for (let year = joinYear; year <= currentYear; year++) {
    const raise =
      year === joinYear ? 0 : Math.floor(base * (0.03 + Math.random() * 0.12));
    base += raise;
    const bonus = Math.floor(base * (0.05 + Math.random() * 0.15));
    const equity = Math.random() > 0.6 ? Math.floor(Math.random() * 20000) : 0;

    records.push({
      id: `sal_${employee.id}_${year}`,
      effectiveDate: new Date(
        year,
        year === joinYear ? employee.joinDate.getMonth() : 0,
        1,
      ),
      baseSalary: base,
      bonus,
      equity,
      total: base + bonus + equity,
      reason:
        year === joinYear
          ? "Initial offer"
          : [
              "Annual review",
              "Promotion",
              "Market adjustment",
              "Performance bonus",
            ][Math.floor(Math.random() * 4)]!,
      approvedBy: employee.reportingManager,
      currency: "USD",
    });
  }
  return records;
}

// ─── Promotion History ─────────────────────────────────────────────
export interface PromotionRecord {
  id: string;
  date: Date;
  fromRole: string;
  toRole: string;
  fromDepartment: string;
  toDepartment: string;
  salaryBefore: number;
  salaryAfter: number;
  performanceScore: number;
  recommendedBy: string;
  type: "vertical" | "lateral" | "internal-transfer";
}

const ROLE_PROGRESSION: Record<string, string[]> = {
  Engineering: [
    "Junior Engineer",
    "Software Engineer",
    "Senior Engineer",
    "Staff Engineer",
    "Tech Lead",
    "Engineering Manager",
  ],
  Design: [
    "Junior Designer",
    "UI Designer",
    "Product Designer",
    "Design Lead",
    "Design Manager",
  ],
  Marketing: [
    "Marketing Coordinator",
    "Marketing Specialist",
    "Senior Specialist",
    "Marketing Manager",
    "Growth Lead",
  ],
  Sales: [
    "Sales Rep",
    "Account Executive",
    "Senior AE",
    "Sales Manager",
    "Sales Director",
  ],
  default: [
    "Associate",
    "Specialist",
    "Senior Specialist",
    "Manager",
    "Director",
  ],
};

export function generatePromotionHistory(
  employee: Employee,
): PromotionRecord[] {
  const joinYear = employee.joinDate.getFullYear();
  const currentYear = 2026;
  const years = currentYear - joinYear;
  const promoCount = Math.min(Math.floor(years / 2), 3);
  const progression =
    ROLE_PROGRESSION[employee.department] ?? ROLE_PROGRESSION.default!;
  const records: PromotionRecord[] = [];
  let salary = 55000 + Math.floor(Math.random() * 40000);

  for (let i = 0; i < promoCount; i++) {
    const promoYear = joinYear + (i + 1) * 2;
    if (promoYear > currentYear) break;
    const fromIdx = Math.min(i, progression.length - 2);
    const toIdx = Math.min(i + 1, progression.length - 1);
    const raise = Math.floor(salary * (0.08 + Math.random() * 0.15));

    records.push({
      id: `promo_${employee.id}_${i}`,
      date: new Date(promoYear, Math.floor(Math.random() * 12), 15),
      fromRole: progression[fromIdx]!,
      toRole: progression[toIdx]!,
      fromDepartment: employee.department,
      toDepartment: employee.department,
      salaryBefore: salary,
      salaryAfter: salary + raise,
      performanceScore: 70 + Math.floor(Math.random() * 30),
      recommendedBy: employee.reportingManager,
      type: Math.random() > 0.8 ? "lateral" : "vertical",
    });
    salary += raise;
  }
  return records;
}

// ─── Attendance Records ────────────────────────────────────────────
export interface AttendanceDay {
  date: Date;
  status: "present" | "absent" | "late" | "half-day" | "remote" | "holiday";
  checkIn?: string;
  checkOut?: string;
  overtime: number;
}

export interface AttendanceSummary {
  totalWorkdays: number;
  present: number;
  absent: number;
  late: number;
  remote: number;
  overtimeHours: number;
  attendanceRate: number;
  days: AttendanceDay[];
}

export function generateAttendance(employee: Employee): AttendanceSummary {
  void employee;
  const days: AttendanceDay[] = [];
  const now = new Date(2026, 1, 28);
  const start = new Date(2026, 0, 1);

  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const r = Math.random();
    let status: AttendanceDay["status"];
    let checkIn: string | undefined;
    let checkOut: string | undefined;
    let overtime = 0;

    if (r < 0.7) {
      status = "present";
      checkIn = `08:${String(Math.floor(Math.random() * 30)).padStart(2, "0")}`;
      checkOut = `17:${String(Math.floor(Math.random() * 45)).padStart(2, "0")}`;
      overtime = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    } else if (r < 0.82) {
      status = "remote";
      checkIn = `08:${String(Math.floor(Math.random() * 45)).padStart(2, "0")}`;
      checkOut = `17:${String(30 + Math.floor(Math.random() * 30)).padStart(2, "0")}`;
    } else if (r < 0.9) {
      status = "late";
      checkIn = `09:${String(15 + Math.floor(Math.random() * 45)).padStart(2, "0")}`;
      checkOut = `17:${String(30 + Math.floor(Math.random() * 30)).padStart(2, "0")}`;
    } else if (r < 0.95) {
      status = "absent";
    } else {
      status = "half-day";
      checkIn = "08:30";
      checkOut = "13:00";
    }

    days.push({ date: new Date(d), status, checkIn, checkOut, overtime });
  }

  const present = days.filter((d) => d.status === "present").length;
  const absent = days.filter((d) => d.status === "absent").length;
  const late = days.filter((d) => d.status === "late").length;
  const remote = days.filter((d) => d.status === "remote").length;

  return {
    totalWorkdays: days.length,
    present,
    absent,
    late,
    remote,
    overtimeHours: days.reduce((sum, d) => sum + d.overtime, 0),
    attendanceRate: Math.round(((present + remote) / days.length) * 100),
    days,
  };
}

// ─── Leave Requests ────────────────────────────────────────────────
export interface LeaveRequest {
  id: string;
  type: "annual" | "sick" | "personal" | "maternity" | "bereavement";
  startDate: Date;
  endDate: Date;
  days: number;
  status: "approved" | "pending" | "rejected";
  approvedBy: string | null;
  reason: string;
}

export interface LeaveBalance {
  annual: { total: number; used: number; pending: number };
  sick: { total: number; used: number; pending: number };
  personal: { total: number; used: number; pending: number };
}

export function generateLeaveData(employee: Employee): {
  balance: LeaveBalance;
  requests: LeaveRequest[];
} {
  const balance: LeaveBalance = {
    annual: {
      total: 20,
      used: 5 + Math.floor(Math.random() * 10),
      pending: Math.floor(Math.random() * 3),
    },
    sick: { total: 10, used: Math.floor(Math.random() * 5), pending: 0 },
    personal: {
      total: 5,
      used: Math.floor(Math.random() * 3),
      pending: Math.floor(Math.random() * 2),
    },
  };

  const types: LeaveRequest["type"][] = [
    "annual",
    "sick",
    "personal",
    "annual",
    "sick",
  ];
  const statuses: LeaveRequest["status"][] = [
    "approved",
    "approved",
    "approved",
    "pending",
    "rejected",
  ];

  const requests: LeaveRequest[] = types.map((type, i) => {
    const month = Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 20);
    const duration =
      type === "sick"
        ? 1 + Math.floor(Math.random() * 3)
        : 1 + Math.floor(Math.random() * 5);
    const start = new Date(2026, month, day);
    const end = new Date(2026, month, day + duration);

    return {
      id: `leave_${employee.id}_${i}`,
      type,
      startDate: start,
      endDate: end,
      days: duration,
      status: statuses[i]!,
      approvedBy: statuses[i] === "approved" ? employee.reportingManager : null,
      reason:
        type === "sick"
          ? "Medical appointment"
          : type === "annual"
            ? "Family vacation"
            : "Personal matters",
    };
  });

  return { balance, requests };
}

// ─── Equipment Assigned ────────────────────────────────────────────
export interface EquipmentItem {
  id: string;
  type:
    | "laptop"
    | "monitor"
    | "phone"
    | "keyboard"
    | "headset"
    | "webcam"
    | "badge";
  name: string;
  serialNumber: string;
  assignedDate: Date;
  returnDate: Date | null;
  condition: "new" | "good" | "fair" | "damaged";
  value: number;
}

export function generateEquipment(employee: Employee): EquipmentItem[] {
  const items: Omit<
    EquipmentItem,
    "id" | "serialNumber" | "assignedDate" | "returnDate" | "value"
  >[] = [
    { type: "laptop", name: 'MacBook Pro 16"', condition: "good" },
    { type: "monitor", name: 'Dell UltraSharp 27"', condition: "good" },
    { type: "keyboard", name: "Logitech MX Keys", condition: "new" },
    { type: "headset", name: "Sony WH-1000XM5", condition: "good" },
    { type: "badge", name: "Building Access Card", condition: "good" },
  ];

  const count = 2 + Math.floor(Math.random() * 3);
  return items.slice(0, count).map((item, i) => ({
    ...item,
    id: `eq_${employee.id}_${i}`,
    serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    assignedDate: new Date(employee.joinDate.getTime() + i * 86400000),
    returnDate: employee.status === "resigned" ? new Date(2026, 1, 15) : null,
    value:
      item.type === "laptop"
        ? 2499
        : item.type === "monitor"
          ? 699
          : item.type === "headset"
            ? 349
            : item.type === "keyboard"
              ? 119
              : 25,
  }));
}

// ─── KPI Breakdown ─────────────────────────────────────────────────
export interface KPIMetric {
  name: string;
  weight: number;
  score: number;
  target: number;
  teamAverage: number;
}

export interface QuarterlyKPI {
  quarter: string;
  overall: number;
  metrics: KPIMetric[];
}

export function generateKPIData(employee: Employee): QuarterlyKPI[] {
  const metricTemplates: Record<string, string[]> = {
    Engineering: [
      "Code Quality",
      "Sprint Velocity",
      "Bug Resolution",
      "Documentation",
      "Code Reviews",
    ],
    Design: [
      "Design Quality",
      "Delivery Speed",
      "Stakeholder Satisfaction",
      "Design System Contribution",
      "User Research",
    ],
    Marketing: [
      "Campaign ROI",
      "Lead Generation",
      "Content Output",
      "Brand Awareness",
      "Analytics & Reporting",
    ],
    Sales: [
      "Revenue Target",
      "Pipeline Growth",
      "Client Retention",
      "Deal Close Rate",
      "CRM Compliance",
    ],
    default: [
      "Productivity",
      "Quality",
      "Collaboration",
      "Initiative",
      "Communication",
    ],
  };

  const metrics =
    metricTemplates[employee.department] ?? metricTemplates.default!;
  const quarters = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];

  return quarters.map((quarter) => {
    const kpis: KPIMetric[] = metrics.map((name, i) => {
      const weight =
        i === 0 ? 30 : i === 1 ? 25 : i === 2 ? 20 : i === 3 ? 15 : 10;
      const score = 40 + Math.floor(Math.random() * 60);
      return {
        name,
        weight,
        score,
        target: 75,
        teamAverage: 60 + Math.floor(Math.random() * 20),
      };
    });

    const overall = Math.round(
      kpis.reduce((sum, k) => sum + k.score * (k.weight / 100), 0),
    );
    return { quarter, overall, metrics: kpis };
  });
}

// ─── Skill Matrix ──────────────────────────────────────────────────
export interface SkillEntry {
  name: string;
  category: string;
  level: 1 | 2 | 3 | 4;
  targetLevel: 1 | 2 | 3 | 4;
  lastAssessed: Date;
  certified: boolean;
}

const SKILL_CATEGORIES: Record<string, Record<string, string[]>> = {
  Engineering: {
    "Programming Languages": ["TypeScript", "Python", "Go", "Rust"],
    Frameworks: ["React", "Node.js", "Next.js"],
    Infrastructure: ["AWS", "Docker", "Kubernetes"],
    "Soft Skills": ["Communication", "Mentoring", "Technical Writing"],
  },
  Design: {
    "Design Tools": ["Figma", "Sketch", "Adobe XD"],
    "UX Skills": ["User Research", "Prototyping", "Usability Testing"],
    "Visual Design": ["Typography", "Color Theory", "Layout"],
    "Soft Skills": ["Presentation", "Stakeholder Management"],
  },
  default: {
    "Core Skills": ["Problem Solving", "Analysis", "Communication"],
    Tools: ["Excel", "PowerPoint", "Jira"],
    Leadership: ["Team Management", "Decision Making"],
  },
};

export function generateSkillMatrix(employee: Employee): SkillEntry[] {
  const categories =
    SKILL_CATEGORIES[employee.department] ?? SKILL_CATEGORIES.default!;
  const skills: SkillEntry[] = [];

  for (const [category, items] of Object.entries(categories)) {
    for (const name of items) {
      const level = (1 + Math.floor(Math.random() * 4)) as 1 | 2 | 3 | 4;
      const targetLevel = Math.min(4, level + (Math.random() > 0.5 ? 1 : 0)) as
        | 1
        | 2
        | 3
        | 4;
      skills.push({
        name,
        category,
        level,
        targetLevel,
        lastAssessed: new Date(2025, 6 + Math.floor(Math.random() * 6), 1),
        certified: Math.random() > 0.6,
      });
    }
  }
  return skills;
}

// ─── Access Permissions ────────────────────────────────────────────
export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  assignedDate: Date;
  expiresAt: Date | null;
  grantedBy: string;
}

export function generatePermissions(employee: Employee): PermissionGroup[] {
  const base: PermissionGroup[] = [
    {
      id: `perm_${employee.id}_1`,
      name: "Employee Self-Service",
      description: "View own profile, payslips, and leave balance",
      permissions: [
        "profile:read",
        "payslip:read",
        "leave:request",
        "timesheet:submit",
      ],
      riskLevel: "low",
      assignedDate: employee.joinDate,
      expiresAt: null,
      grantedBy: "System",
    },
    {
      id: `perm_${employee.id}_2`,
      name: `${employee.department} Access`,
      description: `Access to ${employee.department} tools and resources`,
      permissions: ["dept:read", "dept:files", "dept:calendar"],
      riskLevel: "low",
      assignedDate: employee.joinDate,
      expiresAt: null,
      grantedBy: "HR System",
    },
  ];

  if (
    employee.role.includes("Manager") ||
    employee.role.includes("Lead") ||
    employee.role.includes("Director")
  ) {
    base.push({
      id: `perm_${employee.id}_3`,
      name: "People Management",
      description: "View direct reports, approve leaves, manage performance",
      permissions: [
        "team:read",
        "leave:approve",
        "performance:write",
        "reports:view",
      ],
      riskLevel: "medium",
      assignedDate: new Date(2024, 6, 1),
      expiresAt: null,
      grantedBy: employee.reportingManager,
    });
  }

  if (employee.department === "Engineering") {
    base.push({
      id: `perm_${employee.id}_4`,
      name: "Production Access",
      description: "Read-only access to production monitoring and logs",
      permissions: ["prod:read", "logs:read", "monitoring:view"],
      riskLevel: "high",
      assignedDate: new Date(2025, 2, 1),
      expiresAt: new Date(2026, 5, 30),
      grantedBy: "Security Team",
    });
  }

  if (employee.department === "Finance" || employee.department === "HR") {
    base.push({
      id: `perm_${employee.id}_5`,
      name: "Sensitive Data Access",
      description: "Access to employee compensation and personal data",
      permissions: ["salary:read", "pii:read", "reports:financial"],
      riskLevel: "critical",
      assignedDate: new Date(2025, 0, 15),
      expiresAt: new Date(2026, 11, 31),
      grantedBy: "CISO",
    });
  }

  return base;
}

// ─── Shared Helpers ────────────────────────────────────────────────
export const SKILL_LEVEL_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

export const RISK_LEVEL_COLORS: Record<string, string> = {
  low: "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
  medium:
    "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
  high: "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800",
  critical:
    "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
};

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
