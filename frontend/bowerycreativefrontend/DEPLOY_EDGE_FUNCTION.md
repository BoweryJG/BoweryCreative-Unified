# Deploy Stripe Checkout Edge Function

## 1. Deploy the Edge Function to Supabase:

```bash
cd frontend/bowerycreativefrontend
npx supabase functions deploy create-checkout-session
```

## 2. Set the Stripe Secret Key:

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
```

You can find your Stripe secret key at: https://dashboard.stripe.com/test/apikeys

## 3. Test the Function:

After deployment, test links should work:
- https://bowerycreativeagency.com/pay?invoice=test-flow
- Or use real invoice links from Invoice Management

## 4. If you haven't set up Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF
```

Your project ref is the part of your Supabase URL before `.supabase.co`

## 5. Alternative: Set Secret in Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions
3. Add secret: `STRIPE_SECRET_KEY` with your Stripe secret key value