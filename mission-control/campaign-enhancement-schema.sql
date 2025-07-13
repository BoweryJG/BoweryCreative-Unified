-- Enhanced Campaign Marketplace Schema Updates
-- Add new fields to campaigns table

ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS compliance_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS channel_type VARCHAR(50) DEFAULT 'email',
ADD COLUMN IF NOT EXISTS specialty_tags TEXT[],
ADD COLUMN IF NOT EXISTS personalization_vars JSONB,
ADD COLUMN IF NOT EXISTS regulatory_notes TEXT;

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS campaign_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  links_clicked INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, metric_date)
);

-- Create A/B testing table
CREATE TABLE IF NOT EXISTS campaign_ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  variant_name VARCHAR(50) NOT NULL,
  subject_line VARCHAR(255),
  preview_text VARCHAR(255),
  cta_text VARCHAR(100),
  send_time TIME,
  performance_data JSONB,
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for new tables
ALTER TABLE campaign_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view performance metrics for purchased campaigns" 
ON campaign_performance_metrics FOR SELECT 
USING (
  campaign_id IN (
    SELECT campaign_id FROM purchases 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view A/B tests for purchased campaigns" 
ON campaign_ab_tests FOR SELECT 
USING (
  campaign_id IN (
    SELECT campaign_id FROM purchases 
    WHERE user_id = auth.uid()
  )
);