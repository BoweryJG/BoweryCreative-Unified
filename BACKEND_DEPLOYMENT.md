# Backend & Social Manager Deployment Guide

## Option 1: Render.com (Recommended - Free tier available)

### Backend Deployment:
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `BoweryJG/BoweryCreative-backend`
5. Fill in:
   - Name: `bowerycreative-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables:
   ```
   SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
   SUPABASE_SERVICE_KEY=your-key
   EMAIL_USER=your-email
   EMAIL_PASS=your-password
   ```
7. Click "Create Web Service"

### Social Manager Deployment:
1. Click "New +" → "Web Service"
2. Select `BoweryJG/bowerycreative-socialmanager`
3. Fill in:
   - Name: `bowerycreative-socialmanager`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add Environment Variables:
   ```
   SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
   SUPABASE_SERVICE_KEY=your-key
   FB_APP_ID=your-facebook-app-id
   FB_APP_SECRET=your-facebook-app-secret
   FB_REDIRECT_URI=https://bowerycreative-socialmanager.onrender.com/auth/facebook/callback
   EMAIL_API_KEY=your-sendgrid-or-resend-key
   ```

## Option 2: Railway.app (Easier, $5/month)

### One-Click Deploy:
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repos
5. Railway auto-detects Node.js and sets everything up
6. Add environment variables in the dashboard

## Option 3: Vercel (For Social Manager Frontend if you split it)

If you want to split the social manager into frontend/backend:
1. Deploy backend to Render/Railway
2. Deploy frontend to Vercel
3. Update API endpoints

## Next Steps:

1. **Commit deployment configs:**
   ```bash
   cd backend && git add render.yaml && git commit -m "Add Render deployment config" && git push
   cd ../social-manager && git add render.yaml && git commit -m "Add Render deployment config" && git push
   ```

2. **Deploy to Render:**
   - Go to render.com
   - Connect both repos
   - Deploy!

3. **Update your DNS/URLs:**
   - Backend API: `https://bowerycreative-backend.onrender.com`
   - Social Manager: `https://bowerycreative-socialmanager.onrender.com`

4. **Update Frontend API URLs:**
   - Update any localhost:3000 references to your new backend URL

Want me to help you commit these configs and walk through the Render setup?