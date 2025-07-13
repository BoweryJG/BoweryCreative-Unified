-- Create a $1 test invoice for Jason to test the complete payment flow

-- First ensure Jason has a profile
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
    id,
    'jasonwilliamgolden@gmail.com',
    'Jason Golden',
    'Bowery Creative Agency',
    '+12015231306',
    0,
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'jasonwilliamgolden@gmail.com'
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
) VALUES (
    'TEST-FLOW-001',
    (SELECT id FROM auth.users WHERE email = 'jasonwilliamgolden@gmail.com' LIMIT 1),
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
    'https://pay.bowerycreative.com/pay/TEST-FLOW-001',
    now()
) ON CONFLICT (invoice_number) DO UPDATE SET
    amount_due = EXCLUDED.amount_due,
    line_items = EXCLUDED.line_items,
    updated_at = now();