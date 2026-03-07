import {
  Briefcase,
  CheckCircle2,
  Clock,
  Code,
  DollarSign,
  Gavel,
  Megaphone,
  Palette,
  PalmtreeIcon,
  Settings,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

import type {
  EmployeeStatus,
  Department,
  EmploymentType,
} from "@/types/employee";

// ────────────────────────────────────────────
// Status icon mapping
// ────────────────────────────────────────────
export function getEmployeeStatusIcon(status: EmployeeStatus) {
  const map: Record<EmployeeStatus, typeof CheckCircle2> = {
    active: CheckCircle2,
    onboarding: UserPlus,
    "on-leave": PalmtreeIcon,
    resigned: UserMinus,
  };
  return map[status] ?? Users;
}

export const EMPLOYEE_STATUS_COLOR: Record<EmployeeStatus, string> = {
  active:
    "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
  onboarding:
    "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
  "on-leave":
    "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
  resigned:
    "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
};

// ────────────────────────────────────────────
// Department icon mapping
// ────────────────────────────────────────────
export function getDepartmentIcon(department: Department) {
  const map: Record<Department, typeof Code> = {
    Engineering: Code,
    Design: Palette,
    Marketing: Megaphone,
    Sales: TrendingUp,
    HR: Users,
    Finance: DollarSign,
    Operations: Settings,
    Legal: Gavel,
  };
  return map[department] ?? Briefcase;
}

// ────────────────────────────────────────────
// Employment type icon mapping
// ────────────────────────────────────────────
export function getEmploymentTypeIcon(type: EmploymentType) {
  const map: Record<EmploymentType, typeof UserCheck> = {
    "full-time": UserCheck,
    "part-time": Clock,
    contract: Briefcase,
  };
  return map[type] ?? UserCheck;
}

// ────────────────────────────────────────────
// Performance score helpers
// ────────────────────────────────────────────
export function getPerformanceColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function getPerformanceBgColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function getPerformanceLevel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

// ────────────────────────────────────────────
// Roles by department
// ────────────────────────────────────────────
export const ROLES_BY_DEPARTMENT: Record<Department, string[]> = {
  Engineering: [
    "Software Engineer",
    "Senior Engineer",
    "Staff Engineer",
    "Tech Lead",
    "Engineering Manager",
    "DevOps Engineer",
    "QA Engineer",
  ],
  Design: [
    "UI Designer",
    "UX Designer",
    "Product Designer",
    "Design Lead",
    "Design Manager",
  ],
  Marketing: [
    "Marketing Specialist",
    "Content Strategist",
    "SEO Analyst",
    "Marketing Manager",
    "Growth Lead",
  ],
  Sales: [
    "Sales Representative",
    "Account Executive",
    "Sales Manager",
    "Business Development",
    "Sales Director",
  ],
  HR: [
    "HR Specialist",
    "Recruiter",
    "HR Manager",
    "People Operations",
    "Talent Acquisition Lead",
  ],
  Finance: [
    "Accountant",
    "Financial Analyst",
    "Finance Manager",
    "Controller",
    "CFO",
  ],
  Operations: [
    "Operations Analyst",
    "Project Manager",
    "Operations Manager",
    "Scrum Master",
    "Program Manager",
  ],
  Legal: [
    "Legal Counsel",
    "Compliance Officer",
    "Legal Manager",
    "Paralegal",
    "General Counsel",
  ],
};

// ────────────────────────────────────────────
// Skills pool
// ────────────────────────────────────────────
export const SKILLS_POOL = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "Figma",
  "Sketch",
  "Adobe XD",
  "CSS",
  "Tailwind",
  "Project Management",
  "Agile",
  "Scrum",
  "Data Analysis",
  "Machine Learning",
  "Communication",
  "Leadership",
  "Negotiation",
  "Financial Modeling",
  "Legal Research",
  "Content Writing",
  "SEO",
  "Google Analytics",
  "HubSpot",
  "Salesforce",
  "Jira",
];
