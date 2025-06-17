# Setup Instructions for Facebook Auth & Stripe Payments

## 1. Configure Facebook OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Find **Facebook** and click **Enable**
4. Enter your Facebook App credentials:
   - **App ID**: 959131993038809
   - **App Secret**: 6618606f27b2f5553a5404f6aa1d9688
5. Copy the **Redirect URL** shown (it will look like: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`)

## 2. Configure Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/959131993038809)
2. Go to **Facebook Login** → **Settings**
3. Add the Supabase redirect URL to **Valid OAuth Redirect URIs**
4. Save changes

## 3. Add Redirect URLs in Supabase

In Supabase **Authentication** → **URL Configuration**:
1. Add to **Redirect URLs**:
   - `http://localhost:5174/*` (for local development)
   - Your production domain when deployed (e.g., `https://yourdomain.com/*`)

## 4. Set up Environment Variables

Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 5. Deploy Supabase Functions

Deploy the Edge Functions for Stripe:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

Set the required secrets:
```bash
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 6. Configure Stripe

1. Create products and prices in Stripe Dashboard
2. Update the price IDs in `src/services/stripe.ts`
3. Set up webhook endpoint in Stripe:
   - URL: `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/stripe-webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

## 7. Apply Database Migrations

Run the migration to create payment tables:
```bash
supabase migration up
```

## How It Works

1. User clicks "Continue with Facebook" or "Continue with Google"
2. They authenticate and are redirected to `/dashboard`
3. System checks if they have a Stripe customer record
4. When they select a subscription plan:
   - Creates Stripe customer if needed
   - Redirects to Stripe Checkout
   - After payment, webhook updates database
   - User gets access to paid features

## Testing

1. Start the dev server: `npm run dev`
2. Click "Continue with Facebook"
3. Authenticate with Facebook
4. Go to Subscriptions page
5. Select a plan and complete checkout