import { useState } from "react";
import { Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedView, setSelectedView] = useState<'goals' | 'analytics'>('goals');

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar className="w-64 border-r">
          <div className="space-y-2 py-4">
            <Button
              variant={selectedView === 'goals' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedView('goals')}
            >
              Goals
            </Button>
            <Button
              variant={selectedView === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
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
            <Layout className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="space-y-2 py-4">
            <Button
              variant={selectedView === 'goals' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedView('goals')}
            >
              Goals
            </Button>
            <Button
              variant={selectedView === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
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
  );
}