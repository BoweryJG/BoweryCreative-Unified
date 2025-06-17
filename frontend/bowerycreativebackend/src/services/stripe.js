import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Bowery Creative Product/Price IDs
export const BOWERY_PRODUCTS = {
  // Campaign Marketplace Credits
  campaignCredits: {
    10: process.env.STRIPE_PRICE_10_CREDITS || 'price_10_credits',
    50: process.env.STRIPE_PRICE_50_CREDITS || 'price_50_credits',
    100: process.env.STRIPE_PRICE_100_CREDITS || 'price_100_credits',
    500: process.env.STRIPE_PRICE_500_CREDITS || 'price_500_credits',
  },
  
  // Mission Control Subscriptions
  subscriptions: {
    starter: {
      monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
      annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || 'price_starter_annual',
    },
    professional: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_pro_annual',
    },
    agency: {
      monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY || 'price_agency_monthly',
      annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL || 'price_agency_annual',
    }
  },
  
  // Professional Services (one-time)
  services: {
    websiteRedesign: process.env.STRIPE_PRICE_WEBSITE_REDESIGN || 'price_website_redesign',
    brandingPackage: process.env.STRIPE_PRICE_BRANDING || 'price_branding',
    marketingSetup: process.env.STRIPE_PRICE_MARKETING_SETUP || 'price_marketing_setup',
    customProject: 'custom', // Will create payment intent with custom amount
  }
};

// Create a checkout session for client payments
export async function createCheckoutSession({
  clientId,
  clientEmail,
  productType,
  productId,
  quantity = 1,
  successUrl,
  cancelUrl,
  metadata = {}
}) {
  try {
    const sessionData = {
      payment_method_types: ['card'],
      customer_email: clientEmail,
      client_reference_id: clientId,
      metadata: {
        clientId,
        productType,
        ...metadata
      },
      success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment-cancelled`,
    };

    // Handle different product types
    if (productType === 'subscription') {
      sessionData.mode = 'subscription';
      sessionData.line_items = [{
        price: productId,
        quantity: 1,
      }];
      sessionData.subscription_data = {
        metadata: {
          clientId,
          productType,
        }
      };
    } else if (productType === 'credits' || productType === 'service') {
      sessionData.mode = 'payment';
      sessionData.line_items = [{
        price: productId,
        quantity: quantity,
      }];
    } else if (productType === 'custom') {
      // For custom amounts
      sessionData.mode = 'payment';
      sessionData.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: metadata.projectName || 'Custom Project',
            description: metadata.projectDescription || 'Professional services',
          },
          unit_amount: metadata.amount, // Amount in cents
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    
    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a customer portal session for subscription management
export async function createPortalSession(customerId, returnUrl) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.FRONTEND_URL}/dashboard`,
    });
    
    return {
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Create a payment intent for custom amounts
export async function createPaymentIntent({
  amount, // in cents
  clientId,
  clientEmail,
  description,
  metadata = {}
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: clientEmail,
      description,
      metadata: {
        clientId,
        ...metadata
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Process webhook events
export async function handleWebhook(event, signature) {
  try {
    // Verify webhook signature
    const webhookEvent = stripe.webhooks.constructEvent(
      event,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    return webhookEvent;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

// Get customer by email
export async function getOrCreateCustomer(email, metadata = {}) {
  try {
    // Search for existing customer
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });
    
    if (customers.data.length > 0) {
      return customers.data[0];
    }
    
    // Create new customer
    const customer = await stripe.customers.create({
      email,
      metadata,
    });
    
    return customer;
  } catch (error) {
    console.error('Error getting/creating customer:', error);
    throw error;
  }
}

// Create subscription for a customer
export async function createSubscription(customerId, priceId, trialDays = 0) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId, immediately = false) {
  try {
    if (immediately) {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } else {
      // Cancel at period end
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return subscription;
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export default stripe;