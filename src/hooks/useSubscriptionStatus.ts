import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSubscriptionStatus = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();

  const { data, isError } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      
      try {
        // Get fresh session data
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          return { subscribed: false };
        }
        
        if (!sessionData.session) {
          console.log('No active session found');
          return { subscribed: false };
        }

        // Make sure we have a valid access token
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          return { subscribed: false };
        }

        if (!session) {
          console.log('No session after refresh');
          return { subscribed: false };
        }

        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }
        
        return data;
      } catch (error: any) {
        console.error('Subscription check error:', error);
        // Return false for subscription status on error
        return { subscribed: false };
      }
    },
    enabled: !!user,
    retry: 1,
  });

  const handleDashboardClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (data?.subscribed) {
      navigate("/dashboard");
      return;
    }

    try {
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;
      
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    }
  };

  return { 
    data: isError ? { subscribed: false } : data, 
    handleDashboardClick 
  };
};