import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryProgressProps {
  goals: any[];
}

export function CategoryProgress({ goals }: CategoryProgressProps) {
  const categories = [...new Set(goals.map(goal => goal.category))];
  
  const categoryStats = categories.map(category => {
    const categoryGoals = goals.filter(goal => goal.category === category);
    const completed = categoryGoals.filter(goal => goal.status === 'Completed').length;
    const total = categoryGoals.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      category,
      progress,
      completed,
      total
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map(stat => (
            <div key={stat.category}>
              <div className="flex justify-between mb-2">
                <span>{stat.category}</span>
                <span>{stat.progress.toFixed(1)}%</span>
              </div>
              <Progress value={stat.progress} className="h-2" />
              <div className="text-sm text-muted-foreground mt-1">
                {stat.completed} of {stat.total} completed
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}