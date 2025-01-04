import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, BarChart3, Target } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const navigate = useNavigate();
  const user = useUser();
  const supabase = useSupabaseClient();

  // Query to check if user has purchased
  const { data: hasPurchased } = useQuery({
    queryKey: ['userPurchase', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking purchase status:', error);
        return false;
      }
      return !!data;
    },
    enabled: !!user,
  });

  const handleAction = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (hasPurchased) {
      navigate('/dashboard');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');

      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "Failed to start checkout process");
    }
  };

  const features = [
    {
      title: "Set Your Goals",
      description: "Define clear, actionable goals with deadlines and priorities",
      icon: Target,
    },
    {
      title: "Track Progress",
      description: "Monitor your progress with visual dashboards and metrics",
      icon: BarChart3,
    },
    {
      title: "Achieve Milestones",
      description: "Break down goals into manageable milestones and celebrate wins",
      icon: CheckCircle2,
    },
  ];

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
      "Progress notifications",
      "Custom categories"
    ],
  };

  return (
    <div className="min-h-screen font-outfit">
      <Navigation />
      <HeroSection />

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-primary mb-4">
                    <feature.icon size={40} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                  {hasPurchased ? "Go to Dashboard" : "Buy Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-100">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-700">
            Ready to Achieve Your Goals?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are transforming their goals into reality with AimDash.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={handleAction}
          >
            {hasPurchased ? "Go to Dashboard" : "Buy Now"} <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;