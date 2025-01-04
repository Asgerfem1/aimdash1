import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, ChartLine, ChartPie } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const HeroSection = () => {
  const navigate = useNavigate();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Query to check if user has purchased with proper caching
  const { data: hasPurchased, refetch } = useQuery({
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Check session status when returning from checkout
  useQuery({
    queryKey: ['checkoutSession', sessionId],
    queryFn: async () => {
      if (!sessionId || !user) return null;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No access token found');
        }

        const { data, error } = await supabase.functions.invoke('verify-session', {
          body: { sessionId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;

        if (data?.status === 'complete') {
          // Create purchase record
          const { error: purchaseError } = await supabase
            .from('user_purchases')
            .insert({ user_id: user.id });

          if (purchaseError) throw purchaseError;

          toast.success("Thank you for your purchase! Redirecting to dashboard...");
          await refetch(); // Refetch purchase status
          navigate("/dashboard");
        }

        return data;
      } catch (error) {
        console.error('Error verifying session:', error);
        toast.error("Failed to verify purchase. Please contact support.");
        return null;
      }
    },
    enabled: !!sessionId && !!user,
    gcTime: 0, // Don't cache this query
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

  const getButtonText = () => {
    if (!user) return "Get Started";
    if (hasPurchased) return "Go to Dashboard";
    return "Buy Now";
  };

  return (
    <section className="relative bg-gradient-to-b from-primary-100 to-white pt-32 pb-20 px-4 md:pt-40 overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Floating Symbols */}
        <div className="absolute top-20 left-[10%] text-primary-300 animate-float-slow">
          <CheckCircle2 size={32} />
        </div>
        <div className="absolute top-40 right-[15%] text-primary-400 animate-float-delayed">
          <BarChart3 size={40} />
        </div>
        <div className="absolute bottom-20 left-[20%] text-primary-300 animate-float">
          <ChartLine size={36} />
        </div>
        <div className="absolute top-60 right-[25%] text-primary-400 animate-float-slow">
          <ChartPie size={32} />
        </div>
        <div className="absolute bottom-40 right-[10%] text-primary-300 animate-float-delayed">
          <CheckCircle2 size={28} />
        </div>
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
            onClick={handleAction}
          >
            {getButtonText()} <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};