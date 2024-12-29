import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Flag, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
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

const priorityColors = {
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
};

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
          <Progress value={progress} className="h-2" />
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
        </div>
      </CardContent>
    </Card>
  );
}