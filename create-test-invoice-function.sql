-- Function to create $1 test invoice for Jason
CREATE OR REPLACE FUNCTION create_test_invoice_for_jason()
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
    v_result TEXT;
BEGIN
    -- Get Jason's user ID
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'jasonwilliamgolden@gmail.com' 
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RETURN 'User not found';
    END IF;
    
    -- Create/update profile
    INSERT INTO public.profiles (
        id, email, full_name, company_name, phone, monthly_billing, is_admin
    ) VALUES (
        v_user_id, 'jasonwilliamgolden@gmail.com', 'Jason Golden', 
        'Bowery Creative Agency', '+12015231306', 0, true
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        is_admin = EXCLUDED.is_admin;
    
    -- Create $1 test invoice
    INSERT INTO public.invoices (
        invoice_number, client_id, amount_due, currency, status, due_date, line_items, payment_link
    ) VALUES (
        'TEST-FLOW-001', v_user_id, 1.00, 'USD', 'sent', CURRENT_DATE + 30,
        '[{"id": "1", "description": "Payment Flow Test - End-to-End Verification", "quantity": 1, "unit_price": 1.00, "amount": 1.00}]'::jsonb,
        'https://start.bowerycreativeagency.com/pay/TEST-FLOW-001'
    ) ON CONFLICT (invoice_number) DO UPDATE SET
        amount_due = 1.00,
        updated_at = now();
    
    RETURN 'Test invoice TEST-FLOW-001 created successfully for $1.00';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT create_test_invoice_for_jason();