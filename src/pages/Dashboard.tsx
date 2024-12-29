import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/components/DashboardStats";
import { GoalCard } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GoalDialog } from "@/components/GoalDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const { data: goals, isLoading } = useQuery({
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Track your goals and progress</p>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </div>
        
        <div className="mt-8">
          <DashboardStats />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
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