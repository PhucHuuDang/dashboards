import { Metadata } from "next";

export const metadataConfig: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  description:
    "A minimal yet powerful dashboard UI focused on simplicity, usability, and visual balance.",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Dashboard",
    description:
      "A minimal yet powerful dashboard UI focused on simplicity, usability, and visual balance.",
    url: "https://dashboard.com",
    siteName: "Dashboard",

    countryName: "Vietnam",
    emails: ["danghuuphuc001@gmail.com", "danghuuphuc002@gmail.com"],
    firstName: "Harry",
    lastName: "Dang",
    username: "harrydang",
    gender: "male",
    writers: ["Harry Dang"],
  },

  abstract:
    "A minimal yet powerful dashboard UI focused on simplicity, usability, and visual balance.",
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
    index: false,
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
    "dashboard",
    "ui",
    "design",
    "development",
    "tailwindcss",
    "shadcn",
    "react",
    "nextjs",
    "typescript",
    "animate-ui",
    "radix-ui",
    "radix-nova",
    "radix-ui-react",
    "radix-ui-react-native",
    "radix-ui-react-native-web",
    "radix-ui-react-native-web-web",
    "radix-ui-react-native-web-web-web",
  ],
  metadataBase: new URL("https://dashboards-three-drab.vercel.app/dashboard"),
  alternates: {
    canonical: "https://dashboards-three-drab.vercel.app/dashboard",
  },

  bookmarks: "https://dashboards-three-drab.vercel.app/dashboard",
};
