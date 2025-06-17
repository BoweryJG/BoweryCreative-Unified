-- Create a test invoice for SMS testing
-- Run this in your Supabase SQL editor

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
    'TEST-SMS-001',
    (SELECT id FROM auth.users WHERE email = 'jasonwilliamgolden@gmail.com' LIMIT 1),
    100.00,
    'USD',
    'sent',
    CURRENT_DATE + INTERVAL '30 days',
    '[{
        "id": "1",
        "description": "SMS Testing Invoice",
        "quantity": 1,
        "unit_price": 100,
        "amount": 100
    }]'::jsonb,
    'https://start.bowerycreativeagency.com/pay/TEST-SMS-001',
    now()
);

-- Also add your phone number to your profile
UPDATE public.profiles 
SET phone = '+12015231306'
WHERE email = 'jasonwilliamgolden@gmail.com';