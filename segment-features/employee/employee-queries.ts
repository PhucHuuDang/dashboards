import { applyColumnFilters } from "../../lib/mock-filter-colums";
import { paginate, sortData } from "../../lib/mock-utils";

import { MOCK_EMPLOYEES } from "./employee-seeds";

import type { Employee, EmployeeStatus, Department } from "@/types/employee";

import type { GetEmployeesSchema } from "./employee-validations";

export async function getEmployees(input: GetEmployeesSchema) {
  try {
    let data: Employee[] = [...MOCK_EMPLOYEES];

    const advancedTable =
      input.filterFlag === "advancedFilters" ||
      input.filterFlag === "commandFilters";

    if (advancedTable) {
      data = applyColumnFilters<Employee>({
        data,
        filters: input.filters,
        joinOperator: input.joinOperator,
      });
    } else {
      // simple filters
      if (input.name) {
        const q = input.name.toLowerCase();
        data = data.filter(
          (e) =>
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q),
        );
      }

      if (input.status.length) {
        data = data.filter((e: Employee) => input.status.includes(e.status));
      }

      if (input.department.length) {
        data = data.filter((e: Employee) =>
          input.department.includes(e.department),
        );
      }

      if (input.employmentType.length) {
        data = data.filter((e: Employee) =>
          input.employmentType.includes(e.employmentType),
        );
      }
    }

    // sort + paginate
    data = sortData(
      data,
      input.sort.map((s) => ({ id: s.id as keyof Employee, desc: s.desc })),
    );

    const total = data.length;
    const pageData = paginate(data, input.page, input.perPage);

    return {
      data: pageData,
      pageCount: Math.ceil(total / input.perPage),
    };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getEmployeeStatusCounts(): Promise<
  Record<EmployeeStatus, number>
> {
  return MOCK_EMPLOYEES.reduce(
    (acc: Record<EmployeeStatus, number>, emp: Employee) => {
      acc[emp.status]++;
      return acc;
    },
    {
      active: 0,
      onboarding: 0,
      "on-leave": 0,
      resigned: 0,
    } as Record<EmployeeStatus, number>,
  );
}

export async function getEmployeeDepartmentCounts(): Promise<
  Record<Department, number>
> {
  return MOCK_EMPLOYEES.reduce(
    (acc: Record<Department, number>, emp: Employee) => {
      acc[emp.department]++;
      return acc;
    },
    {
      Engineering: 0,
      Design: 0,
      Marketing: 0,
      Sales: 0,
      HR: 0,
      Finance: 0,
      Operations: 0,
      Legal: 0,
    } as Record<Department, number>,
  );
}

export async function getEmploymentTypeCounts(): Promise<
  Record<Employee["employmentType"], number>
> {
  return MOCK_EMPLOYEES.reduce(
    (acc, emp) => {
      acc[emp.employmentType]++;
      return acc;
    },
    {
      "full-time": 0,
      "part-time": 0,
      contract: 0,
    } as Record<Employee["employmentType"], number>,
  );
}

export async function getPerformanceScoreRange() {
  const scores = MOCK_EMPLOYEES.map((e) => e.performanceScore);
  return {
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

export async function getPerformanceAtRiskCount() {
  return MOCK_EMPLOYEES.filter(
    (e) => e.performanceScore < 60 && e.status === "active",
  ).length;
}
