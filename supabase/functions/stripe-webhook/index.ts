import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Get customer email from the session
      const customerEmail = session.customer_details?.email;
      if (!customerEmail) {
        throw new Error('No customer email found in session');
      }

      // Get user ID from Supabase auth
      const { data: userData, error: userError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !userData) {
        throw new Error('Could not find user with email: ' + customerEmail);
      }

      // Record the purchase
      const { error: purchaseError } = await supabaseAdmin
        .from('user_purchases')
        .insert({
          user_id: userData.id,
        });

      if (purchaseError) {
        throw new Error('Failed to record purchase: ' + purchaseError.message);
      }

      console.log('Successfully recorded purchase for user:', userData.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({
        error: {
          message: err.message,
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});