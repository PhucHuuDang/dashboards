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
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: false,
  },
  authors: [
    {
      name: "Harry Dang",
      url: "https://harrydang.com",
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
  metadataBase: new URL("https://dashboard.harrydang.com"),
  alternates: {
    canonical: "https://dashboard.harrydang.com",
  },

  bookmarks: "https://dashboard.harrydang.com",
};
