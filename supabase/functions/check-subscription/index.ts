import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting subscription check...');

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header found');
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
    console.log('Got token, verifying user...');

    // Get user data directly from the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw new Error('Invalid token');
    }

    if (!user) {
      console.error('No user found');
      throw new Error('User not found');
    }

    console.log('Successfully got user data, checking purchases...');

    // Check if user has purchased access
    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (purchaseError) {
      console.error('Error checking purchase:', purchaseError);
      throw new Error('Error checking purchase status');
    }

    console.log('Purchase check complete:', { userId: user.id, hasPurchase: !!purchases });

    return new Response(
      JSON.stringify({ 
        subscribed: !!purchases,
        userId: user.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'No authorization header' ? 401 : 500,
      }
    );
  }
});