import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

interface GoalActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export function GoalActions({ onEdit, onDelete, onComplete, isCompleted }: GoalActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onComplete}
        className={`h-8 w-8 ${isCompleted ? 'text-green-500' : ''}`}
        disabled={isCompleted}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8 text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}