-- Direct SQL to create $1 test invoice for Jason
-- Copy and paste this ENTIRE block into Supabase SQL Editor

-- First, ensure Jason's profile exists
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    company_name,
    phone,
    monthly_billing,
    is_admin,
    created_at,
    updated_at
) 
SELECT 
    u.id,
    'jasonwilliamgolden@gmail.com',
    'Jason Golden',
    'Bowery Creative Agency',
    '+12015231306',
    0,
    true,
    now(),
    now()
FROM auth.users u
WHERE u.email = 'jasonwilliamgolden@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone,
    is_admin = EXCLUDED.is_admin,
    updated_at = now();

-- Create the $1 test invoice
INSERT INTO public.invoices (
    invoice_number,
    client_id,
    amount_due,
    currency,
    status,
    due_date,
    line_items,
    payment_link,
    created_at
) 
SELECT 
    'TEST-FLOW-001',
    u.id,
    1.00,
    'USD',
    'sent',
    CURRENT_DATE + INTERVAL '30 days',
    '[{
        "id": "1",
        "description": "Payment Flow Test - End-to-End Verification",
        "quantity": 1,
        "unit_price": 1.00,
        "amount": 1.00
    }]'::jsonb,
    'https://start.bowerycreativeagency.com/pay/TEST-FLOW-001',
    now()
FROM auth.users u
WHERE u.email = 'jasonwilliamgolden@gmail.com'
ON CONFLICT (invoice_number) DO UPDATE SET
    amount_due = 1.00,
    line_items = '[{
        "id": "1",
        "description": "Payment Flow Test - End-to-End Verification",
        "quantity": 1,
        "unit_price": 1.00,
        "amount": 1.00
    }]'::jsonb,
    updated_at = now();

-- Verify the invoice was created
SELECT 
    invoice_number,
    amount_due,
    status,
    payment_link
FROM public.invoices 
WHERE invoice_number = 'TEST-FLOW-001';