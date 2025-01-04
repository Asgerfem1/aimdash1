import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Navigate to homepage and replace the current history entry
      navigate("/", { replace: true });
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if there's an error, we should still redirect to home
      navigate("/", { replace: true });
      toast.error("There was an issue logging out, but you've been redirected home");
    }
  };

  return { handleLogout };
};