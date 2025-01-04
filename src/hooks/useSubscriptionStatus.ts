import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useSubscriptionStatus = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();

  const { data } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleDashboardClick = async () => {
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

  return { data, handleDashboardClick };
};