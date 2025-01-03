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
    // Get the user's session
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

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

    // Find the customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    console.log('Found customers:', customers.data.length)

    if (customers.data.length === 0) {
      console.log('No customer found for email:', user.email)
      return new Response(
        JSON.stringify({ hasPurchased: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const customer = customers.data[0]
    console.log('Found customer:', customer.id)

    // Get all successful payments for this customer
    const payments = await stripe.paymentIntents.list({
      customer: customer.id,
      limit: 100
    })

    console.log('Found payments:', payments.data.length)

    // Check if there's any successful payment
    const hasPurchased = payments.data.some(payment => {
      console.log('Payment:', payment.id, 'Status:', payment.status)
      return payment.status === 'succeeded'
    })

    console.log('Has purchased:', hasPurchased)

    return new Response(
      JSON.stringify({ hasPurchased }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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