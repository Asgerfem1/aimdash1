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
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          body: { user_id: user.id },
        });
        
        if (error) {
          console.error('Subscription check error:', error);
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Subscription check error:', error);
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
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { user_id: user.id },
      });
      
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