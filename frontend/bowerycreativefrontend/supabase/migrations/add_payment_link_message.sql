-- Add payment link message to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_link_message TEXT DEFAULT 'Your campaign starts here';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_link_title TEXT DEFAULT 'AI Solutions for Enterprise';

-- Update existing invoices with creative messages
UPDATE invoices SET 
  payment_link_title = 'Your Professional Campaign Awaits',
  payment_link_message = 'Dr. Pedro, your medical practice transformation starts with this payment'
WHERE client_name = 'Dr. Greg Pedro';

UPDATE invoices SET 
  payment_link_title = 'Test Campaign Ready',
  payment_link_message = 'Sarah, complete your test payment to activate your campaign'
WHERE client_name = 'Sarah Jones';