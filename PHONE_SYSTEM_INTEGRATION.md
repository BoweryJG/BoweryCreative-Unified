# Phone System Integration

## Overview

This repository now includes a comprehensive phone system management platform that integrates with:
- **VoIP.ms** - For phone numbers, calls, and SMS
- **Twilio** - Alternative provider support
- **Julie AI** - AI receptionist using Kyutai Moshi
- **Stripe** - Billing and payment processing

## Components Added

### 1. Phone System Management (`/phone-system/`)
Complete multi-tenant phone system platform with:
- Client management
- Phone number provisioning
- Usage tracking and billing
- Real-time call/SMS handling

### 2. VoIP.ms Integration
Located in Pedro backend: `/home/jgolden/pedro/backend/services/voipmsService.js`
- Full API integration
- SMS and call management
- Auto-response system
- Analytics and reporting

### 3. Julie AI Assistant
Located in Pedro backend: `/home/jgolden/pedro/backend/services/julieAI.js`
- Real-time voice conversations
- Appointment booking
- Emergency handling
- Natural language processing

### 4. Webhook Endpoints
Located in Pedro backend: `/home/jgolden/pedro/backend/src/routes/webhooks.js`
- Twilio webhooks
- VoIP.ms webhooks
- Security validation
- Auto-response logic

## Setup Instructions

### 1. VoIP.ms Account
1. Sign up at https://voip.ms
2. Get API credentials
3. Configure webhook URLs

### 2. Environment Variables
Add to your `.env`:
```
# VoIP.ms
VOIPMS_USERNAME=your_username
VOIPMS_PASSWORD=your_api_password
VOIPMS_DID=your_phone_number

# Stripe (for billing)
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Julie AI
MOSHI_SERVER_URL=wss://your-moshi-server
```

### 3. Database Setup
Run migrations in Bowery's Supabase for multi-tenant tables.

### 4. Deploy Phone System
```bash
cd phone-system
npm install
npm run build
npm start
```

## Integration with RepConnect

RepConnect can now use the unified phone infrastructure:
1. Use the same Supabase tables for call tracking
2. Share phone numbers across applications
3. Unified billing through Bowery platform

## Cost Structure

- VoIP.ms numbers: $0.85/month
- Calls: ~$0.009/minute
- SMS: ~$0.0075/text
- AI: Free (Kyutai Moshi)
- **Your margin**: $9-24 per client number

## Support

For issues or questions about the phone system integration, check:
- `/phone-system/README.md` - Platform documentation
- `/pedro/backend/docs/` - Integration guides
- VoIP.ms API docs: https://voip.ms/api