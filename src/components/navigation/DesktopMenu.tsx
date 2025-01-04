import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface DesktopMenuProps {
  user: User | null;
  hasPurchased?: boolean;
  onScroll: (sectionId: string) => void;
  onDashboard: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export const DesktopMenu = ({
  user,
  hasPurchased,
  onScroll,
  onDashboard,
  onLogout,
  onLogin,
  onSignUp,
}: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <button 
        onClick={() => onScroll('how-it-works')} 
        className="text-gray-600 hover:text-primary"
      >
        How It Works
      </button>
      <button 
        onClick={() => onScroll('pricing')} 
        className="text-gray-600 hover:text-primary"
      >
        Pricing
      </button>
      {user ? (
        <>
          <Button onClick={onDashboard}>
            {hasPurchased ? "Dashboard" : "Buy Now"}
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onLogin}>
            Login
          </Button>
          <Button onClick={onSignUp}>Get Started</Button>
        </>
      )}
    </div>
  );
};