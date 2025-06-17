-- Create SMS logs table to track invoice SMS messages
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'mock_sent', 'pending')),
  twilio_sid TEXT,
  sent_by TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_sms_logs_invoice_id ON public.sms_logs(invoice_id);
CREATE INDEX idx_sms_logs_created_at ON public.sms_logs(created_at);

-- Enable RLS
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admins can view all SMS logs" ON public.sms_logs
  FOR SELECT 
  USING (
    auth.jwt() ->> 'email' IN (
      'jasonwilliamgolden@gmail.com',
      'jgolden@bowerycreativeagency.com'
    )
  );

-- Create policy for admins to insert SMS logs
CREATE POLICY "Admins can insert SMS logs" ON public.sms_logs
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'jasonwilliamgolden@gmail.com',
      'jgolden@bowerycreativeagency.com'
    )
  );

-- Add phone number to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);