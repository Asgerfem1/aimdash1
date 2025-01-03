import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  const { data: purchaseStatus, isLoading } = useQuery({
    queryKey: ['purchaseStatus'],
    queryFn: async () => {
      if (!user) return { hasPurchased: false };
      const response = await supabase.functions.invoke('check-purchase', {
        body: {},
      });
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isLoading && !purchaseStatus?.hasPurchased) {
      toast.error("Please purchase a subscription to access the dashboard");
      navigate("/");
    }
  }, [user, navigate, purchaseStatus, isLoading]);

  if (!user || !purchaseStatus?.hasPurchased) return null;

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;