import { useState } from "react";
import { LogOut, Target, BarChart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedView, setSelectedView] = useState<'goals' | 'analytics'>('goals');
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        {/* Thin Sidebar */}
        <div className="w-16 border-r bg-background flex flex-col items-center py-4 gap-8">
          <TooltipProvider delayDuration={0}>
            {/* Logout Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>

            {/* Goals Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedView('goals')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedView === 'goals' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Target className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Goals</p>
              </TooltipContent>
            </Tooltip>

            {/* Analytics Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedView('analytics')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedView === 'analytics' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BarChart className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Analytics</p>
              </TooltipContent>
            </Tooltip>

            {/* Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {selectedView === 'goals' ? children : <AnalyticsPage />}
        </div>
      </div>
    </SidebarProvider>
  );
}