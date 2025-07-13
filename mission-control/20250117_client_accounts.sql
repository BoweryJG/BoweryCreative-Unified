-- Create client_accounts table for managing client onboarding and access codes
CREATE TABLE IF NOT EXISTS public.client_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT NOT NULL,
    industry TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'trial')),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_spent DECIMAL(10, 2) DEFAULT 0,
    monthly_amount DECIMAL(10, 2) NOT NULL,
    access_code TEXT NOT NULL UNIQUE,
    code_used BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    payment_completed BOOLEAN DEFAULT FALSE,
    custom_package JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view client accounts
CREATE POLICY "Authenticated users can view client accounts"
    ON public.client_accounts
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create policy for admin users to manage client accounts
CREATE POLICY "Admin users can manage client accounts"
    ON public.client_accounts
    FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- Create function to update client account when code is used
CREATE OR REPLACE FUNCTION public.use_access_code(
    p_access_code TEXT,
    p_user_email TEXT
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    client_data JSONB
) AS $$
DECLARE
    v_client_account public.client_accounts;
BEGIN
    -- Find the client account by access code
    SELECT * INTO v_client_account
    FROM public.client_accounts
    WHERE access_code = p_access_code
    AND code_used = FALSE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid or already used access code', NULL::JSONB;
        RETURN;
    END IF;

    -- Update the client account
    UPDATE public.client_accounts
    SET 
        code_used = TRUE,
        onboarding_completed = TRUE,
        updated_at = NOW()
    WHERE id = v_client_account.id;

    -- Return success with client data
    RETURN QUERY SELECT 
        TRUE, 
        'Access code validated successfully',
        jsonb_build_object(
            'id', v_client_account.id,
            'name', v_client_account.name,
            'email', v_client_account.email,
            'company', v_client_account.company,
            'monthly_amount', v_client_account.monthly_amount,
            'custom_package', v_client_account.custom_package
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark payment as completed
CREATE OR REPLACE FUNCTION public.complete_client_payment(
    p_client_id UUID,
    p_amount DECIMAL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.client_accounts
    SET 
        payment_completed = TRUE,
        status = 'active',
        total_spent = total_spent + p_amount,
        updated_at = NOW()
    WHERE id = p_client_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_client_accounts_access_code ON public.client_accounts(access_code);
CREATE INDEX idx_client_accounts_email ON public.client_accounts(email);
CREATE INDEX idx_client_accounts_status ON public.client_accounts(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_accounts_updated_at
    BEFORE UPDATE ON public.client_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();