"use client";

import { flexRender, Row } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "../ui/table";

interface DraggableRowProps<TData> extends React.ComponentProps<"div"> {
  row: Row<TData>;

  [key: string]: unknown;
}

export const DraggableRow = <TData,>({
  row,
  key,
  ...props
}: DraggableRowProps<TData>) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original[key as keyof TData] as UniqueIdentifier,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
