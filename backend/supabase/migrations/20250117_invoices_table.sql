-- Create invoices table
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

-- Add phone column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);

-- RLS policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Admin can see all invoices
CREATE POLICY "Admin can view all invoices" ON public.invoices
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- Admin can create invoices
CREATE POLICY "Admin can create invoices" ON public.invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- Admin can update invoices
CREATE POLICY "Admin can update invoices" ON public.invoices
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- Clients can view their own invoices
CREATE POLICY "Clients can view their own invoices" ON public.invoices
    FOR SELECT
    TO authenticated
    USING (
        client_id = auth.uid()
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();