import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  format, isWithinInterval, parseISO, subDays, subMonths, subYears
} from 'date-fns';
import { Priority } from "@/types/goals";

interface ConsistencyChartProps {
  goals: any[];
  timeRange: "week" | "month" | "year";
  timeGranularity: "day" | "week" | "month";
}

// Define the shape of our chart data
interface DayData {
  label: string;
  High: number;
  Medium: number;
  Low: number;
  [key: string]: string | number; // Allow string indexing for dynamic priority access
}

export function ConsistencyChart({ goals, timeRange, timeGranularity }: ConsistencyChartProps) {
  const today = new Date();
  
  // Get start and end dates based on time range
  const getDateRange = () => {
    switch (timeRange) {
      case "week":
        return {
          start: startOfWeek(today),
          end: endOfWeek(today)
        };
      case "month":
        return {
          start: startOfMonth(subMonths(today, 1)),
          end: endOfMonth(today)
        };
      case "year":
        return {
          start: startOfYear(subYears(today, 1)),
          end: endOfYear(today)
        };
    }
  };

  // Get intervals based on granularity
  const getIntervals = (start: Date, end: Date) => {
    switch (timeGranularity) {
      case "day":
        return eachDayOfInterval({ start, end });
      case "week":
        return eachWeekOfInterval({ start, end });
      case "month":
        return eachMonthOfInterval({ start, end });
    }
  };

  // Format date based on granularity
  const formatDate = (date: Date) => {
    switch (timeGranularity) {
      case "day":
        return format(date, 'MMM d');
      case "week":
        return `Week ${format(date, 'w')}`;
      case "month":
        return format(date, 'MMM yyyy');
    }
  };

  const { start, end } = getDateRange();
  const intervals = getIntervals(start, end);
  
  const data = intervals.map(interval => {
    const completedGoals: DayData = {
      label: formatDate(interval),
      High: 0,
      Medium: 0,
      Low: 0,
    };

    goals.forEach(goal => {
      if (!goal.last_completed_at) return;
      const completedDate = parseISO(goal.last_completed_at);
      
      let intervalEnd;
      switch (timeGranularity) {
        case "day":
          intervalEnd = new Date(interval.getTime() + 24 * 60 * 60 * 1000 - 1);
          break;
        case "week":
          intervalEnd = endOfWeek(interval);
          break;
        case "month":
          intervalEnd = endOfMonth(interval);
          break;
      }

      if (isWithinInterval(completedDate, {
        start: interval,
        end: intervalEnd,
      })) {
        completedGoals[goal.priority as Priority] += 1;
      }
    });

    return completedGoals;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Consistency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" />
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