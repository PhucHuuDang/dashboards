import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/settings/private", // Add paths you don't want indexed here
      ],
    },
    sitemap: "https://dashboards-three-drab.vercel.app/sitemap.xml",
  };
}
