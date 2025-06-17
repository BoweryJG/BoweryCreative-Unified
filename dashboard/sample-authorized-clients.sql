-- Sample Authorized Clients Configuration
-- This shows how to add authorized clients with different subscription levels

-- Example 1: Basic Plan Client
/*
INSERT INTO authorized_clients (
  user_id,
  organization_name,
  subscription_level,
  subscription_features,
  is_active
) VALUES (
  'USER_UUID_HERE', -- Replace with actual user ID from auth.users
  'Acme Medical Practice',
  'basic',
  '{
    "dashboard_components": ["analytics"],
    "api_calls": 1000,
    "team_members": 1,
    "custom_branding": false,
    "priority_support": false
  }'::jsonb,
  true
);
*/

-- Example 2: Professional Plan Client  
/*
INSERT INTO authorized_clients (
  user_id,
  organization_name,
  subscription_level,
  subscription_features,
  is_active
) VALUES (
  'USER_UUID_HERE', -- Replace with actual user ID from auth.users
  'Elite Dental Group',
  'professional',
  '{
    "dashboard_components": ["analytics", "campaign_manager", "email_marketing"],
    "api_calls": 10000,
    "team_members": 5,
    "custom_branding": true,
    "priority_support": false
  }'::jsonb,
  true
);
*/

-- Example 3: Enterprise Plan Client
/*
INSERT INTO authorized_clients (
  user_id,
  organization_name,
  subscription_level,
  subscription_features,
  is_active
) VALUES (
  'USER_UUID_HERE', -- Replace with actual user ID from auth.users
  'Healthcare Network Inc',
  'enterprise',
  '{
    "dashboard_components": ["analytics", "campaign_manager", "email_marketing", "social_media", "content_studio", "seo_analyzer"],
    "api_calls": 100000,
    "team_members": 25,
    "custom_branding": true,
    "priority_support": true
  }'::jsonb,
  true
);
*/

-- To add a new authorized client:
-- 1. First find the user ID from auth.users:
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'client@example.com';

-- 2. Then insert the authorized client record with the user ID
-- INSERT INTO authorized_clients (...) VALUES (...);

-- To view all authorized clients:
-- SELECT ac.*, u.email 
-- FROM authorized_clients ac
-- JOIN auth.users u ON ac.user_id = u.id
-- ORDER BY ac.created_at DESC;