"use client";

import { Fragment, useState } from "react";

import { UserIcon } from "lucide-react";

import { StatisticCard } from "@/components/card-block/statistic-card";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";

import { RichAreaChart } from "../../charts/rich-area-chart";
import { RichPieChart } from "../../charts/rich-pie-chart";
import TaskTableWrapper from "../../data-table/task-table/task-table-wrapper";

import type { Prettify, SearchParams } from "@/types";

interface DashboardBlock {
  id: string;
  component: React.ReactNode;
}

interface DashboardKanbanProps {
  searchParams: Promise<SearchParams>;
}

function StatisticBlock() {
  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    users: [
      {
        id: "1",
        component: (
          <StatisticCard title="Users" description="100" icon={UserIcon} />
        ),
      },
    ],
    orders: [
      {
        id: "2",
        component: (
          <StatisticCard title="Orders" description="100" icon={UserIcon} />
        ),
      },
    ],
    products: [
      {
        id: "3",
        component: (
          <StatisticCard title="Products" description="100" icon={UserIcon} />
        ),
      },
    ],
    revenue: [
      {
        id: "4",
        component: (
          <StatisticCard title="Revenue" description="100" icon={UserIcon} />
        ),
      },
    ],
  });

  return (
    <>
      <KanbanColumnHandle
        className={`transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl w-full`}
      >
        <Kanban<DashboardBlock>
          value={columns}
          onValueChange={setColumns}
          getItemValue={(item) => item.id}
        >
          <KanbanBoard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            {Object.entries(columns).map(([columnId, blocks]) => (
              <KanbanColumn key={columnId} value={columnId}>
                {blocks.map((block) => {
                  return (
                    <Fragment key={`${columnId}-block-${block.id}`}>
                      {block.component}
                    </Fragment>
                  );
                })}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </Kanban>
      </KanbanColumnHandle>
    </>
  );
}

function ChartsBlock() {
  return (
    <>
      <KanbanColumnHandle className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 transition-opacity opacity-100 group-hover/kanban-column:backdrop-opacity-90 group-hover/kanban-column:shadow-2xl w-full">
        <RichPieChart />
        <RichAreaChart />
      </KanbanColumnHandle>
    </>
  );
}

export const DashboardKanban = ({
  blocks: initialBlocks,
  searchParams,
}: Prettify<
  DashboardKanbanProps & {
    blocks?: DashboardBlock[];
  }
>) => {
  const [columns, setColumns] = useState<Record<string, DashboardBlock[]>>({
    totalUsers: [
      {
        id: "1",
        component: <StatisticBlock />,
      },
    ],

    charts: [
      {
        id: "2",
        component: <ChartsBlock />,
      },
    ],

    dataTable: [
      {
        id: "3",
        component: <TaskTableWrapper searchParams={searchParams} />,
      },
    ],
  });

  // console.log({ columns });

  return (
    <Kanban<DashboardBlock>
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
      className=""
    >
      <KanbanBoard className=" overflow-hidden space-y-2 md:space-y-3 lg:space-y-4 ">
        {Object.entries(columns).map(([columnId, blocks]) => {
          // console.log({ columnId });

          return (
            <KanbanColumn
              key={columnId}
              value={columnId}
              className="min-w-full "
            >
              <div className="">
                {blocks.map((block) => (
                  <div key={`${columnId}-block-${block.id}`}>
                    {block.component}
                  </div>
                ))}
              </div>
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </Kanban>
  );
};
