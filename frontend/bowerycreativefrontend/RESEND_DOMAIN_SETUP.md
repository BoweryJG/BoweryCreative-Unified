# Resend Domain Verification Setup

## Current Status
- ✅ Resend API key configured (restricted to sending emails only)
- ⚠️ Domain verification requires full access API key

## Required Steps

### 1. Create Full Access API Key
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key with **full access** (not just sending)
3. Replace the current restricted key in environment variables

### 2. Add Domain for Verification
```bash
curl -X POST https://api.resend.com/domains \
  -H "Authorization: Bearer YOUR_FULL_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bowerycreativeagency.com"
  }'
```

### 3. Expected Response
```json
{
  "id": "domain_id",
  "name": "bowerycreativeagency.com",
  "status": "not_started",
  "records": [
    {
      "record": "TXT",
      "name": "resend._domainkey.bowerycreativeagency.com",
      "value": "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
    }
  ]
}
```

### 4. DNS Configuration
Add the returned DNS records to your domain provider:

**For bowerycreativeagency.com:**
- Add the TXT record for DKIM verification
- Add SPF record if not already present: `v=spf1 include:_spf.resend.com ~all`
- Add DMARC record if desired: `v=DMARC1; p=none; rua=mailto:dmarc@bowerycreativeagency.com`

### 5. Verify Domain
```bash
curl -X POST https://api.resend.com/domains/{domain_id}/verify \
  -H "Authorization: Bearer YOUR_FULL_ACCESS_KEY"
```

### 6. Update Environment Variables
Once verified, update all environment files with:
- New full access API key
- Verified domain for "from" addresses

## Benefits After Setup
- ✅ Professional email addresses (noreply@bowerycreativeagency.com)
- ✅ Better deliverability rates
- ✅ Domain reputation management
- ✅ DKIM signing for security

## Current Email Configuration
Currently using: `Bowery Creative <noreply@bowerycreativeagency.com>`

After verification, emails will have proper DKIM signatures and better deliverability.