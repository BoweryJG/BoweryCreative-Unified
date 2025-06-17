-- Import existing CRM clients into the billing system

-- First ensure the profiles table has all necessary columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS monthly_billing NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Function to create or update client profiles
CREATE OR REPLACE FUNCTION import_crm_client(
    p_email TEXT,
    p_full_name TEXT,
    p_company_name TEXT,
    p_monthly_billing NUMERIC,
    p_phone TEXT DEFAULT NULL,
    p_title TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_exists BOOLEAN;
BEGIN
    -- Check if user already exists
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        -- Create new user with random password
        -- In production, this would trigger a password reset email
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            p_email,
            crypt(gen_random_uuid()::text, gen_salt('bf')),
            now(),
            jsonb_build_object(
                'full_name', p_full_name,
                'company_name', p_company_name,
                'title', p_title
            ),
            now(),
            now()
        ) RETURNING id INTO v_user_id;
    END IF;
    
    -- Update or insert profile
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        company_name,
        monthly_billing,
        phone,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_email,
        p_full_name,
        p_company_name,
        p_monthly_billing,
        p_phone,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        monthly_billing = EXCLUDED.monthly_billing,
        phone = EXCLUDED.phone,
        updated_at = now();
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Import known clients from your CRM

-- Dr. Greg Pedro - $2,000/month
SELECT import_crm_client(
    'greg@gregpedromd.com',
    'Dr. Greg Pedro',
    'Greg Pedro MD',
    2000,
    NULL,
    'Medical Director'
);

-- Cindi Weiss - Practice Manager for Dr. Pedro
SELECT import_crm_client(
    'cindi@gregpedromd.com',
    'Cindi Weiss',
    'Greg Pedro MD',
    0, -- No separate billing, part of Dr. Pedro's account
    '(845) 409-0692',
    'Practice Manager'
);

-- Sample invoice for Dr. Greg Pedro
DO $$
DECLARE
    v_pedro_id UUID;
    v_invoice_exists BOOLEAN;
BEGIN
    -- Get Dr. Pedro's user ID
    SELECT id INTO v_pedro_id FROM auth.users WHERE email = 'greg@gregpedromd.com';
    
    IF v_pedro_id IS NOT NULL THEN
        -- Check if invoice already exists
        SELECT EXISTS(
            SELECT 1 FROM public.invoices 
            WHERE client_id = v_pedro_id 
            AND invoice_number = 'SVC-2025-001'
        ) INTO v_invoice_exists;
        
        IF NOT v_invoice_exists THEN
            -- Create a sample invoice
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
                'SVC-2025-001',
                v_pedro_id,
                2000.00,
                'USD',
                'sent',
                CURRENT_DATE + INTERVAL '30 days',
                '[{
                    "id": "1",
                    "description": "Enterprise AI Infrastructure Management - January 2025",
                    "quantity": 1,
                    "unit_price": 2000,
                    "amount": 2000
                }]'::jsonb,
                'https://start.bowerycreativeagency.com/pay/SVC-2025-001',
                now()
            );
        END IF;
    END IF;
END $$;

-- Create authorized client entries for dashboard access
INSERT INTO public.authorized_clients (
    user_id,
    organization_name,
    subscription_level,
    subscription_features,
    is_active
)
SELECT 
    id as user_id,
    company_name as organization_name,
    CASE 
        WHEN monthly_billing >= 19500 THEN 'dominance'
        WHEN monthly_billing >= 9950 THEN 'transformation'
        WHEN monthly_billing >= 4997 THEN 'foundation'
        ELSE 'custom'
    END as subscription_level,
    jsonb_build_object(
        'dashboard_components', ARRAY['analytics', 'campaign_manager', 'email_marketing', 'social_media'],
        'api_calls', 100000,
        'team_members', 10,
        'custom_branding', true,
        'priority_support', true,
        'monthly_billing', monthly_billing
    ) as subscription_features,
    true as is_active
FROM public.profiles
WHERE monthly_billing > 0
ON CONFLICT (user_id) DO UPDATE SET
    organization_name = EXCLUDED.organization_name,
    subscription_features = EXCLUDED.subscription_features,
    updated_at = now();

-- Grant admin access to specific emails
UPDATE public.profiles 
SET is_admin = true 
WHERE email IN (
    'jasonwilliamgolden@gmail.com',
    'jgolden@bowerycreativeagency.com'
);

-- Clean up the function
DROP FUNCTION IF EXISTS import_crm_client;