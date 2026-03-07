import { Suspense } from "react";

import { Metadata } from "next";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import { EmployeeAnalyticsSection } from "@/features/employee/components/employee-analytics/employee-analytics-section";
import EmployeeTableWrapper from "@/features/employee/components/employee-table/employee-table-wrapper";

import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Employee Management & Performance | Dashboard",
  description:
    "Centralize your workforce with our Employee Management Dashboard. Seamlessly track performance reviews, onboard new hires, and assign tasks with ease.",
  keywords: [
    "employee management software",
    "HR performance tracking",
    "workforce management dashboard",
    "employee onboarding platform",
    "team task assignment",
  ],
  alternates: {
    canonical:
      "https://dashboards-three-drab.vercel.app/dashboard/management-employee",
  },
  openGraph: {
    title: "Employee Management & Performance | Dashboard",
    description:
      "Centralize your workforce with our Employee Management Dashboard. Seamlessly track performance reviews, onboard new hires, and assign tasks with ease.",
    url: "https://dashboards-three-drab.vercel.app/dashboard/management-employee",
    type: "website",
    siteName: "Dashboards",
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Management & Performance | Dashboard",
    description:
      "Centralize your workforce with our Employee Management Dashboard. Seamlessly track performance reviews, onboard new hires, and assign tasks with ease.",
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
      <div className="container space-y-8 py-6">
        <Suspense
          fallback={
            <div className="h-[200px] animate-pulse rounded-xl bg-muted" />
          }
        >
          <EmployeeAnalyticsSection />
        </Suspense>

        <EmployeeTableWrapper searchParams={searchParams} />
      </div>
    </SidebarInsetContent>
  );
};

export default ManagementEmployeePage;
