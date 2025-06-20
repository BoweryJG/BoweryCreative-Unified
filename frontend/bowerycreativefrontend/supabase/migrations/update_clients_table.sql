-- First, let's check if the clients table exists and add missing columns
DO $$ 
BEGIN
    -- Add company column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'company') THEN
        ALTER TABLE clients ADD COLUMN company TEXT;
    END IF;
    
    -- Add industry column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'industry') THEN
        ALTER TABLE clients ADD COLUMN industry TEXT;
    END IF;
    
    -- Add monthly_amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'monthly_amount') THEN
        ALTER TABLE clients ADD COLUMN monthly_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
    END IF;
    
    -- Add total_spent column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'total_spent') THEN
        ALTER TABLE clients ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add access_code column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'access_code') THEN
        ALTER TABLE clients ADD COLUMN access_code TEXT UNIQUE;
    END IF;
    
    -- Add code_used column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'code_used') THEN
        ALTER TABLE clients ADD COLUMN code_used BOOLEAN DEFAULT false;
    END IF;
    
    -- Add onboarding_completed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'onboarding_completed') THEN
        ALTER TABLE clients ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
    END IF;
    
    -- Add payment_completed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'payment_completed') THEN
        ALTER TABLE clients ADD COLUMN payment_completed BOOLEAN DEFAULT false;
    END IF;
    
    -- Add subscription_plan column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'subscription_plan') THEN
        ALTER TABLE clients ADD COLUMN subscription_plan TEXT;
    END IF;
    
    -- Add custom_package column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'custom_package') THEN
        ALTER TABLE clients ADD COLUMN custom_package JSONB;
    END IF;
    
    -- Add notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'notes') THEN
        ALTER TABLE clients ADD COLUMN notes TEXT;
    END IF;
    
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'tags') THEN
        ALTER TABLE clients ADD COLUMN tags TEXT[];
    END IF;
    
    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE clients ADD COLUMN stripe_customer_id TEXT;
    END IF;
    
    -- Add join_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'join_date') THEN
        ALTER TABLE clients ADD COLUMN join_date TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'updated_at') THEN
        ALTER TABLE clients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
    
    -- Add business_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'business_type') THEN
        ALTER TABLE clients ADD COLUMN business_type TEXT;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company);

-- Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'UNIQUE' 
        AND table_name = 'clients' 
        AND constraint_name = 'clients_email_key'
    ) THEN
        ALTER TABLE clients ADD CONSTRAINT clients_email_key UNIQUE (email);
    END IF;
END $$;

-- Add updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Check if Dr. Greg Pedro already exists and insert/update accordingly
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM clients WHERE email = 'greg@gregpedromd.com') THEN
        -- Update existing record
        UPDATE clients SET
            name = 'Dr. Greg Pedro',
            phone = '+16107809156',
            company = 'Greg Pedro MD',
            industry = 'Medical Spa',
            business_type = 'Medical Spa',
            status = 'active',
            monthly_amount = 2000.00,
            subscription_plan = 'Premium AI Infrastructure',
            custom_package = '{
                "name": "Premium AI Infrastructure",
                "description": "Complete marketing automation with AI-powered insights",
                "features": ["AI Marketing", "Automated Campaigns", "Real-time Analytics", "Custom Integrations"]
            }'::jsonb,
            code_used = true,
            onboarding_completed = true,
            payment_completed = true,
            updated_at = NOW()
        WHERE email = 'greg@gregpedromd.com';
    ELSE
        -- Insert new record
        INSERT INTO clients (
            name,
            email,
            phone,
            company,
            industry,
            business_type,
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
            'Medical Spa',
            'active',
            2000.00,
            0.00,
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
    END IF;
END $$;