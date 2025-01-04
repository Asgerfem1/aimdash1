import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: hasPurchased, isLoading } = useQuery({
    queryKey: ['userPurchase', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .single();
      return !!data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isLoading && !hasPurchased) {
      navigate('/#pricing');
    }
  }, [user, hasPurchased, isLoading, navigate]);

  if (!user || !hasPurchased) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;