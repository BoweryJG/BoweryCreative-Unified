-- Create a table to track OAuth configurations for all projects
-- Run this in your Supabase SQL editor for project: fiozmyoedptukpkzuhqm

-- Create the oauth_configs table
CREATE TABLE IF NOT EXISTS public.oauth_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  environment VARCHAR(50) NOT NULL, -- 'development' or 'production'
  google_client_id VARCHAR(255) NOT NULL,
  google_client_name VARCHAR(255),
  local_port INTEGER,
  javascript_origins TEXT[], -- Array of allowed origins
  redirect_uris TEXT[], -- Array of redirect URIs
  supabase_project_id VARCHAR(255),
  supabase_url VARCHAR(255),
  google_account_email VARCHAR(255), -- Which Google account owns this OAuth client
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create an index for faster lookups
CREATE INDEX idx_oauth_configs_project_env ON public.oauth_configs(project_name, environment);

-- Add RLS (Row Level Security)
ALTER TABLE public.oauth_configs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read
CREATE POLICY "Authenticated users can read oauth configs" ON public.oauth_configs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows only admins to insert/update/delete
CREATE POLICY "Only admins can modify oauth configs" ON public.oauth_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_oauth_configs_updated_at BEFORE UPDATE ON public.oauth_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the Mission Control configuration as the first entry
INSERT INTO public.oauth_configs (
  project_name,
  environment,
  google_client_id,
  google_client_name,
  local_port,
  javascript_origins,
  redirect_uris,
  supabase_project_id,
  supabase_url,
  google_account_email,
  notes
) VALUES (
  'Mission Control',
  'development',
  'YOUR_GOOGLE_CLIENT_ID', -- Replace with actual client ID
  'Mission Control Development',
  5174,
  ARRAY[
    'http://localhost:5174',
    'http://localhost:5173',
    'https://fiozmyoedptukpkzuhqm.supabase.co'
  ],
  ARRAY[
    'http://localhost:5174',
    'http://localhost:5173',
    'https://fiozmyoedptukpkzuhqm.supabase.co/auth/v1/callback'
  ],
  'fiozmyoedptukpkzuhqm',
  'https://fiozmyoedptukpkzuhqm.supabase.co',
  'your-workspace@repspheres.com', -- Replace with actual email
  'Main mission control dashboard for Bowery Creative Agency'
);

-- Create a view for easier reading
CREATE VIEW oauth_configs_summary AS
SELECT 
  project_name,
  environment,
  local_port,
  google_client_id,
  google_account_email,
  created_at
FROM public.oauth_configs
ORDER BY project_name, environment;

-- Grant permissions on the view
GRANT SELECT ON oauth_configs_summary TO authenticated;