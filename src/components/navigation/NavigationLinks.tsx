import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavigationLinksProps {
  isLoggedIn: boolean;
  hasPurchased: boolean;
  onScrollToSection: (sectionId: string) => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

export const NavigationLinks = ({
  isLoggedIn,
  hasPurchased,
  onScrollToSection,
  onLogout,
  onDashboardClick,
}: NavigationLinksProps) => {
  const navigate = useNavigate();

  return (
    <>
      {!isLoggedIn || !hasPurchased ? (
        <>
          <button 
            onClick={() => onScrollToSection('how-it-works')} 
            className="text-gray-600 hover:text-primary"
          >
            How It Works
          </button>
          <button 
            onClick={() => onScrollToSection('pricing')} 
            className="text-gray-600 hover:text-primary"
          >
            Pricing
          </button>
        </>
      ) : null}
      {isLoggedIn ? (
        <>
          <Button onClick={onDashboardClick}>
            {hasPurchased ? "Dashboard" : "Buy Now"}
          </Button>
          <Button variant="outline" onClick={onLogout}>
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
    </>
  );
};