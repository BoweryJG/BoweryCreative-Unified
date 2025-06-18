import { supabase } from '../lib/supabase';

const STRIPE_PRICE_IDS = {
  foundation: {
    monthly: 'price_foundation_monthly', // Replace with your actual Stripe price IDs
    annual: 'price_foundation_annual',
  },
  transformation: {
    monthly: 'price_transformation_monthly',
    annual: 'price_transformation_annual',
  },
  dominance: {
    monthly: 'price_dominance_monthly',
    annual: 'price_dominance_annual',
  },
};

export const createCheckoutSession = async (
  planId: string,
  isAnnual: boolean
) => {
  try {
    const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS]?.[isAnnual ? 'annual' : 'monthly'];
    
    if (!priceId) {
      throw new Error('Invalid plan selected');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        successUrl: `${window.location.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscriptions`,
      },
    });

    if (error) throw error;
    
    if (data?.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getActiveSubscription = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

export const getPaymentHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId },
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};