import { Suspense } from "react";
import {
  DataGridSkeleton,
  DataGridSkeletonGrid,
  DataGridSkeletonToolbar,
} from "./data-grid-skeleton";
import { DataGridDemo } from "./data-grid-demo";

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
