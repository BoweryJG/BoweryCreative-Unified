-- Update payment URLs from old domain to new payment portal domain
-- This migration updates all existing payment links in the database

-- Update invoices table
UPDATE public.invoices 
SET 
    payment_link = REPLACE(payment_link, 'https://start.bowerycreativeagency.com', 'https://pay.bowerycreative.com'),
    updated_at = now()
WHERE payment_link LIKE '%start.bowerycreativeagency.com%';

-- Log the changes for audit
DO $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % invoice payment links from start.bowerycreativeagency.com to pay.bowerycreative.com', v_updated_count;
END $$;

-- Update any other tables that might contain payment URLs
-- (Add more UPDATE statements here if other tables contain payment links)