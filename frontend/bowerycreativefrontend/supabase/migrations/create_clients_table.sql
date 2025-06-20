-- Create clients table for production use
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT NOT NULL,
  industry TEXT,
  
  -- Status and billing
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  monthly_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  
  -- Onboarding info
  access_code TEXT UNIQUE,
  code_used BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  payment_completed BOOLEAN DEFAULT false,
  
  -- Subscription details
  subscription_plan TEXT,
  custom_package JSONB,
  
  -- Additional metadata
  notes TEXT,
  tags TEXT[],
  stripe_customer_id TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_company ON clients(company);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth setup)
CREATE POLICY "Enable read access for authenticated users" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Dr. Greg Pedro as a real client
INSERT INTO clients (
  name,
  email,
  phone,
  company,
  industry,
  status,
  monthly_amount,
  total_spent,
  access_code,
  code_used,
  onboarding_completed,
  payment_completed,
  subscription_plan,
  custom_package,
  join_date
) VALUES (
  'Dr. Greg Pedro',
  'greg@gregpedromd.com',
  '+16107809156',
  'Greg Pedro MD',
  'Medical Spa',
  'active',
  2000.00,
  0.00, -- Starting fresh as of today
  'PEDRO',
  true,
  true,
  true,
  'Premium AI Infrastructure',
  '{
    "name": "Premium AI Infrastructure",
    "description": "Complete marketing automation with AI-powered insights",
    "features": ["AI Marketing", "Automated Campaigns", "Real-time Analytics", "Custom Integrations"]
  }'::jsonb,
  NOW()
);