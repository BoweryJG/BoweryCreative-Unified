"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const supabase_js_1 = require("@supabase/supabase-js");
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Create a recurring subscription
router.post('/create', async (req, res) => {
    try {
        const { customer_email, customer_name, price_id, description } = req.body;
        // Create or retrieve customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: customer_email,
            limit: 1
        });
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        }
        else {
            customer = await stripe.customers.create({
                email: customer_email,
                name: customer_name,
                metadata: {
                    type: 'monthly_service',
                    service: 'ai_infrastructure'
                }
            });
        }
        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'AI Infrastructure Management',
                            description: description || 'Monthly AI infrastructure management and support services'
                        },
                        unit_amount: 200000, // $2,000 in cents
                        recurring: {
                            interval: 'month'
                        }
                    }
                }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                customer_name,
                service_type: 'ai_infrastructure',
                cancellation_policy: 'anytime_30_days_notice'
            }
        });
        // Save subscription to database
        await supabase.from('subscriptions').insert({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customer.id,
            customer_email,
            customer_name,
            amount: 2000,
            currency: 'usd',
            interval: 'month',
            status: subscription.status,
            description,
            metadata: {
                cancellation_policy: 'anytime_30_days_notice',
                systems_included: [
                    'Custom CRM System',
                    'AI Phone + Linguistics',
                    'Dental Simulators',
                    'Custom Website',
                    'AI Chatbot',
                    '24/7 Monitoring & Support'
                ]
            }
        });
        res.json({
            subscription_id: subscription.id,
            client_secret: subscription.latest_invoice.payment_intent.client_secret,
            customer_id: customer.id
        });
    }
    catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Cancel a subscription
router.post('/cancel', async (req, res) => {
    try {
        const { subscription_id, reason } = req.body;
        // Cancel at period end (allows 30 days notice)
        const subscription = await stripe.subscriptions.update(subscription_id, {
            cancel_at_period_end: true,
            metadata: {
                cancellation_reason: reason || 'customer_request',
                cancelled_at: new Date().toISOString()
            }
        });
        // Update database
        await supabase
            .from('subscriptions')
            .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            cancellation_reason: reason
        })
            .eq('stripe_subscription_id', subscription_id);
        // Send cancellation confirmation email
        const emailResponse = await fetch(`${process.env.BACKEND_URL}/api/emails/send-as-bowery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
            },
            body: JSON.stringify({
                alias: 'billing',
                to: subscription.customer.email,
                subject: 'Subscription Cancellation Confirmed',
                html: `
          <h2>Subscription Cancellation Confirmed</h2>
          <p>Dear ${subscription.metadata.customer_name},</p>
          <p>Your monthly AI infrastructure service subscription has been scheduled for cancellation.</p>
          
          <h3>Important Details:</h3>
          <ul>
            <li><strong>Service continues until:</strong> ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}</li>
            <li><strong>Final billing date:</strong> ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}</li>
            <li><strong>All systems remain active</strong> through the end of your billing period</li>
          </ul>
          
          <p>If you change your mind, you can reactivate your subscription anytime before the cancellation date.</p>
          
          <p>Thank you for being a valued client!</p>
        `,
            }),
        });
        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            final_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
        });
    }
    catch (error) {
        console.error('Subscription cancellation error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Reactivate a cancelled subscription
router.post('/reactivate', async (req, res) => {
    try {
        const { subscription_id } = req.body;
        const subscription = await stripe.subscriptions.update(subscription_id, {
            cancel_at_period_end: false,
            metadata: {
                reactivated_at: new Date().toISOString()
            }
        });
        // Update database
        await supabase
            .from('subscriptions')
            .update({
            status: 'active',
            cancelled_at: null,
            cancellation_reason: null
        })
            .eq('stripe_subscription_id', subscription_id);
        res.json({
            success: true,
            message: 'Subscription reactivated successfully'
        });
    }
    catch (error) {
        console.error('Subscription reactivation error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Get subscription details
router.get('/:subscription_id', async (req, res) => {
    try {
        const { subscription_id } = req.params;
        const subscription = await stripe.subscriptions.retrieve(subscription_id, {
            expand: ['customer', 'latest_invoice']
        });
        // Get from database too
        const { data: dbSubscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscription_id)
            .single();
        res.json({
            stripe: subscription,
            database: dbSubscription
        });
    }
    catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Webhook for subscription events
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log('Payment succeeded for subscription:', invoice.subscription);
                // Update subscription status
                await supabase
                    .from('subscriptions')
                    .update({
                    status: 'active',
                    last_payment_date: new Date().toISOString()
                })
                    .eq('stripe_subscription_id', invoice.subscription);
                break;
            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('Payment failed for subscription:', failedInvoice.subscription);
                // Update subscription status
                await supabase
                    .from('subscriptions')
                    .update({ status: 'past_due' })
                    .eq('stripe_subscription_id', failedInvoice.subscription);
                break;
            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                console.log('Subscription deleted:', deletedSubscription.id);
                // Update subscription status
                await supabase
                    .from('subscriptions')
                    .update({
                    status: 'cancelled',
                    cancelled_at: new Date().toISOString()
                })
                    .eq('stripe_subscription_id', deletedSubscription.id);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
