import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, BarChart3, Target } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

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

  const faqs = [
    {
      question: "How does AimDash work?",
      answer: "AimDash helps you set, track, and achieve your goals through an intuitive interface. Create goals, break them into tasks, and track your progress visually.",
    },
    {
      question: "What's included in the pricing?",
      answer: "Our simple one-time payment of $49 gives you lifetime access to all core features, including goal tracking, visual dashboards, and progress monitoring. No recurring fees or hidden costs.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard encryption and security measures to protect your data.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-100 to-white pt-32 pb-20 px-4 md:pt-40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-700 mb-6">
              Transform Your Goals into Reality
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track, visualize, and achieve your goals with powerful analytics and intuitive progress tracking.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

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

      {/* Product Demo Section */}
      <section className="py-20 px-4 bg-primary-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
            Powerful Goal Tracking
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Visualize Your Progress</h3>
              <p className="text-lg text-gray-600">
                Track your goals with intuitive dashboards and visual analytics. See your progress over time and stay motivated.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" />
                  Interactive goal tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" />
                  Progress visualization
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" />
                  Achievement milestones
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-xl">
              {/* Placeholder for product screenshot/demo */}
              <div className="aspect-video bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-primary-700">
            Simple, One-Time Pricing
          </h2>
          <Card className="max-w-md mx-auto border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
              <p className="text-4xl font-bold text-primary-700 mb-4">$49</p>
              <ul className="text-left space-y-4 mb-6">
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" size={20} />
                  Unlimited goal tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" size={20} />
                  Visual analytics dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" size={20} />
                  Progress monitoring tools
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="text-primary mr-2" size={20} />
                  No recurring fees ever
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
              >
                Get Lifetime Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-primary-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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
    </div>
  );
};

export default Index;