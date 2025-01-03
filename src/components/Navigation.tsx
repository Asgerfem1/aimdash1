import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useSupabaseClient, useUser, useSession } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { MobileMenu } from "./navigation/MobileMenu";

interface NavigationProps {
  purchaseStatus?: {
    hasPurchased: boolean;
  };
}

export const Navigation = ({ purchaseStatus }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDashboardClick = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (!purchaseStatus?.hasPurchased) {
      try {
        const response = await supabase.functions.invoke('create-checkout', {
          body: {},
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
            'X-Customer-Email': user.email
          }
        });
        
        if (response.error) throw new Error(response.error.message);
        const { url } = response.data;
        
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to initiate checkout. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    navigate("/dashboard");
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationLinks
              isLoggedIn={!!user}
              hasPurchased={!!purchaseStatus?.hasPurchased}
              onScrollToSection={scrollToSection}
              onLogout={handleLogout}
              onDashboardClick={handleDashboardClick}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          isLoggedIn={!!user}
          hasPurchased={!!purchaseStatus?.hasPurchased}
          onScrollToSection={scrollToSection}
          onLogout={handleLogout}
          onDashboardClick={handleDashboardClick}
        />
      </div>
    </nav>
  );
};