import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-customer-email',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe key not found');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get customer email from headers
    const customerEmail = req.headers.get('X-Customer-Email');
    console.log('Customer email:', customerEmail);

    if (!customerEmail) {
      throw new Error('Customer email not found');
    }

    // Create or retrieve customer
    let customer;
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Found existing customer:', customer.id);
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
      });
      console.log('Created new customer:', customer.id);
    }

    // Get origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173';

    console.log('Creating checkout session...');
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AimDash Lifetime Access',
              description: 'One-time payment for all features',
            },
            unit_amount: 2400,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/`,
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});