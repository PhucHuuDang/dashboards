import { Metadata } from "next";

import { activitySearchParamsCache } from "@/lib/activity-parsers";

import { SidebarInsetContent } from "@/components/chunks/sidebar-chunks";
import ActivitiesClient from "@/components/segments/activities/activities-client";

import type { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Activities Dashboard | Track Workspace Progress",
  description:
    "Monitor and filter real-time activities across your workspace. Track tasks, projects, comments, and system updates by Date, Performance Impact, Position, and Gender.",
  keywords: [
    "activities dashboard",
    "workspace tracking",
    "project management",
    "performance analytics",
    "team activity log",
    "task tracking",
  ],
  openGraph: {
    title: "Activities Dashboard | Workspace Analytics",
    description:
      "Real-time activity tracking and performance metrics for your team.",
    type: "website",
    url: "https://yourdomain.com/dashboard/activities",
    images: [
      {
        url: "https://yourdomain.com/og-activities-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "Activities Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Activities Dashboard | Workspace Analytics",
    description:
      "Real-time activity tracking and performance metrics for your team.",
    images: ["https://yourdomain.com/og-activities-dashboard.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Activities Dashboard",
  description:
    "Monitor and filter real-time activities, track tasks, projects, comments, and system updates.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Workspace Dashboard",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
};

interface ActivitiesPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * Server Component page — reads URL search params via nuqs cache and passes
 * the parsed initial filter values to `ActivitiesClient`.
 *
 * This enables:
 * - SSR: server renders the page with the correct filters applied on first load
 * - SEO: crawlers see the right content when following a filtered URL
 * - Shareability: ?type=task&sort=performance renders correctly server-side
 */
const ActivitiesPage = async ({ searchParams }: ActivitiesPageProps) => {
  // Parse & cache search params on the server (type-safe, validated against parsers)
  const parsed = await activitySearchParamsCache.parse(searchParams);

  // Cast through string parsers to our stricter ActivityFilterParams type
  const initialFilters = {
    q: parsed.q,
    type: parsed.type as
      | "all"
      | "task"
      | "project"
      | "comment"
      | "system"
      | "status",
    gender: parsed.gender,
    position: parsed.position,
    sort: parsed.sort as "desc" | "asc" | "performance",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SidebarInsetContent>
        <ActivitiesClient initialFilters={initialFilters} />
      </SidebarInsetContent>
    </>
  );
};

export default ActivitiesPage;
