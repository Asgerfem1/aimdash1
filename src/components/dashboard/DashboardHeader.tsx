import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onAddGoal: () => void;
}

export function DashboardHeader({ onAddGoal }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your goals and progress</p>
      </div>
      <Button onClick={onAddGoal} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Goal
      </Button>
    </div>
  );
}