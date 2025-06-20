-- Delete test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_name IN ('Unknown Client', 'Jason Golden', 'Sarah Jones');

-- Delete any existing INV-2025-001
DELETE FROM invoices WHERE invoice_number = 'INV-2025-001';

-- Insert Dr. Greg Pedro's invoice WITHOUT client_id since it references profiles table
INSERT INTO invoices (
  invoice_number,
  client_id,      -- Set to NULL since we don't have a profiles table entry
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
  payment_link
) VALUES (
  'INV-2025-001',
  NULL,           -- NULL because the foreign key points to profiles, not clients
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
  '+16107809156',
  CURRENT_DATE,
  2000.00,
  'https://bowerycreativeagency.com/invoices/INV-2025-001'
);