import { Card, CardContent } from "@/components/ui/card";
import { GoalHeader } from "./GoalHeader";
import { GoalProgress } from "./GoalProgress";
import { GoalMetadata } from "./GoalMetadata";
import { GoalTasks } from "./GoalTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GoalCardProps {
  id: string;
  title: string;
  category: string;
  progress: number;
  deadline: string | null;
  priority: "High" | "Medium" | "Low";
  onEdit: (id: string) => void;
}

export function GoalCard({ id, title, category, progress, deadline, priority, onEdit }: GoalCardProps) {
  const queryClient = useQueryClient();

  const deleteGoal = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      if (error) throw error;
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate();
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <GoalHeader
        title={title}
        category={category}
        onEdit={() => onEdit(id)}
        onDelete={handleDelete}
      />
      <CardContent>
        <div className="space-y-4">
          <GoalProgress progress={progress} />
          <GoalMetadata deadline={deadline} priority={priority} />
          <GoalTasks goalId={id} />
        </div>
      </CardContent>
    </Card>
  );
}