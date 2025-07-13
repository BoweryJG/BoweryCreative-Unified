-- Setup Admin Users and Roles
-- Run this in Supabase SQL Editor after user registration

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to make a user admin (run these manually with the actual user IDs)
-- First, find your user IDs:
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN ('jasonwilliamgolden@gmail.com', 'jgolden@bowerycreativeagency.com');

-- Then run these with the actual user IDs:
-- INSERT INTO user_roles (user_id, role) 
-- VALUES 
--   ('YOUR_USER_ID_1', 'admin'),
--   ('YOUR_USER_ID_2', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Create a view for easy role checking
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  COALESCE(
    ARRAY_AGG(ur.role) FILTER (WHERE ur.role IS NOT NULL),
    ARRAY[]::VARCHAR[]
  ) as roles
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.email, u.created_at;

-- Grant access to the view
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;