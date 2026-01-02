"use client";

import * as React from "react";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { cn } from "@/lib/utils";

// Define your dashboard block types
export interface DashboardBlock {
  id: string;
  title: string;
  component: React.ReactNode;
  // Optional: control grid span
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

interface DashboardKanbanProps {
  blocks: DashboardBlock[];
  onBlocksChange?: (blocks: DashboardBlock[]) => void;
  className?: string;
}

export const DashboardKanban = ({
  blocks: initialBlocks,
  onBlocksChange,
  className,
}: DashboardKanbanProps) => {
  // Each block is treated as a "column" for drag-and-drop reordering
  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>(
    () => {
      // Convert blocks array to columns object (each block is its own column with empty items)
      const cols: Record<string, DashboardBlock[]> = {};
      initialBlocks.forEach((block) => {
        cols[block.id] = [];
      });
      return cols;
    }
  );

  // Keep blocks in sync for rendering
  const [blocks, setBlocks] = useState<DashboardBlock[]>(initialBlocks);

  const handleValueChange = (newColumns: Record<string, DashboardBlock[]>) => {
    // Reorder blocks based on new column order
    const newBlockOrder = Object.keys(newColumns);
    const reorderedBlocks = newBlockOrder
      .map((id) => blocks.find((b) => b.id === id))
      .filter((b): b is DashboardBlock => b !== undefined);

    setColumns(newColumns);
    setBlocks(reorderedBlocks);
    onBlocksChange?.(reorderedBlocks);
  };

  return (
    <Kanban<DashboardBlock>
      value={columns}
      onValueChange={handleValueChange}
      getItemValue={(item) => item.id}
      className={className}
    >
      <KanbanBoard className="">
        {blocks.map((block) => (
          <KanbanColumn
            key={block.id}
            value={block.id}
            className={cn(
              "group relative min-h-fit",
              block.colSpan === 2 && "lg:col-span-2",
              block.colSpan === 3 && "col-span-1 lg:col-span-3",
              block.rowSpan === 2 && "row-span-2"
            )}
          >
            {/* Drag handle - visible on hover */}
            <KanbanColumnHandle
              className={cn(
                "absolute top-3 right-3 z-10",
                "p-1.5 rounded-md",
                "bg-background/80 border shadow-sm hover:bg-muted",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </KanbanColumnHandle>

            {/* Block content */}
            {block.component}
          </KanbanColumn>
        ))}
      </KanbanBoard>

      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === "column") {
            const block = blocks.find((b) => b.id === value);
            if (block) {
              return (
                <div className="rounded-lg border-2 border-primary/50 bg-background/95 backdrop-blur-sm shadow-xl h-full opacity-90">
                  {block.component}
                </div>
              );
            }
          }
          return <div className="rounded-md bg-muted/60 size-full" />;
        }}
      </KanbanOverlay>
    </Kanban>
  );
};
