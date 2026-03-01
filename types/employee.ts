export const EMPLOYEE_STATUSES = [
  "active",
  "onboarding",
  "on-leave",
  "resigned",
] as const;

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Legal",
] as const;

export const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract"] as const;

export const PERFORMANCE_LEVELS = [
  "excellent",
  "good",
  "average",
  "poor",
] as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];
export type Department = (typeof DEPARTMENTS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type PerformanceLevel = (typeof PERFORMANCE_LEVELS)[number];

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  department: Department;
  role: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  performanceScore: number;
  currentTasks: number;
  lastActivity: Date;
  joinDate: Date;
  reportingManager: string;
  skills: string[];
  contractType: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "admin" | "hr" | "team-lead" | "employee";
