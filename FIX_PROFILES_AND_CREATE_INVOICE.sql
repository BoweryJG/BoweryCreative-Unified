-- Fix profiles table and create $1 test invoice
-- Copy and paste this ENTIRE block into Supabase SQL Editor

-- First, add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS monthly_billing NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Now create/update Jason's profile
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

-- Create the invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    amount_due NUMERIC(10, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
    due_date DATE NOT NULL,
    paid_date TIMESTAMPTZ,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_link TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create admin policy for invoices
DROP POLICY IF EXISTS "Admin can manage all invoices" ON public.invoices;
CREATE POLICY "Admin can manage all invoices" ON public.invoices
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

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

-- Verify everything was created
SELECT 
    'Profile created for: ' || full_name || ' (' || email || ')' as result
FROM public.profiles 
WHERE email = 'jasonwilliamgolden@gmail.com'
UNION ALL
SELECT 
    'Invoice created: ' || invoice_number || ' for $' || amount_due::text
FROM public.invoices 
WHERE invoice_number = 'TEST-FLOW-001';