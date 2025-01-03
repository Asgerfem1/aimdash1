import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    const completedGoals = {
      day: format(day, 'EEE'),
      High: 0,
      Medium: 0,
      Low: 0,
    };

    goals.forEach(goal => {
      if (!goal.last_completed_at) return;
      const completedDate = parseISO(goal.last_completed_at);
      if (isWithinInterval(completedDate, {
        start: day,
        end: new Date(day.getTime() + 24 * 60 * 60 * 1000 - 1),
      })) {
        completedGoals[goal.priority as keyof typeof completedGoals] += 1;
      }
    });

    return completedGoals;
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
              <Legend />
              <Bar dataKey="High" stackId="a" fill="#ef4444" name="High Priority" />
              <Bar dataKey="Medium" stackId="a" fill="#f97316" name="Medium Priority" />
              <Bar dataKey="Low" stackId="a" fill="#22c55e" name="Low Priority" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}