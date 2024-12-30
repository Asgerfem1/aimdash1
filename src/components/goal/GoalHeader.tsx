import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface GoalHeaderProps {
  title: string;
  category: string;
  actions: ReactNode;
}

export function GoalHeader({ title, category, actions }: GoalHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex-1">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <Badge variant="outline" className="mt-2">
          {category}
        </Badge>
      </div>
      {actions}
    </CardHeader>
  );
}