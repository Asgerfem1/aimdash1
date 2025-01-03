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
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user
    const email = user?.email

    if (!email) {
      throw new Error('No email found')
    }

    console.log('Checking purchase status for email:', email)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // First find the customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    console.log('Found customers:', customers.data.length)

    if (customers.data.length === 0) {
      console.log('No customer found')
      return new Response(
        JSON.stringify({ hasPurchased: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const customerId = customers.data[0].id
    console.log('Checking payments for customer:', customerId)

    // Check for successful payments using PaymentIntents
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100
    })

    console.log('Found payment intents:', paymentIntents.data.length)

    // Check if there's any successful payment
    const hasPurchased = paymentIntents.data.some(payment => {
      const isSuccessful = payment.status === 'succeeded' && payment.amount > 0
      console.log('Payment:', payment.id, 'Status:', payment.status, 'Amount:', payment.amount, 'Is successful:', isSuccessful)
      return isSuccessful
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