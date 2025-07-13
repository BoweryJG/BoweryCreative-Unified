# BoweryCreative Payment Portal

## 🎯 Purpose
Client-facing payment processing portal for BoweryCreative Agency. 

**This portal is ONLY for clients to pay invoices, subscribe to plans, and purchase credit packages.**

## 🚀 Features
- **Invoice Payment** - Clients can pay specific invoices via `/pay/:invoiceId`
- **Subscription Plans** - Choose and subscribe to monthly/annual plans
- **Credit Packages** - Purchase credit bundles for services
- **Stripe Integration** - Secure payment processing
- **Success/Cancel Pages** - Clear payment status feedback

## 🛠️ Tech Stack
- React + TypeScript
- Material-UI
- Stripe Elements
- Supabase (read-only for invoice details)
- Vite

## 📁 Project Structure
```
payment-portal/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── PaymentPage.tsx       # Invoice payment
│   │   ├── PaymentSuccess.tsx    # Success page
│   │   ├── PaymentCancel.tsx     # Cancel page
│   │   ├── subscriptions/        # Subscription selection
│   │   └── credits/              # Credit packages
│   ├── contexts/
│   ├── lib/
│   └── theme/
```

## 🚀 Quick Start
```bash
cd payment-portal
npm install
npm run dev
```

Visit http://localhost:5174

## 🔗 Payment Flow
1. Client receives invoice email with payment link
2. Link format: `https://pay.bowerycreative.com/pay/INV-123`
3. Client views invoice details and pays
4. Redirected to success/cancel page
5. Payment recorded in database

## ⚠️ Important Notes
- This is a PUBLIC portal - no admin features
- All invoice/client management happens in Mission Control
- Only payment processing happens here
- Minimal authentication (just for payment security)

## 🌐 Environment Variables
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_APP_URL=https://pay.bowerycreative.com
```

## 📊 Database Access
Read-only access to:
- `invoices` - To display invoice details
- `subscription_plans` - Available plans
- `credit_packages` - Available packages

Write access to:
- `payments` - Record successful payments
- `payment_intents` - Track payment attempts