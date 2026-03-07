import { Suspense } from "react";

import { DataGridDemo } from "./data-grid-demo";
import {
  DataGridSkeleton,
  DataGridSkeletonGrid,
  DataGridSkeletonToolbar,
} from "./data-grid-skeleton";

export const DataGridPage = () => {
  return (
    <Suspense
      fallback={
        <DataGridSkeleton className="container flex flex-col gap-4 py-4">
          <DataGridSkeletonToolbar actionCount={5} />
          <DataGridSkeletonGrid />
        </DataGridSkeleton>
      }
    >
      <DataGridDemo />
    </Suspense>
  );
};
