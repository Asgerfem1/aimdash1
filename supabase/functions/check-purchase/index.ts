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

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      throw new Error('No authorization header')
    }

    // Get the user from the token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    if (!user) {
      console.error('No user found')
      throw new Error('No user found')
    }

    if (!user.email) {
      console.error('No email found for user:', user.id)
      throw new Error('No email found')
    }

    console.log('Checking purchase status for user:', user.id, 'email:', user.email)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get the prices for the product
    const prices = await stripe.prices.list({
      product: 'prod_RWKzPGxzvL9Neb',
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      return new Response(
        JSON.stringify({ hasPurchased: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    console.log('Found customers:', customers.data.length)

    if (customers.data.length === 0) {
      console.log('No customer found for email:', user.email)
      return new Response(
        JSON.stringify({ hasPurchased: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Check for successful payments
    const payments = await stripe.paymentIntents.list({
      customer: customers.data[0].id,
      limit: 100
    });

    console.log('Found payments:', payments.data.length)

    const hasSuccessfulPayment = payments.data.some(payment => {
      console.log('Payment:', payment.id, 'Status:', payment.status, 'Product:', payment.metadata.product_id)
      return payment.status === 'succeeded' && 
             payment.metadata.product_id === 'prod_RWKzPGxzvL9Neb'
    });

    console.log('Has purchased:', hasSuccessfulPayment)

    return new Response(
      JSON.stringify({ hasPurchased: hasSuccessfulPayment }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error checking purchase:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})