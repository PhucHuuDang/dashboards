import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // typescript: { ignoreBuildErrors: true },

  experimental: {
    optimizePackageImports: [
      "lodash",
      "react-use",
      "framer-motion",
      "motion",
      "recharts",
      "@tanstack/react-table",
      "@tanstack/react-virtual",
      "@tanstack/react-query",
      "@faker-js/faker",

      // drag & drop / positioning
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@dnd-kit/modifiers",
      "@floating-ui/react",
    ],
  },
};

export default nextConfig;
