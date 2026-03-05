import { faker } from "@faker-js/faker";

import { ROLES_BY_DEPARTMENT, SKILLS_POOL } from "./employee-constants";

import type {
  Employee,
  EmployeeStatus,
  EmploymentType,
} from "@/types/employee";
import { DEPARTMENTS } from "@/types/employee";

faker.seed(42); // deterministic for consistency

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickRandomN<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function generateEmployee(index: number): Employee {
  const department = pickRandom(DEPARTMENTS);
  const roles = ROLES_BY_DEPARTMENT[department];
  const role = pickRandom(roles);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const status = weightedStatus();
  const joinDate = faker.date.between({
    from: new Date("2018-01-01"),
    to: new Date("2026-03-05"),
  });

  return {
    id: `emp_${String(index + 1).padStart(4, "0")}`,
    employeeCode: `EMP-${String(index + 1).padStart(4, "0")}`,
    firstName,
    lastName,
    email: faker.internet
      .email({ firstName, lastName, provider: "company.com" })
      .toLowerCase(),
    avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${firstName}${lastName}`,
    phone: faker.phone.number({ style: "international" }),
    department,
    role,
    employmentType: weightedEmploymentType(),
    status,
    performanceScore: generatePerformanceScore(status),
    currentTasks:
      status === "active" ? faker.number.int({ min: 0, max: 12 }) : 0,
    lastActivity: faker.date.between({
      from: new Date("2025-11-01"),
      to: new Date("2026-03-05"),
    }),
    joinDate,
    reportingManager: faker.person.fullName(),
    skills: pickRandomN(SKILLS_POOL, faker.number.int({ min: 2, max: 6 })),
    contractType:
      status === "resigned"
        ? "Terminated"
        : faker.helpers.arrayElement(["Permanent", "Fixed-Term", "Probation"]),
    createdAt: joinDate,
    updatedAt: faker.date.between({
      from: joinDate,
      to: new Date("2026-03-05"),
    }),
  };
}

/**
 * Weighted distribution: 65% active, 10% onboarding, 15% on-leave, 10% resigned
 */
function weightedStatus(): EmployeeStatus {
  const r = Math.random();
  if (r < 0.65) return "active";
  if (r < 0.75) return "onboarding";
  if (r < 0.9) return "on-leave";
  return "resigned";
}

function weightedEmploymentType(): EmploymentType {
  const r = Math.random();
  if (r < 0.7) return "full-time";
  if (r < 0.9) return "part-time";
  return "contract";
}

function generatePerformanceScore(status: EmployeeStatus): number {
  if (status === "resigned") return faker.number.int({ min: 20, max: 55 });
  if (status === "onboarding") return faker.number.int({ min: 50, max: 75 });
  return faker.number.int({ min: 30, max: 100 });
}

export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 1000 }).map(
  (_, i) => generateEmployee(i),
);
