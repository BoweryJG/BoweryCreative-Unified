import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { mode, line_items, success_url, cancel_url, metadata } = await req.json()

    console.log('Creating checkout session:', { mode, line_items, metadata })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: mode || 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url,
      cancel_url,
      metadata,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: 'required',
    })

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
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
})