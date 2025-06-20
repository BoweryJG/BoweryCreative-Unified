-- Delete ALL test invoices
DELETE FROM invoices WHERE invoice_number != 'KEEP-NOTHING';

-- Create Dr. Greg Pedro's invoice - SIMPLE AND WORKING
INSERT INTO invoices (
  invoice_number,
  client_id,
  amount_due,
  amount_paid,
  currency,
  status,
  due_date,
  line_items,
  client_name,
  client_email,
  client_phone,
  invoice_date,
  amount,
  payment_link,
  metadata
) VALUES (
  'INV-2025-001',
  NULL,
  2000.00,
  0.00,
  'USD',
  'sent',
  CURRENT_DATE + INTERVAL '30 days',
  '[{"id": "1", "description": "Premium AI Infrastructure - June 2025", "quantity": 1, "unit_price": 2000.00, "amount": 2000.00}]'::jsonb,
  'Dr. Greg Pedro',
  'greg@gregpedromd.com',
  '+16107809156',
  CURRENT_DATE,
  2000.00,
  'https://bowerycreativeagency.com/pay?invoice=INV-2025-001&amount=2000',
  '{}'::jsonb
);

-- Verify it worked
SELECT 'INVOICE CREATED: ' || invoice_number || ' for ' || client_name || ' - $' || amount_due FROM invoices WHERE invoice_number = 'INV-2025-001';