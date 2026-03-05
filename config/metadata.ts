import { Metadata } from "next";

export const metadataConfig: Metadata = {
  title: {
    default: "Enterprise Dashboard | Analytics & Management",
    template: "%s | Dashboard Workspace",
  },
  description:
    "A responsive, minimal, and powerful dashboard workspace for managing employees, tracking activities, and analyzing performance metrics efficiently.",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Enterprise Dashboard | Analytics & Management",
    description:
      "A responsive, minimal, and powerful dashboard workspace for managing employees, tracking activities, and analyzing performance metrics efficiently.",
    url: "https://dashboards-three-drab.vercel.app/dashboard",
    siteName: "Dashboards",

    countryName: "Vietnam",
    emails: ["danghuuphuc001@gmail.com", "danghuuphuc002@gmail.com"],
    firstName: "Harry",
    lastName: "Dang",
    username: "harrydang",
    gender: "male",
    writers: ["Harry Dang"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise Dashboard | Analytics & Management",
    description:
      "A responsive, minimal, and powerful dashboard workspace for managing employees, tracking activities, and analyzing performance metrics efficiently.",
  },

  abstract:
    "A responsive, minimal, and powerful dashboard workspace for managing employees, tracking activities, and analyzing performance metrics efficiently.",
  applicationName: "Dashboard",
  appleWebApp: {
    title: "Dashboard",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: "/icons/icon-512x512.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [
    {
      name: "Harry Dang",
      url: "https://github.com/PhucHuuDang",
    },
  ],
  creator: "Harry Dang",
  publisher: "Harry Dang",
  category: "technology",
  keywords: [
    "enterprise dashboard",
    "management workspace",
    "performance analytics",
    "employee management",
    "tailwindcss",
    "shadcn",
    "react",
    "nextjs",
    "typescript",
  ],
  metadataBase: new URL("https://dashboards-three-drab.vercel.app"),
  alternates: {
    canonical: "/",
  },

  bookmarks: "https://dashboards-three-drab.vercel.app/dashboard",
};
