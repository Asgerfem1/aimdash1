import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Flag } from "lucide-react";

interface GoalCardProps {
  title: string;
  category: string;
  progress: number;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

export function GoalCard({ title, category, progress, deadline, priority }: GoalCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <Badge variant="outline" className="ml-2">
          {category}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className={`h-4 w-4 ${priorityColors[priority]}`} />
              <span>{priority}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}