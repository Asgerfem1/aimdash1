import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Flag, Pencil, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface GoalCardProps {
  id: string;
  title: string;
  category: string;
  progress: number;
  deadline: string | null;
  priority: "High" | "Medium" | "Low";
  onEdit: (id: string) => void;
}

const priorityColors = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

export function GoalCard({ id, title, category, progress, deadline, priority, onEdit }: GoalCardProps) {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { data: tasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

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

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title,
          goal_id: id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
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

  const toggleTask = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate();
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask.mutate(newTaskTitle.trim());
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <Badge variant="outline" className="mt-2">
            {category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{deadline ? new Date(deadline).toLocaleDateString() : 'No deadline'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className={`h-4 w-4 ${priorityColors[priority]}`} />
              <span className={priorityColors[priority]}>{priority}</span>
            </div>
          </div>

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
              {tasks?.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => {
                      toggleTask.mutate({ taskId: task.id, completed: checked as boolean });
                    }}
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}