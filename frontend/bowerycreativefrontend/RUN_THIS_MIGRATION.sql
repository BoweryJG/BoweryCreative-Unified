-- Complete Invoice System Setup
-- Run this migration in Supabase SQL Editor

-- Create invoices table if not exists
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    invoice_number TEXT UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    payment_link TEXT,
    stripe_payment_intent_id TEXT,
    payment_link_title TEXT DEFAULT 'Your campaign starts here',
    payment_link_message TEXT DEFAULT 'Complete your payment to activate your campaign',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create invoice items table if not exists
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    rate DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to read invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to insert invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to update invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to read invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow authenticated to insert invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow authenticated to update invoice_items" ON invoice_items;

-- Create policies for invoices
CREATE POLICY "Allow authenticated to read invoices" ON invoices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert invoices" ON invoices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update invoices" ON invoices
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for invoice_items
CREATE POLICY "Allow authenticated to read invoice_items" ON invoice_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert invoice_items" ON invoice_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update invoice_items" ON invoice_items
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data if tables are empty
INSERT INTO invoices (client_name, client_email, invoice_number, invoice_date, due_date, amount, status, payment_link_title, payment_link_message)
SELECT 'Dr. Greg Pedro', 'greg@gregpedromd.com', 'INV-2024-001', '2024-06-19', '2024-06-19', 2000, 'sent', 'Your Professional Campaign Awaits', 'Dr. Pedro, your medical practice transformation starts with this payment'
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-001');

INSERT INTO invoices (client_name, client_email, invoice_number, invoice_date, due_date, amount, status, payment_link_title, payment_link_message)
SELECT 'Sarah Jones', 'sarah@example.com', 'INV-2024-002', '2024-06-15', '2024-06-30', 5, 'paid', 'Test Campaign Ready', 'Sarah, complete your test payment to activate your campaign'
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-002');

-- Add invoice items for existing invoices
INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount)
SELECT id, 'Professional Plan - Setup & First Month', 1, 2000, 2000 
FROM invoices 
WHERE invoice_number = 'INV-2024-001'
AND NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001')
);

INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount)
SELECT id, 'Test Invoice', 1, 5, 5 
FROM invoices 
WHERE invoice_number = 'INV-2024-002'
AND NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002')
);