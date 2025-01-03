import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  hasPurchased: boolean;
  onScrollToSection: (sectionId: string) => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

export const MobileMenu = ({
  isOpen,
  isLoggedIn,
  hasPurchased,
  onScrollToSection,
  onLogout,
  onDashboardClick,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        {!isLoggedIn || !hasPurchased ? (
          <>
            <button
              onClick={() => onScrollToSection('how-it-works')}
              className="text-gray-600 hover:text-primary px-4 py-2 text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => onScrollToSection('pricing')}
              className="text-gray-600 hover:text-primary px-4 py-2 text-left"
            >
              Pricing
            </button>
          </>
        ) : null}
        {isLoggedIn ? (
          <>
            <Button
              className="justify-start"
              onClick={onDashboardClick}
            >
              {hasPurchased ? "Dashboard" : "Buy Now"}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={onLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="justify-start"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};