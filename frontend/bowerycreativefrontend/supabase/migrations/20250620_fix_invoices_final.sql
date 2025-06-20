-- First, let's see what columns exist in the invoices table
-- This will help us understand what fields are required

-- Delete test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_name IN ('Unknown Client', 'Jason Golden', 'Sarah Jones');

-- Create or update Dr. Greg Pedro's invoice with ALL possible fields
DO $$
DECLARE
  pedro_client_id UUID;
  pedro_phone TEXT;
BEGIN
  -- Get Dr. Greg Pedro's details
  SELECT id, phone INTO pedro_client_id, pedro_phone 
  FROM clients 
  WHERE email = 'greg@gregpedromd.com' 
  LIMIT 1;
  
  -- Delete any existing INV-2025-001 to start fresh
  DELETE FROM invoices WHERE invoice_number = 'INV-2025-001';
  
  -- Insert new invoice with ALL fields that might exist
  INSERT INTO invoices (
    invoice_number,
    client_id,
    client_name,
    client_email,
    client_phone,
    amount_due,
    amount_paid,
    currency,
    status,
    due_date,
    invoice_date,  -- Adding invoice_date
    line_items,
    payment_link,
    created_at,
    updated_at
  ) VALUES (
    'INV-2025-001',
    pedro_client_id,
    'Dr. Greg Pedro',
    'greg@gregpedromd.com',
    COALESCE(pedro_phone, '+16107809156'),
    2000.00,
    0.00,
    'USD',
    'sent',
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE,  -- invoice_date as today
    '[{
      "id": "1",
      "description": "Premium AI Infrastructure - June 2025",
      "quantity": 1,
      "unit_price": 2000.00,
      "amount": 2000.00
    }]'::jsonb,
    'https://start.bowerycreativeagency.com/pay/pedro-june-2025',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Invoice INV-2025-001 created successfully for Dr. Greg Pedro';
END $$;