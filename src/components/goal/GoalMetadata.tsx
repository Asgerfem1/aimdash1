import { CalendarIcon, Flag, RefreshCw } from "lucide-react";
import { GoalCompletionHistory } from "./GoalCompletionHistory";

interface GoalMetadataProps {
  deadline: string | null;
  priority: "High" | "Medium" | "Low";
  isRecurring?: boolean;
  recurrenceInterval?: string | null;
  title: string;
}

const priorityColors = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

export function GoalMetadata({ deadline, priority, isRecurring, recurrenceInterval, title }: GoalMetadataProps) {
  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{deadline ? new Date(deadline).toLocaleDateString() : 'No deadline'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag className={`h-4 w-4 ${priorityColors[priority]}`} />
          <span className={priorityColors[priority]}>{priority}</span>
        </div>
      </div>
      {isRecurring && recurrenceInterval && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Repeats {recurrenceInterval}</span>
          </div>
          <GoalCompletionHistory 
            goalTitle={title}
            recurrenceInterval={recurrenceInterval as "daily" | "weekly" | "monthly"}
          />
        </div>
      )}
    </div>
  );
}