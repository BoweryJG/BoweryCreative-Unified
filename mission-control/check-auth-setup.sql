-- 1. First, check if your users exist in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com');

-- 2. Check if you have admin roles assigned
SELECT ur.*, u.email 
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com');

-- 3. If you see your user ID from step 1 but NO admin role in step 2, run this:
-- Replace 'YOUR-USER-ID-HERE' with the actual ID from step 1
/*
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR-USER-ID-HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- 4. Check if authorized_clients table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'authorized_clients'
);

-- 5. If authorized_clients doesn't exist, create it:
CREATE TABLE IF NOT EXISTS authorized_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  subscription_level TEXT DEFAULT 'basic' CHECK (subscription_level IN ('basic', 'professional', 'enterprise')),
  subscription_features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 6. Check the has_dashboard_access function exists
SELECT EXISTS (
  SELECT 1 FROM pg_proc 
  WHERE proname = 'has_dashboard_access'
);