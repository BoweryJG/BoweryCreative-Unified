# BoweryCreative Integration Guide

## Current Architecture

You have 3 main applications:

### 1. **Admin Dashboard** (bowerycreative-dashboard.netlify.app)
- Located in `/dashboard/`
- Admin-only access
- Features:
  - Client management
  - Billing admin (create customers, send invoices)
  - Campaign management
  - Analytics
  - "Send Cosmic Onboarding" button

### 2. **Payment Portal** (start.bowerycreativeagency.com)
- Located in `/payments/`
- Customer-facing
- Features:
  - Cosmic onboarding flow (/onboarding)
  - Payment processing (/pay)
  - Admin dashboard access (/dashboard)
  - Client login

### 3. **Main Website** (bowerycreativeagency.com)
- Located in `/frontend/`
- Marketing site
- Public facing

## The Complete Flow

### For New Clients (e.g., Dr. Pedro):

1. **Admin initiates onboarding**:
   - Login to admin dashboard: https://bowerycreative-dashboard.netlify.app
   - Click "🚀 Send Cosmic Onboarding"
   - This opens: https://start.bowerycreativeagency.com/onboarding

2. **Client completes onboarding**:
   - Fills out cosmic onboarding form
   - Enters promo code (e.g., "PEDRO" for $2000/month)
   - Redirects to payment page: /pay?code=PEDRO&amount=2000

3. **Client sets up payment**:
   - Reviews invoice details
   - Clicks "Pay $2000.00"
   - Enters card details on Stripe
   - Payment confirmed

4. **Admin manages client**:
   - Back in admin dashboard
   - Go to "Billing" section
   - Can see client and send monthly invoices

## Quick Access URLs

### Admin Dashboard
```
https://bowerycreative-dashboard.netlify.app
```
- Login with your admin credentials
- Access all admin features including billing

### Payment Portal Admin
```
https://start.bowerycreativeagency.com/login
https://start.bowerycreativeagency.com/dashboard
```
- Secondary admin access
- Can also manage billing from here

### Client Onboarding
```
https://start.bowerycreativeagency.com/onboarding
```
- Send this to new clients
- Or use the button in admin dashboard

### Direct Payment Links
```
# Dr. Pedro ($2000/month)
https://start.bowerycreativeagency.com/pay?code=PEDRO

# Custom amount
https://start.bowerycreativeagency.com/pay?amount=1000&email=client@example.com
```

## Environment Variables

Make sure these are set in your Supabase project:
```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
RESEND_API_KEY=re_...
SITE_URL=https://bowerycreative-dashboard.netlify.app
```

## Testing the Flow

1. Go to admin dashboard
2. Click "Send Cosmic Onboarding"
3. Fill out form with test data
4. Use promo code "PEDRO"
5. Complete payment with Stripe test card: 4242 4242 4242 4242

## Common Issues

### "Admin dashboard not accessible"
- Make sure you're logged in with an admin account
- Check that your user has admin role in Supabase

### "Payment not processing"
- Verify Stripe keys are set in Supabase
- Check browser console for errors
- Ensure Supabase edge functions are deployed

### "Onboarding redirects to wrong place"
- The cosmic onboarding should redirect to /pay
- Check the CosmicOnboarding.tsx component in payments app

## Support

For issues with:
- Admin dashboard: Check `/dashboard/` code
- Payments: Check `/payments/` code
- Backend/API: Check `/backend/` code
- Database: Check Supabase dashboard