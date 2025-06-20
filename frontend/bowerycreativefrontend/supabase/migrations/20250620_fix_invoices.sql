-- First, delete any existing test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_name IN ('Unknown Client', 'Jason Golden', 'Sarah Jones')
OR (client_name IS NULL AND invoice_number != 'INV-2025-001');

-- Get Dr. Greg Pedro's client ID
DO $$
DECLARE
  pedro_client_id UUID;
BEGIN
  -- Get Dr. Greg Pedro's ID
  SELECT id INTO pedro_client_id FROM clients WHERE email = 'greg@gregpedromd.com' LIMIT 1;
  
  -- Update or insert Dr. Greg Pedro's invoice
  INSERT INTO invoices (
    invoice_number,
    client_id,
    client_name,
    client_email,
    amount_due,
    amount_paid,
    currency,
    status,
    due_date,
    line_items,
    payment_link
  ) VALUES (
    'INV-2025-001',
    pedro_client_id,
    'Dr. Greg Pedro',
    'greg@gregpedromd.com',
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
    client_email = EXCLUDED.client_email,
    amount_due = EXCLUDED.amount_due,
    status = EXCLUDED.status,
    line_items = EXCLUDED.line_items,
    updated_at = NOW();
END $$;