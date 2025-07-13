#!/bin/bash

echo "🚀 Deploying Bowery Creative Billing System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from the payments directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "🗄️ Deploying Supabase functions..."
cd supabase/functions

# Deploy each admin function
functions=("admin-create-customer" "admin-send-setup-email" "admin-create-invoice" "admin-create-portal-session")

for func in "${functions[@]}"; do
    echo "  → Deploying $func..."
    supabase functions deploy $func
done

cd ../..

echo "📊 Running database migrations..."
supabase db push

echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Ensure environment variables are set in Supabase dashboard:"
echo "   - STRIPE_SECRET_KEY"
echo "   - RESEND_API_KEY"
echo "   - SITE_URL"
echo ""
echo "2. Test the admin dashboard at /dashboard (click Admin in menu)"
echo "3. Create a test customer before creating Dr. Greg Pedro"
echo ""
echo "📚 See BILLING_SETUP_GUIDE.md for detailed instructions"