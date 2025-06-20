-- First, delete any existing test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_name IN ('Unknown Client', 'Jason Golden', 'Sarah Jones')
OR (client_name IS NULL AND invoice_number != 'INV-2025-001');

-- Get Dr. Greg Pedro's client ID and create/update his invoice
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
  
  -- Check if invoice exists
  IF EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2025-001') THEN
    -- Update existing invoice with all required fields
    UPDATE invoices SET
      client_id = pedro_client_id,
      client_name = 'Dr. Greg Pedro',
      client_email = 'greg@gregpedromd.com',
      client_phone = COALESCE(pedro_phone, '+16107809156'),
      amount_due = 2000.00,
      amount_paid = 0.00,
      currency = 'USD',
      status = 'sent',
      due_date = CURRENT_DATE + INTERVAL '30 days',
      line_items = '[{
        "id": "1",
        "description": "Premium AI Infrastructure - June 2025",
        "quantity": 1,
        "unit_price": 2000.00,
        "amount": 2000.00
      }]'::jsonb,
      payment_link = 'https://start.bowerycreativeagency.com/pay/pedro-june-2025',
      updated_at = NOW()
    WHERE invoice_number = 'INV-2025-001';
  ELSE
    -- Insert new invoice with all fields that might be required
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
      line_items,
      payment_link
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
      '[{
        "id": "1",
        "description": "Premium AI Infrastructure - June 2025",
        "quantity": 1,
        "unit_price": 2000.00,
        "amount": 2000.00
      }]'::jsonb,
      'https://start.bowerycreativeagency.com/pay/pedro-june-2025'
    );
  END IF;
END $$;