"use client";

import * as React from "react";

import {
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import { ReplaceIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface KanbanContextProps<T> {
  columns: Record<string, T[]>;
  setColumns: (columns: Record<string, T[]>) => void;
  getItemId: (item: T) => string;
  columnIds: string[];
  activeId: UniqueIdentifier | null;
  setActiveId: (id: UniqueIdentifier | null) => void;
  findContainer: (id: UniqueIdentifier) => string | undefined;
  isColumn: (id: UniqueIdentifier) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KanbanContext = React.createContext<KanbanContextProps<any>>({
  columns: {},
  setColumns: () => {},
  getItemId: () => "",
  columnIds: [],
  activeId: null,
  setActiveId: () => {},
  findContainer: () => undefined,
  isColumn: () => false,
});

const ColumnContext = React.createContext<{
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  attributes: {} as DraggableAttributes,
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const ItemContext = React.createContext<{
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const dropAnimationConfig: DropAnimation = {
  ...defaultDropAnimation,
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export interface KanbanMoveEvent {
  event: DragEndEvent;
  activeContainer: string;
  activeIndex: number;
  overContainer: string;
  overIndex: number;
}

export interface KanbanRootProps<T> {
  value: Record<string, T[]>;
  onValueChange: (value: Record<string, T[]>) => void;
  getItemValue: (item: T) => string;
  /** Optional function to get the display label/title of an item for toast notifications */
  getItemLabel?: (item: T) => string;
  children: React.ReactNode;
  className?: string;
  onMove?: (event: KanbanMoveEvent) => void;
  successMessage?: string;
}

function Kanban<T>({
  value,
  onValueChange,
  getItemValue,
  getItemLabel,
  children,
  className,
  onMove,
  successMessage = "Position changed successfully",
}: KanbanRootProps<T>) {
  const columns = value;
  const setColumns = onValueChange;
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  // Helper to find item by ID and get its label
  const findItemById = React.useCallback(
    (id: UniqueIdentifier): T | undefined => {
      for (const columnItems of Object.values(columns)) {
        const item = columnItems.find((item) => getItemValue(item) === id);
        if (item) return item;
      }
      return undefined;
    },
    [columns, getItemValue]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columnIds = React.useMemo(() => Object.keys(columns), [columns]);

  const isColumn = React.useCallback(
    (id: UniqueIdentifier) => columnIds.includes(id as string),
    [columnIds]
  );

  const findContainer = React.useCallback(
    (id: UniqueIdentifier) => {
      if (isColumn(id)) return id as string;
      return columnIds.find((key) =>
        columns[key].some((item) => getItemValue(item) === id)
      );
    },
    [columns, columnIds, getItemValue, isColumn]
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      if (onMove) {
        return;
      }

      const { active, over } = event;
      if (!over) return;

      if (isColumn(active.id)) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      // Only handle moving items between different columns
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      const activeItems = columns[activeContainer];
      const overItems = columns[overContainer];

      const activeIndex = activeItems.findIndex(
        (item: T) => getItemValue(item) === active.id
      );
      let overIndex = overItems.findIndex(
        (item: T) => getItemValue(item) === over.id
      );

      // If dropping on the column itself, not an item
      if (isColumn(over.id)) {
        overIndex = overItems.length;
      }

      const newOverItems = [...overItems];
      const [movedItem] = activeItems.splice(activeIndex, 1);
      newOverItems.splice(overIndex, 0, movedItem);

      setColumns({
        ...columns,
        [activeContainer]: [...activeItems],
        [overContainer]: newOverItems,
      });
    },
    [findContainer, getItemValue, isColumn, setColumns, columns, onMove]
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      // Get the item label for toast
      const activeItem = findItemById(active.id);
      const itemLabel =
        activeItem && getItemLabel ? getItemLabel(activeItem) : undefined;

      // Handle item move callback
      if (onMove && !isColumn(active.id)) {
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer && overContainer) {
          const activeIndex = columns[activeContainer].findIndex(
            (item: T) => getItemValue(item) === active.id
          );
          const overIndex = isColumn(over.id)
            ? columns[overContainer].length
            : columns[overContainer].findIndex(
                (item: T) => getItemValue(item) === over.id
              );

          // Check if position actually changed
          const hasChanged =
            activeContainer !== overContainer || activeIndex !== overIndex;

          onMove({
            event,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
          });

          if (hasChanged) {
            toast(
              <KanbanSuccessToast
                message={successMessage}
                itemTitle={itemLabel}
              />
            );
          }
        }
        return;
      }

      // Handle column reordering
      if (isColumn(active.id) && isColumn(over.id)) {
        const activeIndex = columnIds.indexOf(active.id as string);
        const overIndex = columnIds.indexOf(over.id as string);
        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(
            Object.keys(columns),
            activeIndex,
            overIndex
          );
          const newColumns: Record<string, T[]> = {};
          newOrder.forEach((key) => {
            newColumns[key] = columns[key];
          });
          setColumns(newColumns);
          toast(
            <KanbanSuccessToast
              message={successMessage}
              itemTitle={active.id as string}
            />
          );
        }
        return;
      }

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      // Handle item reordering within the same column
      if (
        activeContainer &&
        overContainer &&
        activeContainer === overContainer
      ) {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === active.id
        );
        const overIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        if (activeIndex !== overIndex) {
          setColumns({
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex),
          });
          toast(
            <KanbanSuccessToast
              message={successMessage}
              itemTitle={itemLabel}
            />
          );
        }
      }
    },
    [
      columnIds,
      columns,
      findContainer,
      findItemById,
      getItemLabel,
      getItemValue,
      isColumn,
      setColumns,
      onMove,
      successMessage,
    ]
  );

  const contextValue = React.useMemo(
    () => ({
      columns,
      setColumns,
      getItemId: getItemValue,
      columnIds,
      activeId,
      setActiveId,
      findContainer,
      isColumn,
    }),
    [
      columns,
      setColumns,
      getItemValue,
      columnIds,
      activeId,
      findContainer,
      isColumn,
    ]
  );

  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          data-slot="kanban"
          data-dragging={activeId !== null}
          className={cn(className)}
        >
          {children}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  );
}

export interface KanbanBoardProps {
  className?: string;
  children: React.ReactNode;
}

function KanbanBoard({ children, className }: KanbanBoardProps) {
  const { columnIds } = React.useContext(KanbanContext);

  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      {/* grid auto-rows-fr sm:grid-cols-3 gap-4 */}
      <div data-slot="kanban-board" className={cn("", className)}>
        {children}
      </div>
    </SortableContext>
  );
}

export interface KanbanColumnProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function KanbanColumn({
  value,
  className,
  children,
  disabled,
}: KanbanColumnProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled,
  });

  const { activeId, isColumn } = React.useContext(KanbanContext);
  const isColumnDragging = activeId ? isColumn(activeId) : false;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  return (
    <ColumnContext.Provider
      value={{ attributes, listeners, isDragging: isColumnDragging, disabled }}
    >
      <div
        data-slot="kanban-column"
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        className={cn(
          "group/kanban-column flex flex-col",
          isSortableDragging && "opacity-50",
          disabled && "opacity-50",
          className
        )}
      >
        {children}
      </div>
    </ColumnContext.Provider>
  );
}

export interface KanbanColumnHandleProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  cursor?: boolean;
}

function KanbanColumnHandle({
  asChild,
  className,
  children,
  cursor = true,
}: KanbanColumnHandleProps) {
  const { attributes, listeners, isDragging, disabled } =
    React.useContext(ColumnContext);

  const Comp = asChild ? Slot : "div";

  // console.log({ isDragging });

  return (
    <Comp
      data-slot="kanban-column-handle"
      data-dragging={isDragging}
      data-disabled={disabled}
      {...attributes}
      {...listeners}
      className={cn(
        "opacity-0 transition-opacity group-hover/kanban-column:opacity-100 group-hover/kanban-column:shadow-none!",
        cursor && (isDragging ? "!cursor-grabbing" : "!cursor-grab"),
        className
      )}
    >
      {children}
    </Comp>
  );
}

export interface KanbanItemProps {
  value: string;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function KanbanItem({
  value,
  asChild = false,
  className,
  children,
  disabled,
}: KanbanItemProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled,
  });

  const { activeId, isColumn } = React.useContext(KanbanContext);
  const isItemDragging = activeId ? !isColumn(activeId) : false;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  const Comp = asChild ? Slot : "div";

  return (
    <ItemContext.Provider
      value={{ listeners, isDragging: isItemDragging, disabled }}
    >
      <Comp
        data-slot="kanban-item"
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          isSortableDragging && "opacity-50",
          disabled && "opacity-50",
          className
        )}
      >
        {children}
      </Comp>
    </ItemContext.Provider>
  );
}

export interface KanbanItemHandleProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  cursor?: boolean;
}

function KanbanItemHandle({
  asChild,
  className,
  children,
  cursor = true,
}: KanbanItemHandleProps) {
  const { listeners, isDragging, disabled } = React.useContext(ItemContext);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="kanban-item-handle"
      data-dragging={isDragging}
      data-disabled={disabled}
      {...listeners}
      className={cn(
        cursor && (isDragging ? "!cursor-grabbing" : "!cursor-grab"),
        className
      )}
    >
      {children}
    </Comp>
  );
}

export interface KanbanColumnContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function KanbanColumnContent({
  value,
  className,
  children,
}: KanbanColumnContentProps) {
  const { columns, getItemId } = React.useContext(KanbanContext);

  const itemIds = React.useMemo(
    () => columns[value].map(getItemId),
    [columns, getItemId, value]
  );

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        data-slot="kanban-column-content"
        className={cn("flex flex-col gap-2", className)}
      >
        {children}
      </div>
    </SortableContext>
  );
}

export interface KanbanOverlayProps {
  className?: string;
  children?:
    | React.ReactNode
    | ((params: {
        value: UniqueIdentifier;
        variant: "column" | "item";
      }) => React.ReactNode);
}

function KanbanOverlay({ children, className }: KanbanOverlayProps) {
  const { activeId, isColumn } = React.useContext(KanbanContext);
  const [dimensions, setDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    if (activeId) {
      const element = document.querySelector(
        `[data-slot="kanban-${
          isColumn(activeId) ? "column" : "item"
        }"][data-value="${activeId}"]`
      );
      if (element) {
        const rect = element.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    } else {
      setDimensions(null);
    }
  }, [activeId, isColumn]);

  const style = {
    width: dimensions?.width,
    height: dimensions?.height,
  } as React.CSSProperties;

  const content = React.useMemo(() => {
    if (!activeId) return null;
    if (typeof children === "function") {
      return children({
        value: activeId,
        variant: isColumn(activeId) ? "column" : "item",
      });
    }
    return children;
  }, [activeId, children, isColumn]);

  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>
      <div
        data-slot="kanban-overlay"
        data-dragging={true}
        style={style}
        className={cn(
          "pointer-events-none",
          className,
          activeId ? "!cursor-grabbing" : ""
        )}
      >
        {content}
      </div>
    </DragOverlay>
  );
}

function KanbanSuccessToast({
  className,
  message,
  itemTitle,
}: {
  className?: string;
  message: string;
  itemTitle?: string;
}) {
  const wordRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
  const reTitle = itemTitle?.match(wordRegex)?.join(" ").toLowerCase();

  // console.log({ reTitle });
  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <ReplaceIcon className="size-6 text-primary" />
      <div className="flex gap-1">
        {itemTitle && (
          <span className="text-sm capitalize text-primary underline truncate max-w-[200px]">
            {`(${reTitle})`}
          </span>
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanColumnContent,
  KanbanOverlay,
};
