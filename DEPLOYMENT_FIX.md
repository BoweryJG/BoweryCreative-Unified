# Deployment Fix Guide

## Current Status

✅ **Working (Git + Netlify configured):**
- Frontend → GitHub + Netlify
- Payments → GitHub + Netlify  
- Dashboard → GitHub + Netlify

⚠️ **Needs Attention:**
- Backend → GitHub configured, needs deployment (Render/Railway?)
- Social Manager → No Git remote, no deployment

## Fix Steps

### 1. Frontend (Netlify)
```bash
cd frontend
git add .
git commit -m "Update after folder reorganization"
git push origin main
```
**Netlify:** No changes needed - will auto-deploy

### 2. Backend (Need deployment)
```bash
cd backend
git add .
git commit -m "Add social media manager endpoints"
git push origin main
```
**Deploy Options:**
- Render.com (recommended)
- Railway.app
- Heroku

### 3. Payments (Netlify)
Already clean and deployed ✅

### 4. Dashboard (Netlify)
```bash
cd dashboard
git add .
git commit -m "Update environment configuration"
git push origin main
```

### 5. Social Manager (New)
```bash
cd social-manager
git init
git remote add origin https://github.com/BoweryJG/bowerycreative-socialmanager.git
git add .
git commit -m "Initial social media manager setup"
git push -u origin main
```

## Netlify Settings Update

Since we moved folders, you might need to update build settings in Netlify:

1. Go to each Netlify project
2. Settings → Build & Deploy
3. Update "Base directory" if needed:
   - Was: `/`
   - Now: `/` (should still work)

## Environment Variables

Make sure each deployment has the correct env vars:
- Supabase URLs and keys
- API keys
- Domain settings