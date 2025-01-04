import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const user = useUser();

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      // Close mobile menu if open
      setIsMenuOpen(false);
      
      // Navigate to homepage and replace the current history entry
      navigate("/", { replace: true });
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to log out");
    }
  };

  const handleDashboardClick = async () => {
    if (subscriptionData?.subscribed) {
      navigate("/dashboard");
      setIsMenuOpen(false);
    } else {
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout-session');
        if (error) throw error;
        
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (error: any) {
        console.error('Checkout error:', error);
        toast.error(error.message || 'Failed to start checkout process');
      }
    }
  };

  const getDashboardButtonText = () => {
    if (subscriptionData?.subscribed) return "Dashboard";
    return "Buy Access";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // If not on the index page, navigate to index first
    if (location.pathname !== "/") {
      navigate("/");
      
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If already on index page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    
    // Close mobile menu if open
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
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-gray-600 hover:text-primary"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-gray-600 hover:text-primary"
            >
              Pricing
            </button>
            {user ? (
              <>
                <Button onClick={handleDashboardClick}>{getDashboardButtonText()}</Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-primary px-4 py-2 text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-primary px-4 py-2 text-left"
              >
                Pricing
              </button>
              {user ? (
                <>
                  <Button
                    className="justify-start"
                    onClick={handleDashboardClick}
                  >
                    {getDashboardButtonText()}
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="justify-start"
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};