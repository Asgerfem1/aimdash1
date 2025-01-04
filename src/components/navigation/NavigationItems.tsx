import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useLogout } from "@/hooks/useLogout";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface NavigationItemsProps {
  onItemClick?: () => void;
  className?: string;
}

export const NavigationItems = ({ onItemClick, className = "" }: NavigationItemsProps) => {
  const navigate = useNavigate();
  const user = useUser();
  const { handleLogout } = useLogout();
  const { data: subscriptionData, handleDashboardClick } = useSubscriptionStatus();

  return (
    <div className={`flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8 ${className}`}>
      <button 
        onClick={() => {
          onItemClick?.();
          const element = document.getElementById('how-it-works');
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-gray-600 hover:text-primary text-left px-4 py-2 md:p-0"
      >
        How It Works
      </button>
      <button 
        onClick={() => {
          onItemClick?.();
          const element = document.getElementById('pricing');
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-gray-600 hover:text-primary text-left px-4 py-2 md:p-0"
      >
        Pricing
      </button>
      {user ? (
        <>
          <Button
            className="justify-start md:justify-center"
            onClick={() => {
              handleDashboardClick();
              onItemClick?.();
            }}
          >
            {subscriptionData?.subscribed ? "Dashboard" : "Buy Access"}
          </Button>
          <Button
            variant="outline"
            className="justify-start md:justify-center"
            onClick={() => {
              handleLogout();
              onItemClick?.();
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            className="justify-start md:justify-center"
            onClick={() => {
              navigate("/login");
              onItemClick?.();
            }}
          >
            Login
          </Button>
          <Button
            className="justify-start md:justify-center"
            onClick={() => {
              navigate("/signup");
              onItemClick?.();
            }}
          >
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};