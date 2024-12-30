import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@supabase/auth-helpers-react";
import { GoalFormData, RecurrenceInterval, Priority } from "@/types/goals";
import { GoalBasicFields } from "./goal/form/GoalBasicFields";
import { GoalPriorityField } from "./goal/form/GoalPriorityField";
import { GoalRecurrenceFields } from "./goal/form/GoalRecurrenceFields";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string | null;
}

export function GoalDialog({ open, onOpenChange, goalId }: GoalDialogProps) {
  const user = useUser();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm<GoalFormData>();
  const isRecurring = watch('is_recurring');

  const { data: goal } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      if (!goalId) return null;
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!goalId,
  });

  useEffect(() => {
    if (goal) {
      setValue('title', goal.title);
      setValue('category', goal.category);
      setValue('priority', goal.priority);
      setValue('deadline', goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
      setValue('is_recurring', goal.is_recurring || false);
      setValue('recurrence_interval', goal.recurrence_interval as RecurrenceInterval);
    } else {
      reset();
    }
  }, [goal, setValue, reset]);

  const createGoal = useMutation({
    mutationFn: async (data: GoalFormData) => {
      if (!user) throw new Error("User must be logged in");
      
      const { error } = await supabase
        .from('goals')
        .insert({
          ...data,
          user_id: user.id,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
          status: 'Not Started',
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onOpenChange(false);
      toast.success('Goal created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create goal');
      console.error('Error creating goal:', error);
    },
  });

  const updateGoal = useMutation({
    mutationFn: async (data: GoalFormData) => {
      if (!user) throw new Error("User must be logged in");
      
      const { error } = await supabase
        .from('goals')
        .update({
          ...data,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        })
        .eq('id', goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onOpenChange(false);
      toast.success('Goal updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update goal');
      console.error('Error updating goal:', error);
    },
  });

  const onSubmit = (data: GoalFormData) => {
    if (!user) {
      toast.error('You must be logged in to manage goals');
      return;
    }

    if (goalId) {
      updateGoal.mutate(data);
    } else {
      createGoal.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goalId ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <GoalBasicFields register={register} />
          <GoalPriorityField
            defaultValue={goal?.priority}
            onValueChange={(value) => setValue('priority', value)}
          />
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              {...register('deadline')}
            />
          </div>
          <GoalRecurrenceFields
            isRecurring={isRecurring}
            onRecurringChange={(checked) => setValue('is_recurring', checked)}
            onIntervalChange={(value) => setValue('recurrence_interval', value)}
            defaultInterval={goal?.recurrence_interval as RecurrenceInterval}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {goalId ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}