import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopMenu } from "./navigation/DesktopMenu";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const user = useUser();

  // Query to check if user has purchased
  const { data: hasPurchased, isLoading } = useQuery({
    queryKey: ['userPurchase', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking purchase status:', error);
        return false;
      }
      return !!data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // After successful logout, navigate to home page
      navigate("/", { replace: true });
      toast.success("Successfully logged out");
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Failed to log out");
    }
  };

  const handleDashboardClick = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (hasPurchased) {
      navigate("/dashboard");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const response = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      if (!response.data?.url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "Failed to start checkout process");
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-primary">
              AimDash
            </a>
          </div>

          <DesktopMenu 
            user={user}
            hasPurchased={hasPurchased}
            onScroll={scrollToSection}
            onDashboard={handleDashboardClick}
            onLogout={handleLogout}
            onLogin={() => navigate("/login")}
            onSignUp={() => navigate("/signup")}
          />

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          user={user}
          hasPurchased={hasPurchased}
          onScroll={scrollToSection}
          onDashboard={handleDashboardClick}
          onLogout={handleLogout}
          onLogin={() => navigate("/login")}
          onSignUp={() => navigate("/signup")}
        />
      </div>
    </nav>
  );
};
