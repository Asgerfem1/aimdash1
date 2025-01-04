import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's no session, just navigate to home
      if (!session) {
        navigate("/", { replace: true });
        return;
      }
      
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
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