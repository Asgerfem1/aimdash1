import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskItem } from "./TaskItem";

interface GoalTasksProps {
  goalId: string;
}

export function GoalTasks({ goalId }: GoalTasksProps) {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { data: tasks } = useQuery({
    queryKey: ['tasks', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title,
          goal_id: goalId,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', goalId] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setNewTaskTitle("");
      setIsAddingTask(false);
      toast.success('Task added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    },
  });

  const reorderTask = useMutation({
    mutationFn: async ({ taskId, newIndex }: { taskId: string; newIndex: number }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ created_at: new Date(Date.now() - newIndex * 1000).toISOString() })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', goalId] });
    },
    onError: (error) => {
      toast.error('Failed to reorder task');
      console.error('Error reordering task:', error);
    },
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask.mutate(newTaskTitle.trim());
    }
  };

  const handleMoveTask = (currentIndex: number, direction: 'up' | 'down') => {
    if (!tasks) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;
    
    const task = tasks[currentIndex];
    reorderTask.mutate({ taskId: task.id, newIndex });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Tasks</h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isAddingTask && (
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="h-8"
          />
          <Button type="submit" size="sm" className="h-8">
            Add
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {tasks?.map((task, index) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            completed={task.completed}
            goalId={goalId}
            onMoveUp={() => handleMoveTask(index, 'up')}
            onMoveDown={() => handleMoveTask(index, 'down')}
            isFirst={index === 0}
            isLast={index === tasks.length - 1}
          />
        ))}
      </div>
    </div>
  );
}