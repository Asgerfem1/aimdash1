import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { GoalCard } from "@/components/GoalCard";
import { PlusCircle } from "lucide-react";

const mockGoals = [
  {
    title: "Launch MVP",
    category: "Career",
    progress: 75,
    deadline: "Mar 30, 2024",
    priority: "High" as const,
  },
  {
    title: "Learn TypeScript",
    category: "Learning",
    progress: 45,
    deadline: "Apr 15, 2024",
    priority: "Medium" as const,
  },
  {
    title: "Run 5K",
    category: "Fitness",
    progress: 60,
    deadline: "May 1, 2024",
    priority: "Low" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-100">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-700">AimDash</h1>
            <p className="text-muted-foreground">Track your goals, achieve more.</p>
          </div>
          <Button className="bg-primary hover:bg-primary-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>

        <DashboardStats />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Active Goals</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockGoals.map((goal) => (
              <GoalCard key={goal.title} {...goal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;