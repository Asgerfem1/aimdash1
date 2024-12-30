import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority } from "@/types/goals";

interface GoalPriorityFieldProps {
  defaultValue?: Priority;
  onValueChange: (value: Priority) => void;
}

export function GoalPriorityField({ defaultValue = "Medium", onValueChange }: GoalPriorityFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="priority">Priority</Label>
      <Select
        onValueChange={(value) => onValueChange(value as Priority)}
        defaultValue={defaultValue}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}