import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecurrenceInterval } from "@/types/goals";

interface GoalRecurrenceFieldsProps {
  isRecurring: boolean;
  onRecurringChange: (checked: boolean) => void;
  onIntervalChange: (value: RecurrenceInterval) => void;
  defaultInterval?: RecurrenceInterval;
}

export function GoalRecurrenceFields({
  isRecurring,
  onRecurringChange,
  onIntervalChange,
  defaultInterval = "weekly"
}: GoalRecurrenceFieldsProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_recurring"
          checked={isRecurring}
          onCheckedChange={onRecurringChange}
        />
        <Label htmlFor="is_recurring">Recurring Goal</Label>
      </div>

      {isRecurring && (
        <div className="space-y-2">
          <Label htmlFor="recurrence_interval">Recurrence Interval</Label>
          <Select
            onValueChange={(value) => onIntervalChange(value as RecurrenceInterval)}
            defaultValue={defaultInterval}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}