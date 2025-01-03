import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { PurchaseRequired } from "@/components/dashboard/PurchaseRequired";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: hasPurchased, isLoading: checkingPurchase } = useQuery({
    queryKey: ['userPurchase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return !!data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  if (checkingPurchase) return null;

  return (
    <DashboardLayout>
      {hasPurchased ? (
        <DashboardContent />
      ) : (
        <PurchaseRequired />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;