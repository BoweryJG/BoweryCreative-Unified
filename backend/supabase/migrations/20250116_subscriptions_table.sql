-- Create subscriptions table for managing recurring payments
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  last_payment_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at_trigger
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Add RLS (Row Level Security) if needed
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Insert Dr. Pedro's subscription record for tracking
INSERT INTO subscriptions (
  stripe_subscription_id,
  stripe_customer_id,
  customer_email,
  customer_name,
  amount,
  currency,
  interval,
  status,
  description,
  metadata
) VALUES (
  'sub_pedro_placeholder', -- Will be updated when actual subscription is created
  'cus_pedro_placeholder', -- Will be updated when actual customer is created
  'greg.pedro@example.com',
  'Dr. Greg Pedro',
  2000.00,
  'usd',
  'month',
  'pending', -- Status before Stripe subscription is created
  'Monthly AI Infrastructure Management - Custom CRM, AI Phone System, Linguistics, Dental Simulators, Website, Chatbot',
  jsonb_build_object(
    'cancellation_policy', 'anytime_30_days_notice',
    'systems_included', jsonb_build_array(
      'Custom CRM System ($45,000 value)',
      'AI Phone + Linguistics ($40,000 value)',
      'Dental Simulators ($20,000 value)',
      'Custom Website ($12,000 value)',
      'AI Chatbot ($8,000 value)',
      '24/7 Monitoring & Support'
    ),
    'infrastructure_value', '125000',
    'service_tier', 'enterprise',
    'client_type', 'dental_practice'
  )
) ON CONFLICT (stripe_subscription_id) DO NOTHING;