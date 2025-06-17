-- This updates the OAuth redirect URLs in Supabase
-- Run this in your Supabase SQL editor

-- Check current auth settings
SELECT * FROM auth.config WHERE key = 'external_google_redirect_uri';

-- Update Google OAuth redirect URIs
-- NOTE: You need to update these in Supabase Dashboard under:
-- Authentication > Providers > Google > Redirect URLs
-- Add ALL of these URLs:
-- http://localhost:5174
-- http://localhost:5173
-- https://yourdomain.com (for production)
-- https://yourapp.netlify.app (if using Netlify)

-- Also update in Google Cloud Console:
-- 1. Go to https://console.cloud.google.com
-- 2. Select your project
-- 3. Go to APIs & Services > Credentials
-- 4. Click on your OAuth 2.0 Client ID
-- 5. Add these to Authorized redirect URIs:
--    - https://fiozmyoedptukpkzuhqm.supabase.co/auth/v1/callback
--    - http://localhost:5174
--    - http://localhost:5173
--    - Your production URLs