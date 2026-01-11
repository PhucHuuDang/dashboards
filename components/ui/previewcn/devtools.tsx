"use client";

import { lazy, Suspense, useState } from "react";

import dynamic from "next/dynamic";

import { Trigger } from "./trigger";

const Panel = lazy(() => import("./panel"));
// const ThemeSheet = lazy(() => import("./theme-sheet"));
const ThemeSheet = dynamic(() => import("./theme-sheet"), {
  ssr: false,
});

// Check if we're in development mode
const IS_DEV = process.env.NODE_ENV === "development";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function DevtoolsInner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <Trigger onClick={() => setOpen(true)} />}
      {open && (
        // <Suspense fallback={null}>
        //   <Panel onClose={() => setOpen(false)} />
        //   <ThemeSheet open={open} onOpenChange={setOpen} />
        // </Suspense>
        <ThemeSheet open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}

export function PreviewcnDevtools() {
  // if (!IS_DEV) return null;

  return <DevtoolsInner />;
}
