import React from 'react';
import { useSearchParams } from "react-router-dom";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  const user = useUser();
  const session = useSession();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const { data: purchaseStatus, refetch } = useQuery({
    queryKey: ['purchaseStatus'],
    queryFn: async () => {
      if (!user || !session) return { hasPurchased: false };
      
      console.log('Checking purchase status with session token');
      const response = await supabase.functions.invoke('check-purchase', {
        body: {},
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (response.error) {
        console.error('Purchase check error:', response.error);
        throw response.error;
      }
      console.log('Purchase status response:', response.data);
      return response.data;
    },
    enabled: !!user && !!session,
  });

  // Check payment status and refetch purchase status
  React.useEffect(() => {
    if (paymentStatus === 'success') {
      refetch();
      toast.success('Payment successful! Welcome to AimDash.');
    }
  }, [paymentStatus, refetch]);

  return (
    <div className="min-h-screen font-outfit">
      <Navigation purchaseStatus={purchaseStatus} />
      <HeroSection purchaseStatus={purchaseStatus} />
      <FeaturesSection />
      <PricingSection purchaseStatus={purchaseStatus} />
      <CTASection 
        purchaseStatus={purchaseStatus}
        onAction={() => {
          const pricingElement = document.getElementById('pricing');
          if (pricingElement) {
            pricingElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      <Footer />
    </div>
  );
};

export default Index;