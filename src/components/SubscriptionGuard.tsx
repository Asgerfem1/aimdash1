import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useEffect } from "react";
import { toast } from "sonner";

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const user = useUser();
  const { data: isSubscribed, isLoading, error } = useSubscriptionStatus();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isLoading && !isSubscribed && !error) {
      toast.error("Please subscribe to access the dashboard");
      navigate("/");
    }
  }, [user, isSubscribed, isLoading, error, navigate]);

  if (isLoading || !isSubscribed) {
    return null;
  }

  return <>{children}</>;
};