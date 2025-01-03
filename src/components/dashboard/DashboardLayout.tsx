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
import { SettingsView } from "@/components/settings/SettingsView";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedView, setSelectedView] = useState<'goals' | 'analytics' | 'settings'>('goals');
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const currentContent = selectedView === 'goals' 
    ? children 
    : selectedView === 'analytics'
      ? <AnalyticsPage />
      : <SettingsView />;

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        {/* Thin Sidebar */}
        <div className="sidebar w-16 border-r flex flex-col items-center py-4 gap-8">
          <TooltipProvider delayDuration={0}>
            {/* Logout Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="sidebar-button p-2 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
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
                  className={`sidebar-button p-2 rounded-md ${
                    selectedView === 'goals' ? 'active' : ''
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
                  className={`sidebar-button p-2 rounded-md ${
                    selectedView === 'analytics' ? 'active' : ''
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
                  onClick={() => setSelectedView('settings')}
                  className={`sidebar-button p-2 rounded-md ${
                    selectedView === 'settings' ? 'active' : ''
                  }`}
                >
                  <Settings className="h-5 w-5" />
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
          {currentContent}
        </div>
      </div>
    </SidebarProvider>
  );
}