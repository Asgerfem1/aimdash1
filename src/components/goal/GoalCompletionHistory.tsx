import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths, subYears, format, isWithinInterval, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GoalCompletionHistoryProps {
  goalTitle: string;
  recurrenceInterval: "daily" | "weekly" | "monthly";
}

export function GoalCompletionHistory({ goalTitle, recurrenceInterval }: GoalCompletionHistoryProps) {
  const [intervals, setIntervals] = useState<Date[]>([]);
  const today = new Date();

  const { data: completions } = useQuery({
    queryKey: ['goal-completions', goalTitle, recurrenceInterval],
    queryFn: async () => {
      const startDate = recurrenceInterval === 'monthly' 
        ? subYears(today, 1)
        : recurrenceInterval === 'weekly'
          ? subMonths(today, 3)
          : startOfMonth(today);

      const { data, error } = await supabase
        .from('goals')
        .select('last_completed_at')
        .eq('title', goalTitle)
        .gte('last_completed_at', startDate.toISOString())
        .order('last_completed_at', { ascending: true });

      if (error) throw error;
      return data.map(d => d.last_completed_at);
    },
  });

  useEffect(() => {
    const calculateIntervals = () => {
      let dates: Date[] = [];
      
      switch (recurrenceInterval) {
        case 'daily':
          dates = eachDayOfInterval({
            start: startOfMonth(today),
            end: endOfMonth(today)
          });
          break;
        case 'weekly':
          dates = eachWeekOfInterval({
            start: subMonths(today, 3),
            end: today
          });
          break;
        case 'monthly':
          dates = eachMonthOfInterval({
            start: subYears(today, 1),
            end: today
          });
          break;
      }
      setIntervals(dates);
    };

    calculateIntervals();
  }, [recurrenceInterval, today]);

  const isCompleted = (date: Date) => {
    if (!completions) return false;
    
    return completions.some(completion => {
      const completionDate = parseISO(completion);
      return isWithinInterval(completionDate, {
        start: date,
        end: recurrenceInterval === 'daily' 
          ? date 
          : recurrenceInterval === 'weekly'
            ? new Date(date.setDate(date.getDate() + 6))
            : endOfMonth(date)
      });
    });
  };

  const getDateLabel = (date: Date) => {
    switch (recurrenceInterval) {
      case 'daily':
        return format(date, 'MMM d');
      case 'weekly':
        return `Week of ${format(date, 'MMM d')}`;
      case 'monthly':
        return format(date, 'MMMM yyyy');
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          View completion history
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Completion History</h4>
          <div className="flex flex-wrap gap-2">
            {intervals.map((date, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  isCompleted(date)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
                title={getDateLabel(date)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span>Not completed</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}