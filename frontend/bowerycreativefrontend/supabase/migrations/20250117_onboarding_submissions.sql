-- Create onboarding_submissions table
CREATE TABLE IF NOT EXISTS public.onboarding_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    client_account_id UUID,
    form_data JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.onboarding_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own submissions
CREATE POLICY "Users can insert their own onboarding submissions"
    ON public.onboarding_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to view their own submissions
CREATE POLICY "Users can view their own onboarding submissions"
    ON public.onboarding_submissions
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Create index for faster queries
CREATE INDEX idx_onboarding_submissions_user_id ON public.onboarding_submissions(user_id);
CREATE INDEX idx_onboarding_submissions_completed_at ON public.onboarding_submissions(completed_at);