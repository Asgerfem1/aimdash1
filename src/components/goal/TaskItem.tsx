import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  goalId: string;
}

export function TaskItem({
  id,
  title,
  completed,
  goalId,
}: TaskItemProps) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const toggleTask = useMutation({
    mutationFn: async ({ completed }: { completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate both tasks and goals queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['tasks', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    },
  });

  return (
    <div 
      className="flex items-center gap-2 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => {
          toggleTask.mutate({ completed: checked as boolean });
        }}
      />
      <span className={`text-sm flex-1 ${completed ? 'line-through text-muted-foreground' : ''}`}>
        {title}
      </span>
      {isHovered && (
        <div className="flex items-center gap-1 absolute right-0 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={() => deleteTask.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}