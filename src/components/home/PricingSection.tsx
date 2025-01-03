import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface PricingSectionProps {
  purchaseStatus?: {
    hasPurchased: boolean;
  };
}

export const PricingSection = ({ purchaseStatus }: PricingSectionProps) => {
  const navigate = useNavigate();
  const user = useUser();
  const session = useSession();

  const pricingPlan = {
    name: "Lifetime Access",
    price: "$24",
    description: "One-time payment for all features",
    features: [
      "Unlimited goals",
      "Goal progress tracking",
      "Task management",
      "Priority levels",
      "Recurring goals",
      "Visual analytics",
      "Custom categories"
    ],
  };

  const handleAction = async () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (purchaseStatus?.hasPurchased) {
      navigate("/dashboard");
      return;
    }

    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: {},
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw new Error(response.error.message);
      const { url } = response.data;
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
          Simple, One-Time Pricing
        </h2>
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-primary shadow-xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">{pricingPlan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{pricingPlan.price}</span>
                <span className="text-gray-600"> one-time</span>
              </div>
              <p className="text-gray-600 mb-6">{pricingPlan.description}</p>
              <ul className="space-y-3 mb-6">
                {pricingPlan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle2 className="text-primary mr-2 h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                onClick={handleAction}
              >
                {!user ? "Sign Up" : purchaseStatus?.hasPurchased ? "Go to Dashboard" : "Buy Now"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};