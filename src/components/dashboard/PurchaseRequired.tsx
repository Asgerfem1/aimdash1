import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PurchaseRequired() {
  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      const { url, error } = await response.json();
      
      if (error) throw new Error(error);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Get Started with AimDash</h1>
        <p className="text-gray-600">
          Purchase a lifetime access to unlock all features and start achieving your goals.
        </p>
      </div>

      <Card className="p-6 border-2 border-primary shadow-xl max-w-lg mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Lifetime Access</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold">$24</span>
            <span className="text-gray-600"> one-time</span>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            "Unlimited goals",
            "Goal progress tracking",
            "Task management",
            "Priority levels",
            "Recurring goals",
            "Visual analytics",
            "Custom categories"
          ].map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className="text-primary mr-2 h-5 w-5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          className="w-full"
          size="lg"
          onClick={handleCheckout}
        >
          Buy Now
        </Button>
      </Card>
    </div>
  );
}