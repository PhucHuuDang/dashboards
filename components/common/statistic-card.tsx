import { GripVerticalIcon, LucideIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { KanbanColumnHandle } from "../ui/kanban";

interface StatisticCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}
export const StatisticCard = ({
  icon: Icon,
  title,
  description,
}: StatisticCardProps) => {
  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            {title}
          </CardTitle>

          <CardDescription>{description}</CardDescription>
        </div>
        <KanbanColumnHandle
          className=" transition duration-300 hover:scale-105 p-0.5"
          asChild
        >
          <GripVerticalIcon className="size-6 text-muted-foreground bg-accent-foreground/10 hover:bg-muted-foreground/40 rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0" />
        </KanbanColumnHandle>
      </CardHeader>
    </Card>
  );
};
