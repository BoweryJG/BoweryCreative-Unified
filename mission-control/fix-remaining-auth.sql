-- 1. Create authorized_clients table if it doesn't exist
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

-- 2. Enable RLS
ALTER TABLE authorized_clients ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for users to view their own client record
CREATE POLICY IF NOT EXISTS "Users can view own client record" ON authorized_clients
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Create policy for admins to manage all client records
CREATE POLICY IF NOT EXISTS "Admins can manage all client records" ON authorized_clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_authorized_clients_user_id ON authorized_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_authorized_clients_subscription_level ON authorized_clients(subscription_level);

-- 6. Create the access check function
CREATE OR REPLACE FUNCTION has_dashboard_access(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    -- Check if user is admin
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = check_user_id 
    AND role = 'admin'
  ) OR EXISTS (
    -- Check if user is authorized client
    SELECT 1 FROM authorized_clients 
    WHERE authorized_clients.user_id = check_user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant the function to authenticated users
GRANT EXECUTE ON FUNCTION has_dashboard_access TO authenticated;

-- 8. Create the handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for authorized_clients
DROP TRIGGER IF EXISTS set_updated_at ON authorized_clients;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON authorized_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 10. Verify everything is set up correctly
SELECT 
  'Your user ID: ' || u.id::text as info,
  'Has admin role: ' || (CASE WHEN ur.role = 'admin' THEN 'YES' ELSE 'NO' END) as admin_status,
  'Can access dashboard: ' || has_dashboard_access(u.id)::text as access_status
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.role = 'admin'
WHERE u.email = 'jasonwilliamgolden@gmail.com';