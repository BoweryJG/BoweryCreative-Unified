import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51PNwP6RuBqx4KHEuEJxDZGKfn0LJcqg4gfhFnYRgMF0WBSbaLDMLTjrFmY5LoMb0RcPnPqFAGpLM6vslCcfZPApD00FGOJmoWD'
);