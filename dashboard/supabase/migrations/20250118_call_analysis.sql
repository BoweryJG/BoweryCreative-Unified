-- Create call_analysis table for authenticated users
CREATE TABLE IF NOT EXISTS call_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    duration INTEGER DEFAULT 0, -- duration in seconds
    status TEXT CHECK (status IN ('completed', 'missed', 'voicemail', 'failed')) NOT NULL,
    outcome TEXT NOT NULL,
    notes TEXT,
    recording_url TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create public_call_analysis table for demo mode
CREATE TABLE IF NOT EXISTS public_call_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    duration INTEGER DEFAULT 0, -- duration in seconds
    status TEXT CHECK (status IN ('completed', 'missed', 'voicemail', 'failed')) NOT NULL,
    outcome TEXT NOT NULL,
    notes TEXT,
    recording_url TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_call_analysis_user_id ON call_analysis(user_id);
CREATE INDEX idx_call_analysis_created_at ON call_analysis(created_at DESC);
CREATE INDEX idx_call_analysis_status ON call_analysis(status);
CREATE INDEX idx_public_call_analysis_created_at ON public_call_analysis(created_at DESC);
CREATE INDEX idx_public_call_analysis_status ON public_call_analysis(status);

-- Enable RLS on call_analysis table
ALTER TABLE call_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for call_analysis
CREATE POLICY "Users can view own call records" ON call_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call records" ON call_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call records" ON call_analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call records" ON call_analysis
    FOR DELETE USING (auth.uid() = user_id);

-- No RLS on public_call_analysis as it's for demo purposes
-- But we'll add a policy to allow only SELECT operations
ALTER TABLE public_call_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public demo call records" ON public_call_analysis
    FOR SELECT USING (true);

-- Insert some demo data into public_call_analysis
INSERT INTO public_call_analysis (client_name, phone_number, duration, status, outcome, notes, sentiment, follow_up_required, created_at)
VALUES
    ('John Smith', '+1 (555) 123-4567', 245, 'completed', 'Scheduled appointment for teeth whitening', 'Patient very interested in cosmetic procedures', 'positive', false, NOW() - INTERVAL '2 hours'),
    ('Sarah Johnson', '+1 (555) 987-6543', 0, 'missed', 'No answer - left voicemail', NULL, 'neutral', true, NOW() - INTERVAL '5 hours'),
    ('Michael Brown', '+1 (555) 456-7890', 180, 'voicemail', 'Left message about new patient special', 'Follow up tomorrow morning', 'neutral', true, NOW() - INTERVAL '1 day'),
    ('Emily Davis', '+1 (555) 234-5678', 420, 'completed', 'Purchased premium treatment package', 'Very satisfied with consultation, referred 2 friends', 'positive', false, NOW() - INTERVAL '2 days'),
    ('Robert Wilson', '+1 (555) 345-6789', 60, 'completed', 'Rescheduled appointment', 'Had to reschedule due to work conflict', 'neutral', false, NOW() - INTERVAL '3 days'),
    ('Lisa Anderson', '+1 (555) 567-8901', 0, 'failed', 'Number disconnected', 'Update contact information', 'negative', true, NOW() - INTERVAL '4 days'),
    ('David Martinez', '+1 (555) 678-9012', 300, 'completed', 'Consultation completed, considering options', 'Interested but needs to check insurance coverage', 'neutral', true, NOW() - INTERVAL '5 days'),
    ('Jennifer Taylor', '+1 (555) 789-0123', 480, 'completed', 'Scheduled surgery consultation', 'Very interested in facial rejuvenation procedures', 'positive', false, NOW() - INTERVAL '6 days'),
    ('Christopher Lee', '+1 (555) 890-1234', 120, 'voicemail', 'Left appointment reminder', 'Reminder for upcoming appointment next week', 'neutral', false, NOW() - INTERVAL '7 days'),
    ('Maria Garcia', '+1 (555) 901-2345', 360, 'completed', 'Follow-up call successful', 'Patient happy with results, left 5-star review', 'positive', false, NOW() - INTERVAL '8 days');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_call_analysis_updated_at BEFORE UPDATE ON call_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_call_analysis_updated_at BEFORE UPDATE ON public_call_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();