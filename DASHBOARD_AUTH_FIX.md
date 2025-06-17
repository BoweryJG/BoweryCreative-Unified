# Dashboard Authentication Fix

## Issue 1: Environment Variables Missing in Netlify

### Fix in Netlify Dashboard:
1. Go to https://app.netlify.com
2. Find your dashboard site: `bowerycreative-dashboard`
3. Go to **Site Settings** → **Environment Variables**
4. Add these variables:

```
VITE_SUPABASE_URL = https://fiozmyoedptukpkzuhqm.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o
VITE_SITE_URL = https://bowerycreative-dashboard.netlify.app
```

## Issue 2: Update Supabase Redirect URLs

### Fix in Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/fiozmyoedptukpkzuhqm
2. Navigate to **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   - `https://bowerycreative-dashboard.netlify.app/`
   - `https://bowerycreative-dashboard.netlify.app/auth/callback`

## Issue 3: Modal Not Closing

The auth context should close the modal automatically after login. Let me check the login modal component.

## After Making These Changes:

1. **Redeploy** the dashboard site in Netlify
2. **Test login** at https://bowerycreative-dashboard.netlify.app
3. **Modal should close** after successful Google login
4. **You should see** the Billing Admin section