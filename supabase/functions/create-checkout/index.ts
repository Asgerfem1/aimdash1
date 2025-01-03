import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Authentication failed')
    }

    const email = user.email
    if (!email) {
      console.error('No email found for user')
      throw new Error('No email found')
    }

    console.log('Creating checkout for user:', email)

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe key not found')
      throw new Error('Stripe configuration error')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    // Get the prices for the product
    console.log('Fetching product prices...')
    const prices = await stripe.prices.list({
      product: 'prod_PJwJCBGPzEbBXx',
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      console.error('No active price found for this product')
      throw new Error('No active price found for this product')
    }

    const priceId = prices.data[0].id
    console.log('Using price ID:', priceId)

    // Create or retrieve customer
    console.log('Looking up customer for email:', email)
    let customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length > 0) {
      customer = customers.data[0]
      console.log('Found existing customer:', customer.id)
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          supabase_user_id: user.id
        }
      })
      console.log('Created new customer:', customer.id)
    }

    // Create checkout session
    console.log('Creating checkout session...')
    const origin = req.headers.get('origin') || 'http://localhost:5173'
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/`,
      metadata: {
        supabase_user_id: user.id
      }
    });

    console.log('Checkout session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in create-checkout function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
});