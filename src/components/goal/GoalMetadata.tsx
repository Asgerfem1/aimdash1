import { CalendarIcon, Flag } from "lucide-react";

interface GoalMetadataProps {
  deadline: string | null;
  priority: "High" | "Medium" | "Low";
}

const priorityColors = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

export function GoalMetadata({ deadline, priority }: GoalMetadataProps) {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        <span>{deadline ? new Date(deadline).toLocaleDateString() : 'No deadline'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Flag className={`h-4 w-4 ${priorityColors[priority]}`} />
        <span className={priorityColors[priority]}>{priority}</span>
      </div>
    </div>
  );
}