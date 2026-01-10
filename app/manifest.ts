import { siteConfig } from "@/config/site";

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "browser"],
    orientation: "any",
    theme_color: "#9333EA",
    background_color: "#ffffff",
    categories: ["productivity", "utilities", "business"],
    dir: "ltr",
    lang: "en",
    prefer_related_applications: false,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-dashboard.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Dashboard Overview",
      },
      {
        src: "/screenshots/mobile-dashboard.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Mobile Dashboard",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard Home",
        short_name: "Home",
        description: "Go to the main dashboard",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/shortcut-home.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Locations",
        short_name: "Locations",
        description: "View all locations",
        url: "/dashboard/locations",
        icons: [
          {
            src: "/icons/shortcut-locations.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
    related_applications: [],
    id: "dashboards-ui",
  };
}
