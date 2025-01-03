import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryProgress } from "./CategoryProgress";
import { ConsistencyChart } from "./ConsistencyChart";
import { OverallProgress } from "./OverallProgress";

export function AnalyticsPage() {
  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and stay motivated</p>
      </div>

      <div className="grid gap-6">
        <OverallProgress goals={goals || []} />
        <CategoryProgress goals={goals || []} />
        <ConsistencyChart goals={goals || []} />
      </div>
    </div>
  );
}