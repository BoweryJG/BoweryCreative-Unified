-- Delete test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_name IN ('Unknown Client', 'Jason Golden', 'Sarah Jones');

-- Create Dr. Greg Pedro's invoice with ALL required fields
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
  
  -- Insert new invoice with ALL required (NOT NULL) fields
  INSERT INTO invoices (
    invoice_number,      -- NOT NULL
    client_id,           -- nullable
    amount_due,          -- NOT NULL (default 0)
    amount_paid,         -- NOT NULL (default 0)
    currency,            -- NOT NULL (default 'USD')
    status,              -- NOT NULL (default 'draft')
    due_date,            -- NOT NULL
    line_items,          -- NOT NULL (default '[]')
    client_name,         -- NOT NULL
    client_email,        -- NOT NULL
    client_phone,        -- nullable
    invoice_date,        -- NOT NULL
    amount,              -- NOT NULL
    payment_link
  ) VALUES (
    'INV-2025-001',
    pedro_client_id,
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
    'Dr. Greg Pedro',
    'greg@gregpedromd.com',
    COALESCE(pedro_phone, '+16107809156'),
    CURRENT_DATE,
    2000.00,  -- amount field
    'https://start.bowerycreativeagency.com/pay/pedro-june-2025'
  );
  
  RAISE NOTICE 'Invoice INV-2025-001 created successfully for Dr. Greg Pedro';
END $$;