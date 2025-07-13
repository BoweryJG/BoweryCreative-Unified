-- Email CRM Integration Migration
-- This migration enhances email tracking with CRM capabilities

-- 1. Create client_email_addresses table to map emails to clients
CREATE TABLE IF NOT EXISTS client_email_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email_address TEXT UNIQUE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast email lookups
CREATE INDEX idx_client_email_addresses_email ON client_email_addresses(email_address);
CREATE INDEX idx_client_email_addresses_client ON client_email_addresses(client_id);

-- 2. Enhance email_logs table with CRM fields
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES contacts(id),
ADD COLUMN IF NOT EXISTS thread_id UUID,
ADD COLUMN IF NOT EXISTS in_reply_to TEXT,
ADD COLUMN IF NOT EXISTS template_used TEXT,
ADD COLUMN IF NOT EXISTS sender_alias TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ;

-- Add indexes for CRM queries
CREATE INDEX IF NOT EXISTS idx_email_logs_client ON email_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_contact ON email_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_thread ON email_logs(thread_id);

-- 3. Create unified communication_logs table
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id),
  contact_id UUID REFERENCES contacts(id),
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'call', 'meeting', 'note', 'chat')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  summary TEXT,
  duration_seconds INTEGER, -- For calls/meetings
  participants TEXT[], -- Array of participant emails/names
  metadata JSONB DEFAULT '{}',
  related_to UUID, -- Can reference email_logs, sms_logs, etc.
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for communication logs
CREATE INDEX idx_communication_logs_client ON communication_logs(client_id);
CREATE INDEX idx_communication_logs_contact ON communication_logs(contact_id);
CREATE INDEX idx_communication_logs_type ON communication_logs(type);
CREATE INDEX idx_communication_logs_created_at ON communication_logs(created_at DESC);

-- 4. Create view for client email history
CREATE OR REPLACE VIEW client_email_history AS
SELECT 
  el.*,
  p.full_name as client_name,
  p.company_name as client_company,
  c.name as contact_name,
  c.company as contact_company
FROM email_logs el
LEFT JOIN profiles p ON el.client_id = p.id
LEFT JOIN contacts c ON el.contact_id = c.id
ORDER BY el.sent_at DESC;

-- 5. Function to automatically associate emails with clients
CREATE OR REPLACE FUNCTION associate_email_with_client(email_to TEXT)
RETURNS UUID AS $$
DECLARE
  v_client_id UUID;
BEGIN
  -- First check client_email_addresses table
  SELECT client_id INTO v_client_id
  FROM client_email_addresses
  WHERE email_address = email_to
  LIMIT 1;
  
  -- If not found, check profiles table
  IF v_client_id IS NULL THEN
    SELECT id INTO v_client_id
    FROM profiles
    WHERE email = email_to
    LIMIT 1;
    
    -- If found in profiles, add to client_email_addresses
    IF v_client_id IS NOT NULL THEN
      INSERT INTO client_email_addresses (client_id, email_address, is_primary, verified)
      VALUES (v_client_id, email_to, true, true)
      ON CONFLICT (email_address) DO NOTHING;
    END IF;
  END IF;
  
  -- Check contacts table if still not found
  IF v_client_id IS NULL THEN
    SELECT id INTO v_client_id
    FROM contacts
    WHERE email = email_to
    LIMIT 1;
  END IF;
  
  RETURN v_client_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_email_addresses_updated_at
BEFORE UPDATE ON client_email_addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_logs_updated_at
BEFORE UPDATE ON communication_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Populate client_email_addresses from existing data
INSERT INTO client_email_addresses (client_id, email_address, is_primary, verified)
SELECT DISTINCT id, email, true, true
FROM profiles
WHERE email IS NOT NULL
ON CONFLICT (email_address) DO NOTHING;

-- 8. Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON client_email_addresses TO authenticated;
GRANT SELECT ON client_email_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON communication_logs TO authenticated;
GRANT EXECUTE ON FUNCTION associate_email_with_client TO authenticated;