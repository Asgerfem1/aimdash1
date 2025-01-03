import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <section className="relative bg-gradient-to-b from-primary-100 to-white pt-32 pb-20 px-4 md:pt-40 overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center">
          <h1 className="font-outfit text-4xl md:text-6xl font-bold text-primary-700 mb-6">
            Transform Your Goals into Reality
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-outfit">
            Track, visualize, and achieve your goals with powerful analytics and intuitive progress tracking.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 font-outfit"
            onClick={() => navigate(user ? "/dashboard" : "/signup")}
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};