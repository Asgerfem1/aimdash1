import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/DashboardStats";
import { GoalCard } from "@/components/goal/GoalCard";
import { GoalDialog } from "@/components/GoalDialog";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GoalFilters } from "@/components/dashboard/GoalFilters";
import { toast } from "sonner";
import { isWithinInterval, addDays, addWeeks, addMonths, parseISO } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";

export function DashboardContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to fetch goals');
        throw error;
      }
      return data;
    },
  });

  const handleEdit = (id: string) => {
    setSelectedGoalId(id);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGoalId(null);
    setIsDialogOpen(true);
  };

  const isGoalDueSoon = (goal: any) => {
    if (!goal.deadline) return false;
    
    const today = new Date();
    const deadlineDate = parseISO(goal.deadline);
    
    // For recurring goals, check based on recurrence interval
    if (goal.is_recurring) {
      switch (goal.recurrence_interval) {
        case 'daily':
          // Check if the deadline is today
          return isWithinInterval(deadlineDate, {
            start: today,
            end: addDays(today, 1)
          });
        
        case 'weekly':
          // Check if the deadline is within the current week
          return isWithinInterval(deadlineDate, {
            start: today,
            end: addWeeks(today, 1)
          });
        
        case 'monthly':
          // Check if the deadline is within the current month
          return isWithinInterval(deadlineDate, {
            start: today,
            end: addMonths(today, 1)
          });
        
        default:
          return false;
      }
    }
    
    // For non-recurring goals, check if due within 3 days
    return isWithinInterval(deadlineDate, {
      start: today,
      end: addDays(today, 3)
    });
  };

  const filteredGoals = goals?.filter((goal) => {
    if (priorityFilter !== "all" && goal.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && goal.category !== categoryFilter) return false;
    return true;
  });

  const sortedGoals = [...(filteredGoals || [])].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "priority":
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "progress":
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const categories = [...new Set(goals?.map(goal => goal.category) || [])];
  
  const todaysFocus = sortedGoals?.filter(goal => {
    if (goal.status === "Completed") return false;
    if (goal.priority === "High") return true;
    if (goal.deadline) {
      return isGoalDueSoon(goal);
    }
    return false;
  });

  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme updated",
      description: `Theme has been set to ${newTheme} mode`,
    });
  };

  return (
    <>
      <DashboardHeader onAddGoal={handleAddNew} />
      
      <div className="mt-8">
        <DashboardStats />
      </div>

      <div className="mt-8 flex items-center justify-end space-x-2 border-b pb-4">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch
          id="dark-mode"
          checked={theme === "dark"}
          onCheckedChange={handleThemeChange}
        />
      </div>

      {todaysFocus && todaysFocus.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Today's Focus</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todaysFocus.map((goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                category={goal.category}
                progress={goal.progress}
                deadline={goal.deadline}
                priority={goal.priority}
                isRecurring={goal.is_recurring}
                recurrenceInterval={goal.recurrence_interval}
                status={goal.status}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold">Your Goals</h2>
          <GoalFilters
            priorityFilter={priorityFilter}
            categoryFilter={categoryFilter}
            sortBy={sortBy}
            onPriorityChange={setPriorityFilter}
            onCategoryChange={setCategoryFilter}
            onSortChange={setSortBy}
            categories={categories}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading goals...</div>
        ) : goals?.length === 0 ? (
          <div className="text-center text-gray-600">
            No goals yet. Click the Add Goal button to get started!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                category={goal.category}
                progress={goal.progress}
                deadline={goal.deadline}
                priority={goal.priority}
                isRecurring={goal.is_recurring}
                recurrenceInterval={goal.recurrence_interval}
                status={goal.status}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goalId={selectedGoalId}
      />
    </>
  );
}
