-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Financial details
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Status and dates
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
  due_date DATE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  
  -- Line items stored as JSONB
  line_items JSONB NOT NULL DEFAULT '[]',
  
  -- Integration
  stripe_invoice_id TEXT,
  payment_link TEXT,
  
  -- Metadata
  metadata JSONB,
  notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON invoices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON invoices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON invoices
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON invoices
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add client_name column if it doesn't exist (for existing table compatibility)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'client_name') THEN
        ALTER TABLE invoices ADD COLUMN client_name TEXT;
    END IF;
END $$;

-- Create Dr. Greg Pedro's first invoice ($2000)
INSERT INTO invoices (
  invoice_number,
  client_id,
  client_name,
  amount_due,
  amount_paid,
  currency,
  status,
  due_date,
  line_items,
  payment_link
) VALUES (
  'INV-2025-001',
  (SELECT id FROM clients WHERE email = 'greg@gregpedromd.com'),
  'Dr. Greg Pedro',
  2000.00,
  0.00,
  'USD',
  'sent',
  CURRENT_DATE + INTERVAL '30 days',
  '[{
    "id": "1",
    "description": "Premium AI Infrastructure - June 2025",
    "quantity": 1,
    "unit_price": 2000.00,
    "amount": 2000.00
  }]'::jsonb,
  'https://start.bowerycreativeagency.com/pay/pedro-june-2025'
)
ON CONFLICT (invoice_number) 
DO UPDATE SET
  client_id = EXCLUDED.client_id,
  client_name = EXCLUDED.client_name,
  amount_due = EXCLUDED.amount_due,
  status = EXCLUDED.status,
  line_items = EXCLUDED.line_items;