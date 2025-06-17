# Bowery Creative Deployment Guide

## Projects Overview

### 1. Main Website (bowerycreativeagency.com)
- **Location**: Root directory (`/`)
- **Deploy**: Netlify (auto-deploys on push)
- **Build**: `npm run build`
- **Framework**: React + Vite

### 2. Mission Control Dashboard (bowerycreativedashboard.netlify.app)
- **Location**: `/mission-control`
- **Deploy**: Netlify (auto-deploys on push)
- **Build**: `npm run build`
- **Framework**: React + Vite + TypeScript
- **Features**: Campaign Marketplace, Email Builder, Analytics

### 3. Backend API (Render)
- **Location**: `/bowerycreativebackend`
- **Deploy**: Render (manual or auto-deploy)
- **Framework**: Node.js + Express
- **Database**: Supabase

## Deployment Commands

### Deploy Everything (Recommended):
```bash
# 1. Make your changes
# 2. Check builds before pushing
./check-builds.sh

# 3. If builds pass, commit and push
git add .
git commit -m "Your commit message"
git push

# Netlify will auto-rebuild both frontends
# For backend, go to Render dashboard and click "Deploy"
```

### Smart Build Optimization:
- Main site skips rebuild when only Mission Control changes
- Mission Control skips rebuild when only docs/SQL files change
- This prevents unnecessary builds and cancellations

### Local Testing:
```bash
# Frontend
cd /
npm run dev

# Mission Control
cd mission-control/
npm run dev

# Backend
cd bowerycreativebackend/
npm start
```

## Important Files

### Environment Variables:
- Frontend: `/.env`
- Mission Control: `/mission-control/.env`
- Backend: Set in Render dashboard

### Database Migrations:
- Location: `/mission-control-sql/`
- Run in Supabase SQL editor

## Common Issues

### TypeScript Errors in Mission Control:
- Check imports in components
- Run `npm run build` locally before pushing

### Backend Not Updating:
- Manual deploy required on Render
- Check environment variables in Render dashboard

### Database Issues:
- Check Supabase connection
- Verify API keys are correct
- Check RLS policies

## Quick Status Check:
1. Frontend: https://bowerycreativeagency.com
2. Dashboard: https://bowerycreativedashboard.netlify.app
3. Backend: Check Render dashboard
4. Database: Supabase dashboard