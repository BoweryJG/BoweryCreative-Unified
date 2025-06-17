# Bowery Creative Billing System Setup Guide

## Overview
I've built a comprehensive billing and invoicing system for your clients. Here's everything you need to know to get started with Dr. Greg Pedro and future customers.

## What's Been Built

### 1. Admin Dashboard
- **Location**: When logged in as admin, you'll see an "Admin" menu item in the dashboard
- **Features**:
  - Customer management (create, edit, view)
  - Invoice generation and sending
  - Custom billing amounts
  - Payment history tracking
  - Customer portal link generation

### 2. Customer Portal Features
- Secure login for clients
- View and pay invoices
- Manage payment methods
- View billing history
- Access to Stripe customer portal

### 3. Automated Features
- Welcome emails with billing setup links
- Invoice generation with PDF export
- Stripe integration for payments
- API usage tracking (optional per customer)

## Setting Up Dr. Greg Pedro ($2000/month)

### Step 1: Access Admin Dashboard
1. Go to https://start.bowerycreativeagency.com
2. Log in with your admin email (jasonwilliamgolden@gmail.com)
3. Click on "Admin" in the left sidebar

### Step 2: Create Customer
1. Click "Add Customer" button
2. Fill in:
   - Full Name: Dr. Greg Pedro
   - Email: [his email]
   - Company Name: [his practice name]
   - Monthly Billing Amount: 2000
   - Billing Cycle: Monthly
   - ✓ Track API Usage (if needed)
   - ✓ Create Stripe Customer
   - ✓ Send Welcome Email
3. Click "Create Customer"

### Step 3: What Happens Next
- Dr. Greg Pedro receives a welcome email with a secure link
- He clicks the link to set up his payment method
- His card is saved securely in Stripe
- You can now send him monthly invoices

### Step 4: Send First Invoice
1. In Admin Dashboard, find Dr. Greg Pedro
2. Click the invoice icon (📤)
3. Review/edit line items (defaults to monthly service)
4. Click "Send Invoice"
5. He receives an email with a payment link

## Deploying the System

### 1. Deploy Supabase Functions
```bash
cd payments
supabase functions deploy admin-create-customer
supabase functions deploy admin-send-setup-email
supabase functions deploy admin-create-invoice
supabase functions deploy admin-create-portal-session
```

### 2. Run Database Migrations
```bash
supabase db push
```

### 3. Environment Variables Needed
Make sure these are set in your Supabase project:
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `SITE_URL` (your domain)

### 4. Configure Stripe
1. Set up Stripe billing portal in Stripe Dashboard
2. Configure webhook endpoints if not already done
3. Ensure products/prices are created for subscriptions

## Features for Future Enhancement

### Customer Self-Service Portal (In Progress)
- Clients can log in to view all invoices
- Download invoice PDFs
- Update payment methods
- View usage statistics

### Advanced Features
- Recurring invoice automation
- Usage-based billing with API tracking
- Multi-currency support
- Tax calculation integration

## API Usage Tracking
For clients who need API usage tracking:
1. Enable "Track API Usage" when creating customer
2. System tracks:
   - Daily/monthly request counts
   - Endpoint usage
   - Response times
   - Rate limiting
3. Can set custom limits and overage pricing

## Email Templates
The system sends professional emails for:
- Welcome/setup instructions
- Invoice notifications
- Payment confirmations
- Payment reminders

## Security Features
- Admin-only access to billing functions
- Secure payment processing via Stripe
- Row-level security in database
- Encrypted customer data

## Testing the Flow
1. Create a test customer first
2. Use Stripe test cards (4242 4242 4242 4242)
3. Verify emails are sent correctly
4. Test invoice payment flow
5. Check customer portal access

## Support & Troubleshooting
- Check Supabase logs for function errors
- Verify Stripe webhook is receiving events
- Ensure email domain is verified in Resend
- Check browser console for frontend errors

## Next Steps
1. Deploy the updated code
2. Run database migrations
3. Test with a demo customer
4. Create Dr. Greg Pedro's account
5. Send first invoice

The system is designed to provide that "stunning, memorable, seamless" experience you wanted, with a professional look and smooth payment flow.