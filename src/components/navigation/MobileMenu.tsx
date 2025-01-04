import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  hasPurchased?: boolean;
  onScroll: (sectionId: string) => void;
  onDashboard: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export const MobileMenu = ({
  isOpen,
  user,
  hasPurchased,
  onScroll,
  onDashboard,
  onLogout,
  onLogin,
  onSignUp,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => onScroll('how-it-works')}
          className="text-gray-600 hover:text-primary px-4 py-2 text-left"
        >
          How It Works
        </button>
        <button
          onClick={() => onScroll('pricing')}
          className="text-gray-600 hover:text-primary px-4 py-2 text-left"
        >
          Pricing
        </button>
        {user ? (
          <>
            <Button
              className="justify-start"
              onClick={onDashboard}
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
              onClick={onLogin}
            >
              Login
            </Button>
            <Button
              className="justify-start"
              onClick={onSignUp}
            >
              Get Started
            </Button>
          </>
        )}
      </div>
    </div>
  );
};