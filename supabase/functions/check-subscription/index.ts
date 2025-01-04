import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      throw new Error('No authorization header')
    }

    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Using service role key for admin access
    )

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Get the user data
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError) {
      console.error('Error getting user data:', userError)
      throw new Error('Error getting user data')
    }

    if (!user) {
      console.error('No user found')
      throw new Error('No user found')
    }

    console.log('Successfully got user data:', { userId: user.id })

    // Check if user has purchased access
    const { data: purchaseData, error: purchaseError } = await supabaseAdmin
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (purchaseError) {
      console.error('Error checking purchase:', purchaseError)
    }

    console.log('Purchase check result:', { hasPurchase: !!purchaseData })

    // Return the subscription status
    return new Response(
      JSON.stringify({ 
        subscribed: !!purchaseData 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})