#!/bin/bash

# Deploy the create-checkout-session function to Supabase

echo "Deploying create-checkout-session function..."

cd /Users/jasonsmacbookpro2022/BoweryCreative-Unified/frontend/bowerycreativefrontend

# Link to the project
supabase link --project-ref fiozmyoedptukpkzuhqm

# Deploy the function
supabase functions deploy create-checkout-session

echo "Function deployed!"
echo ""
echo "Now you need to set the STRIPE_SECRET_KEY in Supabase Dashboard:"
echo "1. Go to https://supabase.com/dashboard/project/fiozmyoedptukpkzuhqm/settings/functions"
echo "2. Add STRIPE_SECRET_KEY with your Stripe secret key (starts with sk_test_)"
echo ""
echo "Your payment links will work after setting the key!"