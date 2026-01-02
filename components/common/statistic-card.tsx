import { LucideIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
