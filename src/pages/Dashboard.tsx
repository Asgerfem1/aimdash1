import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardStats } from "@/components/DashboardStats";
import { GoalCard } from "@/components/GoalCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="mt-2 text-gray-600">Start tracking your goals and progress</p>
        
        <div className="mt-8">
          <DashboardStats />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GoalCard
              title="Launch MVP"
              category="Business"
              progress={75}
              deadline="Mar 31, 2024"
              priority="High"
            />
            <GoalCard
              title="Learn React"
              category="Education"
              progress={45}
              deadline="Apr 15, 2024"
              priority="Medium"
            />
            <GoalCard
              title="Daily Exercise"
              category="Health"
              progress={90}
              deadline="Ongoing"
              priority="Low"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;