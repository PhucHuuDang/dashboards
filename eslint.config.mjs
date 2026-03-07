import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*", "../../../*"],
              message:
                "Use absolute `@/features/...` imports when crossing boundaries to allow ESLint to enforce architecture.",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // fs, path
            "external", // react, next, lucide-react
            "internal", // @/...
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },

            {
              pattern: "react-use/**",
              group: "external",
              position: "before",
            },

            {
              pattern: "@/lib/**",
              group: "internal",
              position: "before",
            },

            {
              pattern: "@/types/**",
              group: "type",
              position: "before",
            },
            {
              pattern: "@/mocks/**",
              group: "internal",
              position: "before",
            },

            // {
            //   pattern: "@/**",
            //   group: "internal",
            // },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Disable React Compiler strictness for data-grid files — these use intentional
  // patterns (prev-value refs during render, manual memoization) that pre-date
  // the React Compiler rules and are safe as-is.
  {
    files: ["components/data-grid/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },

  prettier,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
