# OAuth Setup Template for New Projects

## Quick Setup Checklist

### 1. Create New OAuth Client in Google Cloud Console
- Go to: https://console.cloud.google.com
- Select your workspace project (RepSpheres)
- APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID

### 2. Standard Configuration

**Name:** `[ProjectName] Development`

**Authorized JavaScript origins:**
```
http://localhost:[YOUR_PORT]
https://[your-subdomain].supabase.co
```

**Authorized redirect URIs:**
```
http://localhost:[YOUR_PORT]
https://[your-subdomain].supabase.co/auth/v1/callback
```

### 3. Port Assignments (Keep Track!)
```
3000 - Bowery Main Site
3001 - Bowery Backend API
5173 - Mission Control (alt)
5174 - Mission Control (main)
4000 - [Next Project]
4001 - [Next Project API]
```

### 4. Update Supabase
1. Go to your Supabase project
2. Authentication → Providers → Google
3. Add Client ID and Secret from step 1

### 5. Environment Variables Template
```env
# .env.local
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_API_URL=http://localhost:[API_PORT]
VITE_SITE_URL=http://localhost:[YOUR_PORT]
```

## Production Setup
Repeat above but with production URLs:
- `https://yourdomain.com`
- `https://app.yourdomain.com`

## Tips
- Keep a spreadsheet of all OAuth clients and their ports
- Use consistent naming: "[ProjectName] Development" and "[ProjectName] Production"
- Never reuse ports between projects
- Document everything!