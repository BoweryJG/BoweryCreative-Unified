import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { invoice_id } = await req.json()

    // Get invoice from database
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single()

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: invoice.line_items.map((item: any) => ({
        price_data: {
          currency: invoice.currency || 'usd',
          product_data: {
            name: item.description,
          },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `https://bowerycreativeagency.com/payment-success?invoice=${invoice_id}`,
      cancel_url: `https://bowerycreativeagency.com/payment-cancelled?invoice=${invoice_id}`,
      metadata: {
        invoice_id: invoice_id,
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id,
      },
      customer_email: invoice.client_email,
    })

    // Update invoice with payment link
    await supabaseAdmin
      .from('invoices')
      .update({ 
        payment_link: session.url,
        stripe_checkout_session_id: session.id,
      })
      .eq('id', invoice_id)

    return new Response(
      JSON.stringify({ 
        payment_link: session.url,
        session_id: session.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment link:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})