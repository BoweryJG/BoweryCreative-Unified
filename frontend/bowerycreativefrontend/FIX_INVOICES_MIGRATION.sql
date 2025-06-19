-- Fix Invoice Schema Migration
-- This migration adds missing columns to existing tables

-- First, let's check what columns exist and add missing ones
DO $$ 
BEGIN
    -- Add client_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'client_name') THEN
        ALTER TABLE invoices ADD COLUMN client_name TEXT;
    END IF;
    
    -- Add client_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'client_email') THEN
        ALTER TABLE invoices ADD COLUMN client_email TEXT;
    END IF;
    
    -- Add client_phone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'client_phone') THEN
        ALTER TABLE invoices ADD COLUMN client_phone TEXT;
    END IF;
    
    -- Add invoice_number if it doesn't exist (might be named differently)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'invoice_number') THEN
        -- Check if there's a 'number' column we should rename
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'number') THEN
            ALTER TABLE invoices RENAME COLUMN number TO invoice_number;
        ELSE
            ALTER TABLE invoices ADD COLUMN invoice_number TEXT UNIQUE;
        END IF;
    END IF;
    
    -- Add invoice_date if it doesn't exist (might be named 'date')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'invoice_date') THEN
        -- Check if there's a 'date' column we should rename
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'date') THEN
            ALTER TABLE invoices RENAME COLUMN date TO invoice_date;
        ELSE
            ALTER TABLE invoices ADD COLUMN invoice_date DATE;
        END IF;
    END IF;
    
    -- Add due_date if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'due_date') THEN
        ALTER TABLE invoices ADD COLUMN due_date DATE;
    END IF;
    
    -- Add amount if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'amount') THEN
        ALTER TABLE invoices ADD COLUMN amount DECIMAL(10, 2);
    END IF;
    
    -- Add status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'status') THEN
        ALTER TABLE invoices ADD COLUMN status TEXT;
    END IF;
    
    -- Add payment_link if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'payment_link') THEN
        ALTER TABLE invoices ADD COLUMN payment_link TEXT;
    END IF;
    
    -- Add payment_link_title if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'payment_link_title') THEN
        ALTER TABLE invoices ADD COLUMN payment_link_title TEXT DEFAULT 'Your campaign starts here';
    END IF;
    
    -- Add payment_link_message if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'payment_link_message') THEN
        ALTER TABLE invoices ADD COLUMN payment_link_message TEXT DEFAULT 'Complete your payment to activate your campaign';
    END IF;
    
    -- Add stripe_payment_intent_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invoices' AND column_name = 'stripe_payment_intent_id') THEN
        ALTER TABLE invoices ADD COLUMN stripe_payment_intent_id TEXT;
    END IF;
END $$;

-- Now let's check the current schema and display it
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'invoices' 
ORDER BY ordinal_position;

-- Update NOT NULL constraints only where we have data
UPDATE invoices 
SET 
    client_name = COALESCE(client_name, 'Unknown Client'),
    client_email = COALESCE(client_email, 'no-email@example.com'),
    invoice_number = COALESCE(invoice_number, 'INV-' || id::text),
    invoice_date = COALESCE(invoice_date, CURRENT_DATE),
    due_date = COALESCE(due_date, CURRENT_DATE + INTERVAL '30 days'),
    amount = COALESCE(amount, 0),
    status = COALESCE(status, 'draft')
WHERE 
    client_name IS NULL 
    OR client_email IS NULL 
    OR invoice_number IS NULL 
    OR invoice_date IS NULL
    OR due_date IS NULL
    OR amount IS NULL
    OR status IS NULL;

-- Now add NOT NULL constraints
ALTER TABLE invoices 
    ALTER COLUMN client_name SET NOT NULL,
    ALTER COLUMN client_email SET NOT NULL,
    ALTER COLUMN invoice_number SET NOT NULL,
    ALTER COLUMN invoice_date SET NOT NULL,
    ALTER COLUMN due_date SET NOT NULL,
    ALTER COLUMN amount SET NOT NULL,
    ALTER COLUMN status SET NOT NULL;

-- Add check constraint for status if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'invoices_status_check'
    ) THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_status_check 
        CHECK (status IN ('draft', 'sent', 'paid', 'overdue'));
    END IF;
END $$;

-- Create invoice_items table if it doesn't exist
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

-- Enable RLS if not already enabled
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop and recreate to ensure they're correct)
DROP POLICY IF EXISTS "Allow authenticated to read invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to insert invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to update invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated to read invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow authenticated to insert invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow authenticated to update invoice_items" ON invoice_items;

-- Recreate policies
CREATE POLICY "Allow authenticated to read invoices" ON invoices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert invoices" ON invoices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update invoices" ON invoices
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to read invoice_items" ON invoice_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert invoice_items" ON invoice_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update invoice_items" ON invoice_items
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Show final schema
SELECT 'Migration completed! Here is your final invoices table schema:' as message;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'invoices' 
ORDER BY ordinal_position;