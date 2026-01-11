import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Toaster } from "sonner";

import { PreviewcnDevtools } from "@/components/ui/previewcn";
// import { Button } from "@/components/ui/button";
// import { ThemeSheet } from "@/components/ui/previewcn";
import { metadataConfig } from "@/config/metadata";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/providers/theme-provider";

import type { Metadata } from "next";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = metadataConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* {process.env.NODE_ENV === "development" && <PreviewcnDevtools />} */}

        <PreviewcnDevtools />

        {/* {process.env.NODE_ENV === "development" && (
          <ThemeSheet trigger={<Button>Theme</Button>} />
        )} */}

        {/* <Script
          defer
          data-site-id={siteConfig.url}
          src="https://assets.onedollarstats.com/stonks.js"
        /> */}

        <Toaster richColors closeButton position="top-right" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
