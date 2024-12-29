import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const activeGoals = goals?.filter(goal => goal.status !== 'Completed')?.length || 0;
  const completedGoals = goals?.filter(goal => goal.status === 'Completed')?.length || 0;
  const upcomingDeadlines = goals?.filter(goal => {
    if (!goal.deadline) return false;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const inNextWeek = new Date();
    inNextWeek.setDate(today.getDate() + 7);
    return deadline >= today && deadline <= inNextWeek;
  })?.length || 0;

  const nextDeadline = goals
    ?.filter(goal => goal.status !== 'Completed' && goal.deadline)
    ?.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeGoals}</div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">
            {nextDeadline ? `Next: ${nextDeadline.title}` : 'No upcoming deadlines'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
          <CheckCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedGoals}</div>
          <p className="text-xs text-muted-foreground">Total completed</p>
        </CardContent>
      </Card>
    </div>
  );
}