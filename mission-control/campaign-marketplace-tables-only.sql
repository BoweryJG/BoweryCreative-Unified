-- Campaign Marketplace Schema - TABLES ONLY
-- Run this first, then insert data separately

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign templates table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  preview_content TEXT,
  ai_prompt_template TEXT,
  base_price DECIMAL(10,2) DEFAULT 50.00,
  credits_included INTEGER DEFAULT 20,
  success_rate DECIMAL(5,2),
  industry VARCHAR(100),
  use_case TEXT,
  example_subject_lines JSONB,
  example_email_preview TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign purchases tracking
CREATE TABLE IF NOT EXISTS campaign_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id),
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  credits_purchased INTEGER NOT NULL,
  credits_used INTEGER DEFAULT 0,
  amount_paid DECIMAL(10,2),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '90 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated emails for each purchase
CREATE TABLE IF NOT EXISTS generated_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES campaign_purchases(id),
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  subject_line TEXT,
  email_body TEXT,
  personalization_data JSONB,
  mailto_link TEXT,
  was_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign performance metrics
CREATE TABLE IF NOT EXISTS campaign_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  total_purchases INTEGER DEFAULT 0,
  total_emails_sent INTEGER DEFAULT 0,
  average_open_rate DECIMAL(5,2),
  average_click_rate DECIMAL(5,2),
  average_response_rate DECIMAL(5,2),
  revenue_generated DECIMAL(10,2),
  last_calculated TIMESTAMPTZ DEFAULT NOW()
);

-- User credits/wallet system
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  credits_balance INTEGER DEFAULT 0,
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  last_purchase TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaign_purchases_user ON campaign_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_purchases_org ON campaign_purchases(organization_id);
CREATE INDEX IF NOT EXISTS idx_generated_emails_purchase ON generated_emails(purchase_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);

-- Add RLS policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active campaigns" ON campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own purchases" ON campaign_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emails" ON generated_emails
  FOR SELECT USING (
    purchase_id IN (
      SELECT id FROM campaign_purchases WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);