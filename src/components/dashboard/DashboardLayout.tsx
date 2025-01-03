import { useState } from "react";
import { Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedView, setSelectedView] = useState<'goals' | 'analytics'>('goals');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar className="border-r">
            <div className="space-y-1 py-2 px-2">
              <Button
                variant={selectedView === 'goals' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm font-medium"
                onClick={() => setSelectedView('goals')}
              >
                Goals
              </Button>
              <Button
                variant={selectedView === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm font-medium"
                onClick={() => setSelectedView('analytics')}
              >
                Analytics
              </Button>
            </div>
          </Sidebar>
        </div>

        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Layout className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="space-y-1 py-2 px-2">
              <Button
                variant={selectedView === 'goals' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm font-medium"
                onClick={() => setSelectedView('goals')}
              >
                Goals
              </Button>
              <Button
                variant={selectedView === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm font-medium"
                onClick={() => setSelectedView('analytics')}
              >
                Analytics
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {selectedView === 'goals' ? children : <AnalyticsPage />}
        </div>
      </div>
    </SidebarProvider>
  );
}