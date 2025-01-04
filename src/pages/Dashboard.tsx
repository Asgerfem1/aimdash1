import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return { subscribed: false };
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If subscription data is loaded and user hasn't subscribed, redirect to pricing
    if (subscriptionData && !subscriptionData.subscribed) {
      navigate("/#pricing");
    }
  }, [user, navigate, subscriptionData]);

  // Don't render anything while checking subscription status
  if (!user || !subscriptionData?.subscribed) return null;

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;