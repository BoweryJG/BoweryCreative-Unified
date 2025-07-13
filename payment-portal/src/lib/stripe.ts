import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Stripe API helpers
const API_URL = import.meta.env.VITE_API_URL;

export const createCheckoutSession = async (params: {
  productType: 'subscription' | 'credits' | 'service';
  productId: string;
  quantity?: number;
  metadata?: Record<string, string>;
}) => {
  const response = await fetch(`${API_URL}/api/stripe/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/dashboard`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
};

export const createPortalSession = async () => {
  const response = await fetch(`${API_URL}/api/stripe/portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      returnUrl: `${window.location.origin}/dashboard`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }

  return response.json();
};

// Product/Price definitions matching backend
export const PRODUCTS = {
  subscriptions: {
    foundation: {
      monthly: 'price_foundation_monthly',
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
  },
  credits: {
    10: 'price_10_credits',
    50: 'price_50_credits',
    100: 'price_100_credits',
    500: 'price_500_credits',
  },
  services: {
    websiteRedesign: 'price_website_redesign',
    brandingPackage: 'price_branding',
    marketingSetup: 'price_marketing_setup',
    customSolution: 'price_custom_solution',
  },
} as const;