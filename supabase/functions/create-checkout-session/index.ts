import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting checkout session creation...');

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    console.log('Attempting to get user data...');
    
    // Get the user data using the admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError) {
      console.error('Error getting user data:', userError);
      throw userError;
    }

    if (!user) {
      console.error('No user found');
      throw new Error('No user found');
    }

    if (!user.email) {
      console.error('No email found for user:', user.id);
      throw new Error('No email found');
    }

    console.log('Successfully retrieved user data for ID:', user.id);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if user has already purchased
    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (purchaseError) {
      console.error('Error checking purchases:', purchaseError);
      throw purchaseError;
    }

    if (purchases && purchases.length > 0) {
      console.error('User has already purchased access');
      throw new Error('User has already purchased access');
    }

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    const price_id = "price_1QdHkRCrd02GcI0rC2Vmj6Kn";
    let customer_id = undefined;

    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      
      // Check for successful payments
      const payments = await stripe.paymentIntents.list({
        customer: customer_id,
        limit: 100
      });

      const hasValidPayment = payments.data.some(payment => 
        payment.status === 'succeeded' && 
        payment.amount === 2400 && // $24.00 in cents
        payment.currency === 'usd'
      );

      if (hasValidPayment) {
        throw new Error("Customer has already purchased access");
      }
    }

    console.log('Creating payment session...');
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : user.email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard`,
      cancel_url: `${req.headers.get('origin')}/`,
    });

    console.log('Payment session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});