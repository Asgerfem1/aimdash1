import { Card, CardContent } from "@/components/ui/card";
import { GoalHeader } from "./GoalHeader";
import { GoalProgress } from "./GoalProgress";
import { GoalMetadata } from "./GoalMetadata";
import { GoalTasks } from "./GoalTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GoalActions } from "./GoalActions";
import { useState } from "react";
import { DeleteGoalDialog } from "./DeleteGoalDialog";

interface GoalCardProps {
  id: string;
  title: string;
  category: string;
  progress: number;
  deadline: string | null;
  priority: "High" | "Medium" | "Low";
  isRecurring?: boolean;
  recurrenceInterval?: string | null;
  status: "Not Started" | "In Progress" | "Completed";
  onEdit: (id: string) => void;
}

export function GoalCard({
  id,
  title,
  category,
  progress,
  deadline,
  priority,
  isRecurring,
  recurrenceInterval,
  status,
  onEdit
}: GoalCardProps) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteGoal = useMutation({
    mutationFn: async (deleteAll: boolean) => {
      if (deleteAll && isRecurring) {
        const { error } = await supabase.rpc('delete_recurring_goal_instances', {
          goal_id: id
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete goal');
      console.error('Error deleting goal:', error);
    },
  });

  const completeGoal = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('goals')
        .update({ status: 'Completed' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal marked as completed');
    },
    onError: (error) => {
      toast.error('Failed to complete goal');
      console.error('Error completing goal:', error);
    },
  });

  const handleDelete = (deleteAll: boolean) => {
    deleteGoal.mutate(deleteAll);
    setIsDeleteDialogOpen(false);
  };

  const handleComplete = () => {
    if (window.confirm('Are you sure you want to mark this goal as completed?')) {
      completeGoal.mutate();
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-shadow duration-300">
        <GoalHeader
          title={title}
          category={category}
          actions={
            <GoalActions
              onEdit={() => onEdit(id)}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onComplete={handleComplete}
              isCompleted={status === 'Completed'}
            />
          }
        />
        <CardContent>
          <div className="space-y-4">
            <GoalProgress progress={progress} />
            <GoalMetadata
              deadline={deadline}
              priority={priority}
              isRecurring={isRecurring}
              recurrenceInterval={recurrenceInterval}
            />
            <GoalTasks goalId={id} />
          </div>
        </CardContent>
      </Card>

      <DeleteGoalDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isRecurring={isRecurring || false}
      />
    </>
  );
}