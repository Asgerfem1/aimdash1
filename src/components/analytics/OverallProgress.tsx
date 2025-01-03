import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OverallProgressProps {
  goals: any[];
}

export function OverallProgress({ goals }: OverallProgressProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.status === 'Completed').length;
  const inProgressGoals = goals.filter(goal => goal.status === 'In Progress').length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Completion Rate</span>
              <span>{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalGoals}</div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{completedGoals}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{inProgressGoals}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}