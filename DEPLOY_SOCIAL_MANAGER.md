# Deploy Social Manager to Render

Your backend is already live at: https://bowerycreative-backend.onrender.com ✅

## Deploy Social Manager (New Service):

1. **Go to [Render Dashboard](https://dashboard.render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect `bowerycreative-socialmanager` repo**

4. **Add these Environment Variables:**
   ```
   PORT=8080
   NODE_ENV=production
   
   # Copy these from your backend service:
   SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
   SUPABASE_SERVICE_KEY=[same as backend]
   
   # Facebook App (from your Robotic AI app):
   FB_APP_ID=[your facebook app id]
   FB_APP_SECRET=[your facebook app secret]
   FB_REDIRECT_URI=https://bowerycreative-socialmanager.onrender.com/auth/facebook/callback
   
   # Email (same as backend):
   EMAIL_USER=[same as backend]
   EMAIL_PASS=[same as backend]
   
   # These will auto-generate:
   SESSION_SECRET=[leave blank - Render will generate]
   ENCRYPTION_KEY=[leave blank - Render will generate]
   ```

5. **Deploy!**

## After Deployment:

1. Update Facebook App settings:
   - Add OAuth redirect: `https://bowerycreative-socialmanager.onrender.com/auth/facebook/callback`
   - Add webhook URL: `https://bowerycreative-socialmanager.onrender.com/webhook`

2. Test magic link flow:
   ```bash
   curl -X POST https://bowerycreative-socialmanager.onrender.com/magic/generate \
     -H "Content-Type: application/json" \
     -d '{"email": "test@dental.com", "practiceName": "Test Dental"}'
   ```

Your backend is already handling the main API, so the social manager just needs to handle the Facebook/Instagram magic link flow!