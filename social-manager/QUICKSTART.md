# Quick Start Guide

## Prerequisites
- Facebook App ID & Secret (you have this ✅)
- Claude API Key (via OpenRouter)
- Node.js 18+
- Supabase project

## Step 1: Initialize Project
```bash
npm init -y
npm install express @anthropic-ai/sdk facebook-nodejs-business-sdk dotenv
npm install -D @types/node @types/express typescript nodemon
```

## Step 2: Environment Setup
Create `.env`:
```env
# Facebook
FB_APP_ID=your_app_id
FB_APP_SECRET=your_app_secret
FB_VERIFY_TOKEN=your_random_verify_token

# Claude (via OpenRouter)
OPENROUTER_API_KEY=your_api_key

# Supabase
SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# Server
PORT=8080
WEBHOOK_URL=https://your-domain.com/webhook
```

## Step 3: Basic Server
```typescript
// src/server.ts
import express from 'express';
import { WebhookHandler } from './webhook';
import { ClaudeService } from './claude';

const app = express();
app.use(express.json());

// Facebook webhook verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Handle incoming webhooks
app.post('/webhook', WebhookHandler.handle);

app.listen(process.env.PORT);
```

## Step 4: Deploy to Production
```bash
# Deploy to Railway/Render/Vercel
railway up
# or
vercel --prod
```

## Step 5: Configure Facebook Webhooks
1. Go to your Facebook App Dashboard
2. Set webhook URL: `https://your-domain.com/webhook`
3. Subscribe to: messages, message_reactions, comments, mentions

## Testing Checklist
- [ ] Webhook receives Facebook events
- [ ] Claude generates appropriate responses
- [ ] Responses post back to Instagram/Facebook
- [ ] Error handling works properly
- [ ] Rate limiting in place

## Next: Build the UI
After backend is working, add a dashboard for dental practices to:
- View conversation history
- Customize AI personality
- Set business hours
- Review analytics