# Supabase Environment Variables Setup

## Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Settings** (gear icon) → **Edge Functions**
4. Scroll to "Edge Functions Secrets"
5. Add these environment variables:
   ```
   TWILIO_ACCOUNT_SID = [Your AC... value]
   TWILIO_AUTH_TOKEN = [Your auth token]
   TWILIO_PHONE_NUMBER = +18454090692
   ```
6. Click "Save"

## Method 2: Supabase CLI

```bash
# First, link to your project
supabase link --project-ref [your-project-ref]

# Set secrets
supabase secrets set TWILIO_ACCOUNT_SID=[Your AC... value]
supabase secrets set TWILIO_AUTH_TOKEN=[Your auth token]
supabase secrets set TWILIO_PHONE_NUMBER=+18454090692

# Verify they're set
supabase secrets list
```

## Finding Your Project Reference

1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → General
4. Copy the "Reference ID" (looks like: abcdefghijklmnop)

## Deploy Edge Functions with Secrets

After setting environment variables:

```bash
# Deploy the SMS function
supabase functions deploy send-invoice-sms
```

## Testing

Once deployed, the SMS feature will automatically use these credentials when sending invoice texts.