-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Create authorized clients table
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

-- Enable RLS
ALTER TABLE authorized_clients ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own client record
CREATE POLICY "Users can view own client record" ON authorized_clients
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for admins to manage all client records
CREATE POLICY "Admins can manage all client records" ON authorized_clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_authorized_clients_user_id ON authorized_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_authorized_clients_subscription_level ON authorized_clients(subscription_level);

-- Function to check if user has dashboard access
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

-- Grant the function to authenticated users
GRANT EXECUTE ON FUNCTION has_dashboard_access TO authenticated;

-- Create or replace the handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON authorized_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for user_roles table too
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert admin users
-- First check if user_roles entries exist, if not create them
INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Sample subscription features structure
COMMENT ON COLUMN authorized_clients.subscription_features IS 'JSON object containing feature flags like: {
  "dashboard_components": ["analytics", "campaign_manager", "email_marketing"],
  "api_calls": 10000,
  "team_members": 5,
  "custom_branding": true,
  "priority_support": false
}';