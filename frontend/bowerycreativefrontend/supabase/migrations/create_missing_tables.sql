-- Create onboarding_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB,
    email TEXT,
    practice_name TEXT,
    status TEXT DEFAULT 'pending_payment',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sms_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id TEXT,
    phone_number TEXT,
    message TEXT,
    status TEXT,
    twilio_sid TEXT,
    sent_by TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT,
    event_data JSONB,
    user_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    stripe_customer_id TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE onboarding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read onboarding_submissions
CREATE POLICY "Allow authenticated to read onboarding_submissions" ON onboarding_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update onboarding_submissions
CREATE POLICY "Allow service role full access to onboarding_submissions" ON onboarding_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Allow service role full access to sms_logs
CREATE POLICY "Allow service role full access to sms_logs" ON sms_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to insert analytics
CREATE POLICY "Allow authenticated to insert analytics" ON analytics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read their own customer data
CREATE POLICY "Allow users to read own customer data" ON customers
    FOR SELECT USING (auth.uid() = id);