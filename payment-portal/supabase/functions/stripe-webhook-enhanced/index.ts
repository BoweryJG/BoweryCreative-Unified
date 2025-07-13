import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get the client email and metadata
        const customerEmail = session.customer_email
        const metadata = session.metadata || {}
        
        if (customerEmail) {
          // Find the user
          const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(customerEmail)
          
          if (!userError && user) {
            // Update client account payment status
            if (metadata.client_account_id) {
              await supabase.rpc('complete_client_payment', {
                p_client_id: metadata.client_account_id,
                p_amount: (session.amount_total || 0) / 100
              })
            }
            
            // Grant dashboard access
            await supabase
              .from('authorized_clients')
              .upsert({
                email: customerEmail,
                authorized_by: 'system',
                authorized_at: new Date().toISOString(),
                access_level: 'full',
                metadata: {
                  payment_completed: true,
                  session_id: session.id,
                  amount: (session.amount_total || 0) / 100
                }
              }, {
                onConflict: 'email'
              })
            
            // Create initial campaigns if first payment
            await supabase.rpc('create_sample_campaigns', {
              p_user_id: user.user.id
            })
            
            console.log(`Dashboard access granted for ${customerEmail}`)
          }
        }
        
        // Create subscription if recurring
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          await supabase
            .from('subscriptions')
            .insert({
              user_id: metadata.user_id,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              metadata: subscription.metadata
            })
        }
        
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Update subscription status
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }
        
        // Log payment
        await supabase
          .from('payments')
          .insert({
            stripe_payment_intent_id: invoice.payment_intent as string,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: 'succeeded',
            customer_email: invoice.customer_email,
            metadata: {
              invoice_id: invoice.id,
              subscription_id: invoice.subscription
            }
          })
        
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
        
        // Optionally revoke dashboard access
        // This is commented out as you may want to keep access for a grace period
        /*
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
        
        if (sub?.user_id) {
          const { data: user } = await supabase.auth.admin.getUserById(sub.user_id)
          if (user?.user?.email) {
            await supabase
              .from('authorized_clients')
              .update({
                access_level: 'limited',
                metadata: { ...{}, subscription_canceled: true }
              })
              .eq('email', user.user.email)
          }
        }
        */
        
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})