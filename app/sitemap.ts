import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constant/routes";

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routePaths = Object.values(ROUTES);

  const routes = routePaths.map((route) => ({
    url: `${siteConfig.url.replace(/\/$/, "")}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return routes;
}
