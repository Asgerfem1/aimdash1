import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <a href="#features" className="text-gray-600 hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </a>
            {user ? (
              <>
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
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
              <a
                href="#features"
                className="text-gray-600 hover:text-primary px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-primary px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-primary px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              {user ? (
                <>
                  <Button
                    className="justify-start"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
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