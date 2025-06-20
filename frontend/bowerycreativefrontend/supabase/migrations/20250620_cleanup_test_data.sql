-- Delete any test clients that are not Dr. Greg Pedro
DELETE FROM clients 
WHERE email != 'greg@gregpedromd.com'
AND (
  name LIKE '%Smith%' 
  OR name LIKE '%Test%' 
  OR name LIKE '%Sarah Jones%'
  OR email LIKE '%example.com%'
  OR company LIKE '%Smith Medical%'
);

-- Ensure Dr. Greg Pedro has the correct data
UPDATE clients 
SET 
  name = 'Dr. Greg Pedro',
  company = 'Greg Pedro MD',
  industry = 'Medical Spa',
  business_type = 'Medical Spa',
  status = 'active',
  monthly_amount = 2000.00,
  subscription_plan = 'Premium AI Infrastructure',
  custom_package = '{
    "name": "Premium AI Infrastructure",
    "description": "Complete marketing automation with AI-powered insights",
    "features": ["AI Marketing", "Automated Campaigns", "Real-time Analytics", "Custom Integrations"]
  }'::jsonb
WHERE email = 'greg@gregpedromd.com';

-- Delete any test invoices
DELETE FROM invoices 
WHERE invoice_number IN ('TEST-FLOW-001', 'INV-2025-002', 'SARAH-TEST-001')
OR client_id NOT IN (SELECT id FROM clients WHERE email = 'greg@gregpedromd.com');

-- Update the invoice to show the correct client name if needed
UPDATE invoices 
SET client_id = (SELECT id FROM clients WHERE email = 'greg@gregpedromd.com')
WHERE invoice_number = 'INV-2025-001';