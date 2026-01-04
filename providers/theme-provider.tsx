"use client";

import * as React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  const [query] = React.useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          gcTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    });
  });

  return (
    <QueryClientProvider client={query}>
      <NextThemesProvider {...props}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};
