#!/bin/bash

echo "🚀 Deploying Integrated Billing System..."

# Navigate to backend directory
echo "📦 Deploying Supabase functions..."
cd backend

# Deploy admin functions
echo "  → Deploying admin-create-customer..."
supabase functions deploy admin-create-customer

echo "  → Deploying admin-send-setup-email..."
supabase functions deploy admin-send-setup-email

echo "  → Deploying admin-create-invoice..."
supabase functions deploy admin-create-invoice

echo "  → Deploying admin-create-portal-session..."
supabase functions deploy admin-create-portal-session

echo "📊 Running database migrations..."
supabase db push

# Navigate to dashboard directory
cd ../dashboard

echo "🔨 Building dashboard with billing..."
npm run build

echo "🌐 Deploying dashboard to Netlify..."
netlify deploy --prod

echo "✅ Integrated billing system deployed!"
echo ""
echo "🎯 Next steps:"
echo "1. Ensure environment variables are set in Supabase:"
echo "   - STRIPE_SECRET_KEY"
echo "   - RESEND_API_KEY"
echo "   - SITE_URL"
echo ""
echo "2. Access billing admin at your dashboard → 'Billing' menu"
echo "3. Create Dr. Greg Pedro with $2000/month billing"
echo ""
echo "📚 The billing system is now integrated into your existing dashboard!"