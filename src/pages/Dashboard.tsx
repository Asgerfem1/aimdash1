import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/components/DashboardStats";
import { GoalCard } from "@/components/goal/GoalCard";
import { supabase } from "@/integrations/supabase/client";
import { GoalDialog } from "@/components/GoalDialog";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GoalFilters } from "@/components/dashboard/GoalFilters";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("deadline");

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      if (!user) throw new Error('User must be logged in');
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
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleEdit = (id: string) => {
    setSelectedGoalId(id);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGoalId(null);
    setIsDialogOpen(true);
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
      const deadline = new Date(goal.deadline);
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      return deadline <= threeDaysFromNow;
    }
    return false;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader onAddGoal={handleAddNew} />
        
        <div className="mt-8">
          <DashboardStats />
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
              categories={[...new Set(goals?.map(goal => goal.category) || [])]}
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
              {goals?.map((goal) => (
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
      </div>
    </div>
  );
};

export default Dashboard;
