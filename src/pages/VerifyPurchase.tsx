import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyPurchase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPurchase = async () => {
      try {
        const { error } = await supabase.functions.invoke("verify-purchase", {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        toast.success("Purchase successful! Welcome to AimDash!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify purchase. Please contact support.");
        navigate("/#pricing");
      }
    };

    if (sessionId) {
      verifyPurchase();
    } else {
      navigate("/#pricing");
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Verifying your purchase...</h1>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    </div>
  );
};

export default VerifyPurchase;