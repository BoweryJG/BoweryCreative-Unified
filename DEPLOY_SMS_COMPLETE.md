# Deploy SMS Function - Complete Guide

## Step 1: Get Your Project Reference

1. Go to https://app.supabase.com
2. Click on your project
3. Go to Settings → General
4. Copy the **Reference ID** (looks like: abcdefghijklmnop)

## Step 2: Link and Deploy

```bash
# Navigate to dashboard directory
cd dashboard

# Link to your project (replace YOUR_PROJECT_REF with your actual ref)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the SMS function
supabase functions deploy send-invoice-sms
```

## Step 3: Test SMS Sending

1. Go to your dashboard: https://dashboard.bowerycreativeagency.com
2. Log in with your Google account
3. Click "Billing Admin" in the sidebar
4. Click the "Invoices" tab
5. Find Dr. Pedro's invoice (SVC-2025-001)
6. Click the message icon (📱)
7. Review/edit the SMS message
8. Click "Send SMS"

## What Happens When You Send

- Real SMS sent via Twilio from +18454090692
- Message includes payment link
- SMS logged in database
- Client receives text with one-click payment

## Troubleshooting

If SMS doesn't send:
1. Check Supabase Dashboard → Functions → Logs
2. Verify Twilio credentials in Edge Functions secrets
3. Make sure phone number format is correct (+1XXXXXXXXXX)

## Payment Flow

When Dr. Pedro clicks the payment link in the SMS:
1. Goes to: https://start.bowerycreativeagency.com/pay/SVC-2025-001
2. Sees cosmic-themed payment portal
3. Enters payment details
4. Invoice marked as paid