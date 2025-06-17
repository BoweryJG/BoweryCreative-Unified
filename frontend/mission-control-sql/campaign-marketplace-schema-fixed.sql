-- Campaign Marketplace Schema for Mission Control (Fixed Version)
-- Run this in your Supabase SQL Editor

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

-- Campaign purchases tracking (modified to make organization_id optional)
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

-- Lead lists for targeting
CREATE TABLE IF NOT EXISTS lead_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  industry VARCHAR(100),
  criteria JSONB,
  total_leads INTEGER,
  quality_score DECIMAL(3,2),
  price_per_lead DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
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

-- Create indexes for performance
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view own purchases" ON campaign_purchases;
DROP POLICY IF EXISTS "Users can view own emails" ON generated_emails;
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;

-- Anyone can view active campaigns
CREATE POLICY "Public can view active campaigns" ON campaigns
  FOR SELECT USING (is_active = true);

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON campaign_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own generated emails
CREATE POLICY "Users can view own emails" ON generated_emails
  FOR SELECT USING (
    purchase_id IN (
      SELECT id FROM campaign_purchases WHERE user_id = auth.uid()
    )
  );

-- Users can view their own credits
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Insert sample campaigns with properly formatted JSON
INSERT INTO campaigns (name, description, category, preview_content, ai_prompt_template, success_rate, industry, use_case, example_subject_lines, example_email_preview)
VALUES 
(
  'New Patient Welcome Series',
  'Automated welcome emails for new medical practice patients',
  'Healthcare',
  'Welcome new patients with a warm, professional email series that builds trust and encourages appointment booking.',
  'Create a warm, professional welcome email for a new patient named {name} at {practice_name}. Mention their upcoming appointment on {date} and highlight 3 key benefits of choosing our practice. Keep tone friendly but professional.',
  85.5,
  'Medical',
  'Onboarding new patients',
  '["Welcome to {practice_name}, {name}!", "Your Health Journey Starts Here", "Everything You Need to Know Before Your First Visit"]'::jsonb,
  'Dear {name}, Welcome to {practice_name}! We are thrilled to have you as our newest patient and look forward to partnering with you on your health journey...'
),
(
  'Appointment Reminder Campaign',
  'Reduce no-shows with friendly appointment reminders',
  'Healthcare', 
  'Send timely reminders that reduce no-shows by 40% on average.',
  'Write a friendly appointment reminder for {name} who has an appointment on {date} at {time} with Dr. {doctor}. Include parking instructions and what to bring. Add a personal touch.',
  92.0,
  'Medical',
  'Appointment management',
  '["Don''t Forget: Your Appointment Tomorrow", "See You Soon, {name}!", "Quick Reminder About Your Visit"]'::jsonb,
  'Hi {name}, Just a friendly reminder about your appointment tomorrow at {time} with Dr. {doctor}. We are looking forward to seeing you!...'
),
(
  'Win-Back Inactive Patients',
  'Re-engage patients who haven''t visited in 6+ months',
  'Healthcare',
  'Bring back 30% of inactive patients with personalized win-back campaigns.',
  'Create a win-back email for {name} who last visited {months_ago} months ago. Mention new services, extended hours, or special offers. Express that we miss them and care about their health.',
  68.5,
  'Medical',
  'Patient retention',
  '["We Miss You, {name}!", "It''s Time for Your Check-up", "Special Offer for Returning Patients"]'::jsonb,
  'Dear {name}, We noticed it has been a while since your last visit, and we wanted to check in. Your health is important to us...'
),
(
  'Seasonal Health Campaign',
  'Promote flu shots, health screenings, and seasonal services',
  'Healthcare',
  'Drive seasonal service bookings with timely health campaigns.',
  'Write an email promoting {seasonal_service} to {name}. Emphasize the importance of preventive care, mention limited appointment availability, and include a clear call-to-action to book online or call.',
  78.0,
  'Medical',
  'Preventive care promotion',
  '["Flu Season is Here - Protect Yourself", "Time for Your Annual Health Screening", "Spring Into Better Health"]'::jsonb,
  'Hi {name}, With flu season approaching, now is the perfect time to get your flu shot. We have appointments available...'
),
(
  'Professional Referral Outreach',
  'Build referral relationships with other healthcare providers',
  'Healthcare',
  'Expand your referral network with targeted outreach to fellow professionals.',
  'Compose a professional referral introduction email from Dr. {your_name} to Dr. {recipient_name}. Briefly introduce the practice, highlight specialties, and suggest mutual referral opportunities. Keep it concise and professional.',
  45.5,
  'Medical',
  'B2B networking',
  '["Exploring Referral Partnership Opportunities", "Connecting Healthcare Professionals", "Introduction from Dr. {your_name}"]'::jsonb,
  'Dear Dr. {recipient_name}, I hope this email finds you well. I am reaching out to introduce myself and explore potential collaboration...'
);

-- Create initial metrics for the campaigns
INSERT INTO campaign_metrics (campaign_id, total_purchases, average_open_rate, average_response_rate)
SELECT 
  id,
  FLOOR(RANDOM() * 50 + 10)::integer,
  ROUND((RANDOM() * 30 + 50)::numeric, 1),
  ROUND((RANDOM() * 10 + 5)::numeric, 1)
FROM campaigns;