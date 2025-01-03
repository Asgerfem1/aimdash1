import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, parseISO } from 'date-fns';

interface ConsistencyChartProps {
  goals: any[];
}

export function ConsistencyChart({ goals }: ConsistencyChartProps) {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const data = weekDays.map(day => {
    const completedGoals = goals.filter(goal => {
      if (!goal.last_completed_at) return false;
      const completedDate = parseISO(goal.last_completed_at);
      return isWithinInterval(completedDate, {
        start: day,
        end: new Date(day.getTime() + 24 * 60 * 60 * 1000 - 1),
      });
    }).length;

    return {
      day: format(day, 'EEE'),
      completed: completedGoals,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Consistency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}