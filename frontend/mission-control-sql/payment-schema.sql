-- Payment tracking schema for Bowery Creative

-- Add Stripe fields to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS campaign_credits INTEGER DEFAULT 0;

-- Create payment intents table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  product_type VARCHAR(50) NOT NULL, -- 'subscription', 'credits', 'service', 'custom'
  product_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  metadata JSONB,
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  stripe_invoice_id VARCHAR(255) UNIQUE,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, void
  due_date DATE,
  paid_date DATE,
  line_items JSONB NOT NULL, -- Array of {description, quantity, unit_price, amount}
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'usage', 'refund', 'adjustment'
  credits INTEGER NOT NULL, -- positive for additions, negative for usage
  balance_after INTEGER NOT NULL,
  description TEXT,
  related_payment_id UUID REFERENCES payment_intents(id),
  related_campaign_id UUID REFERENCES campaigns(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  subscription_id VARCHAR(255) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_payment_intents_client_id ON payment_intents(client_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_credit_transactions_client_id ON credit_transactions(client_id);
CREATE INDEX idx_subscription_history_client_id ON subscription_history(client_id);

-- Create function to add credits
CREATE OR REPLACE FUNCTION add_client_credits(
  p_client_id UUID,
  p_credits INTEGER,
  p_description TEXT DEFAULT NULL,
  p_payment_id UUID DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT campaign_credits INTO v_current_balance
  FROM clients
  WHERE id = p_client_id
  FOR UPDATE;
  
  -- Calculate new balance
  v_new_balance := COALESCE(v_current_balance, 0) + p_credits;
  
  -- Update balance
  UPDATE clients
  SET campaign_credits = v_new_balance
  WHERE id = p_client_id;
  
  -- Record transaction
  INSERT INTO credit_transactions (
    client_id,
    transaction_type,
    credits,
    balance_after,
    description,
    related_payment_id
  ) VALUES (
    p_client_id,
    CASE WHEN p_credits > 0 THEN 'purchase' ELSE 'usage' END,
    p_credits,
    v_new_balance,
    p_description,
    p_payment_id
  );
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- Create function to use credits
CREATE OR REPLACE FUNCTION use_client_credits(
  p_client_id UUID,
  p_credits INTEGER,
  p_campaign_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT campaign_credits INTO v_current_balance
  FROM clients
  WHERE id = p_client_id;
  
  -- Check if sufficient credits
  IF COALESCE(v_current_balance, 0) < p_credits THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  PERFORM add_client_credits(
    p_client_id,
    -p_credits,
    p_description,
    NULL
  );
  
  -- Update the transaction with campaign reference
  UPDATE credit_transactions
  SET related_campaign_id = p_campaign_id
  WHERE client_id = p_client_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(4);
  v_count INTEGER;
  v_invoice_number VARCHAR(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
  
  -- Get count of invoices this year
  SELECT COUNT(*) + 1 INTO v_count
  FROM invoices
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Format: INV-YYYY-00001
  v_invoice_number := 'INV-' || v_year || '-' || LPAD(v_count::VARCHAR, 5, '0');
  
  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Policies for payment_intents
CREATE POLICY "Users can view their organization's payments"
ON payment_intents FOR SELECT
USING (
  client_id IN (
    SELECT id FROM clients 
    WHERE agency_id = auth.jwt() ->> 'organization_id'
  )
);

-- Policies for invoices
CREATE POLICY "Users can view their organization's invoices"
ON invoices FOR SELECT
USING (
  client_id IN (
    SELECT id FROM clients 
    WHERE agency_id = auth.jwt() ->> 'organization_id'
  )
);

-- Policies for credit_transactions
CREATE POLICY "Users can view their organization's credit transactions"
ON credit_transactions FOR SELECT
USING (
  client_id IN (
    SELECT id FROM clients 
    WHERE agency_id = auth.jwt() ->> 'organization_id'
  )
);

-- Policies for subscription_history
CREATE POLICY "Users can view their organization's subscription history"
ON subscription_history FOR SELECT
USING (
  client_id IN (
    SELECT id FROM clients 
    WHERE agency_id = auth.jwt() ->> 'organization_id'
  )
);