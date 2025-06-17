#!/bin/bash

# Deploy SMS Edge Function to Supabase

echo "🚀 Deploying SMS Edge Function to Supabase..."

# Navigate to dashboard directory where the function is located
cd dashboard

# Link to your Supabase project (if not already linked)
echo "📎 Linking to Supabase project..."
# Uncomment and add your project ref if needed:
# supabase link --project-ref YOUR_PROJECT_REF

# Deploy the SMS function
echo "📤 Deploying send-invoice-sms function..."
supabase functions deploy send-invoice-sms

# Check deployment status
echo "✅ Deployment complete!"
echo ""
echo "🔧 To test the SMS function:"
echo "1. Go to your dashboard at https://dashboard.bowerycreativeagency.com"
echo "2. Navigate to Billing Admin → Invoices tab"
echo "3. Find Dr. Pedro's invoice (SVC-2025-001)"
echo "4. Click the SMS icon (📱) to send"
echo ""
echo "📱 SMS will be sent from: +18454090692"
echo "💰 Payment link format: https://start.bowerycreativeagency.com/pay/[invoice-id]"