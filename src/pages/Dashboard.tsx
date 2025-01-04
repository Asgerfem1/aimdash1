import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <SubscriptionGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </SubscriptionGuard>
  );
};

export default Dashboard;