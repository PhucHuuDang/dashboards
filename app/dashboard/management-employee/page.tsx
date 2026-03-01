import { Metadata } from "next";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import EmployeeTableWrapper from "@/components/data-table/employee-table/employee-table-wrapper";

import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Employee Management | Dashboard",
  description:
    "Manage employee records, onboarding, performance reviews, and task assignments across your organization.",
  keywords: [
    "employee management",
    "HR dashboard",
    "team management",
    "performance tracking",
    "employee onboarding",
    "task assignment",
  ],
  openGraph: {
    title: "Employee Management | Dashboard",
    description:
      "Centralized employee management — records, performance, and task assignments.",
    type: "website",
  },
};

interface ManagementEmployeePageProps {
  searchParams: Promise<SearchParams>;
}

const ManagementEmployeePage = async ({
  searchParams,
}: ManagementEmployeePageProps) => {
  return (
    <SidebarInsetContent>
      <div className="container py-6">
        <EmployeeTableWrapper searchParams={searchParams} />
      </div>
    </SidebarInsetContent>
  );
};

export default ManagementEmployeePage;
