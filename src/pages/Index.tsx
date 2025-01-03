import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, BarChart3, Target } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";

const Index = () => {
  const navigate = useNavigate();
  const user = useUser();

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

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 5 active goals",
        "Basic progress tracking",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Best for serious goal achievers",
      features: [
        "Unlimited goals",
        "Advanced analytics",
        "Priority support",
        "Custom categories",
        "Goal sharing",
      ],
      highlighted: true,
    },
    {
      name: "Team",
      price: "$29.99",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Goal delegation",
        "Team analytics",
        "Admin controls",
      ],
    },
  ];

  return (
    <div className="min-h-screen font-outfit">
      <Navigation />
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
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
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.highlighted 
                    ? 'border-2 border-primary shadow-xl' 
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle2 className="text-primary mr-2 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => navigate(user ? "/dashboard" : "/signup")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            onClick={() => navigate(user ? "/dashboard" : "/signup")}
          >
            Start Your Journey <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;