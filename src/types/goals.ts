export type RecurrenceInterval = "daily" | "weekly" | "monthly";

export type Priority = "Low" | "Medium" | "High";

export type GoalStatus = "Not Started" | "In Progress" | "Completed";

export interface Goal {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  deadline: string | null;
  status: GoalStatus;
  progress: number;
  is_recurring: boolean;
  recurrence_interval: RecurrenceInterval | null;
  user_id: string;
}

export interface GoalFormData {
  title: string;
  category: string;
  priority: Priority;
  deadline: string;
  is_recurring: boolean;
  recurrence_interval: RecurrenceInterval | null;
}