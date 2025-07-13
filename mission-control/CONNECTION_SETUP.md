# Mission Control & Bowery Backend Connection Setup

## Overview
This document outlines the connection between mission-control (frontend) and bowery-backend (API).

## Configuration

### Environment Variables
- Frontend uses `.env.local` (not committed)
- Backend uses `.env` (not committed)
- Both projects share the same Supabase instance

### Ports
- Frontend: http://localhost:5174 (or 5173)
- Backend: http://localhost:3001

### Supabase Redirect URLs
Configure these in Supabase Dashboard → Authentication → URL Configuration:
- `http://localhost:5174`
- `http://localhost:5173`
- `http://localhost:3000` (legacy support)

## API Endpoints
The backend provides these endpoints for mission-control:
- `/api/campaigns/:id/analytics` - Campaign analytics
- `/api/campaigns/:id/purchase` - Purchase campaigns
- `/api/purchases` - User purchases
- `/api/purchases/:id/emails` - Campaign emails

## Running the Project
1. Start backend: `cd bowery-backend && npm run dev`
2. Start frontend: `cd mission-control && npm run dev`
3. Access frontend at http://localhost:5174