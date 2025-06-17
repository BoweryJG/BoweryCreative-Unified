-- Create client_profiles table for storing detailed client information
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT NOT NULL,
    industry TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    website TEXT,
    social_media JSONB DEFAULT '{
        "instagram": [],
        "facebook": [],
        "twitter": [],
        "linkedin": [],
        "youtube": []
    }'::jsonb,
    profile_image TEXT,
    preferences JSONB DEFAULT '{
        "marketingGoals": [],
        "targetAudience": "",
        "brandVoice": "",
        "competitors": []
    }'::jsonb,
    monthly_budget DECIMAL(10, 2),
    package_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view and update their own profile
CREATE POLICY "Users can view their own profile"
    ON public.client_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.client_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.client_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_client_profiles_user_id ON public.client_profiles(user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_client_profiles_updated_at
    BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create campaigns table for tracking client campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'completed', 'draft')),
    type TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    metrics JSONB DEFAULT '{
        "impressions": 0,
        "clicks": 0,
        "conversions": 0,
        "spend": 0
    }'::jsonb,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Users can view their own campaigns"
    ON public.campaigns
    FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage all campaigns"
    ON public.campaigns
    FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- Create indexes
CREATE INDEX idx_campaigns_client_id ON public.campaigns(client_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);

-- Create campaign_analytics table for detailed metrics
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10, 2) DEFAULT 0,
    ctr DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN impressions > 0 THEN ROUND((clicks::DECIMAL / impressions * 100), 2)
            ELSE 0
        END
    ) STORED,
    cpc DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN clicks > 0 THEN ROUND(spend / clicks, 2)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Enable RLS
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view analytics for their campaigns"
    ON public.campaign_analytics
    FOR SELECT
    USING (
        campaign_id IN (
            SELECT id FROM public.campaigns WHERE client_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON public.campaign_analytics(date);

-- Create sample campaigns for testing
CREATE OR REPLACE FUNCTION create_sample_campaigns(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_campaign_id UUID;
BEGIN
    -- Social Media Campaign
    INSERT INTO public.campaigns (client_id, name, status, type, start_date, metrics)
    VALUES (
        p_user_id,
        'Social Media Brand Awareness',
        'active',
        'Social Media',
        CURRENT_DATE - INTERVAL '30 days',
        jsonb_build_object(
            'impressions', 45000,
            'clicks', 2300,
            'conversions', 47,
            'spend', 1500
        )
    ) RETURNING id INTO v_campaign_id;

    -- Add analytics for last 7 days
    INSERT INTO public.campaign_analytics (campaign_id, date, impressions, clicks, conversions, spend)
    SELECT 
        v_campaign_id,
        CURRENT_DATE - (n || ' days')::interval,
        3000 + (random() * 2000)::int,
        150 + (random() * 100)::int,
        3 + (random() * 5)::int,
        200 + (random() * 100)::numeric(10,2)
    FROM generate_series(0, 6) n;

    -- Google Ads Campaign
    INSERT INTO public.campaigns (client_id, name, status, type, start_date, metrics)
    VALUES (
        p_user_id,
        'Google Ads - Service Keywords',
        'active',
        'Search Ads',
        CURRENT_DATE - INTERVAL '45 days',
        jsonb_build_object(
            'impressions', 28000,
            'clicks', 3200,
            'conversions', 89,
            'spend', 2800
        )
    );

    -- Email Campaign
    INSERT INTO public.campaigns (client_id, name, status, type, start_date, end_date, metrics)
    VALUES (
        p_user_id,
        'Spring Newsletter Campaign',
        'completed',
        'Email',
        CURRENT_DATE - INTERVAL '60 days',
        CURRENT_DATE - INTERVAL '30 days',
        jsonb_build_object(
            'impressions', 5000,
            'clicks', 450,
            'conversions', 23,
            'spend', 0
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;