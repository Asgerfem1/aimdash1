import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, CheckCircle2, BarChart3, Target, Clock } from "lucide-react";

const Index = () => {
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

  const testimonials = [
    {
      quote: "AimDash transformed how I track my fitness goals. The visual progress indicators keep me motivated!",
      author: "Sarah J.",
      role: "Fitness Enthusiast",
    },
    {
      quote: "Perfect for managing my career objectives. The milestone tracking feature is incredibly useful.",
      author: "Michael R.",
      role: "Product Manager",
    },
    {
      quote: "The best goal tracking app I've used. Simple yet powerful!",
      author: "Alex T.",
      role: "Entrepreneur",
    },
  ];

  const faqs = [
    {
      question: "How does AimDash work?",
      answer: "AimDash helps you set, track, and achieve your goals through an intuitive interface. Create goals, break them into tasks, and track your progress visually.",
    },
    {
      question: "What's included in the pricing?",
      answer: "Our simple one-time payment gives you access to all core features, including goal tracking, visual dashboards, and progress monitoring.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard encryption and security measures to protect your data.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-100 to-white py-20 px-4 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-700 mb-6">
              Transform Your Goals into Reality
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track, visualize, and achieve your goals with powerful analytics and intuitive progress tracking.
            </p>
            <Button size="lg" className="text-lg px-8">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-primary-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-700">
            What Our Users Say
          </h2>
          <Carousel className="max-w-xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6 text-center">
                      <p className="text-lg mb-4 text-gray-600">"{testimonial.quote}"</p>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-primary-700">
            Simple, Transparent Pricing
          </h2>
          <Card className="max-w-md mx-auto border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">One-Time Payment</h3>
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
              </ul>
              <Button className="w-full">Get Started Now</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-primary-100">
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
          <Button size="lg" className="text-lg px-8">
            Start Your Journey <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;