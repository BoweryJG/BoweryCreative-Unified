-- Supabase Database Schema for Bowery Creative Client Onboarding System
-- Run this SQL in your Supabase SQL editor to create all necessary tables

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create custom types
CREATE TYPE project_status AS ENUM ('lead', 'qualified', 'proposal_sent', 'contract_signed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'expired');
CREATE TYPE onboarding_step_status AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');

-- Enhanced contacts table
DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Basic info
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  phone TEXT,
  position TEXT,
  
  -- Project details
  project_type TEXT,
  message TEXT,
  budget_range TEXT,
  timeline TEXT,
  urgency TEXT,
  
  -- Lead management
  status project_status DEFAULT 'lead',
  lead_score INTEGER DEFAULT 0,
  source TEXT DEFAULT 'website',
  assigned_to UUID, -- Reference to team member
  
  -- Contact preferences
  preferred_contact_method TEXT DEFAULT 'email',
  timezone TEXT,
  availability TEXT,
  
  -- Metadata
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  last_contacted TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Project details
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL,
  status project_status DEFAULT 'lead',
  
  -- Scope and requirements
  scope_of_work TEXT,
  technical_requirements JSONB,
  deliverables TEXT[],
  
  -- Timeline and budget
  estimated_budget DECIMAL(10,2),
  actual_budget DECIMAL(10,2),
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  
  -- Service packages
  service_packages TEXT[],
  custom_services TEXT[],
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0,
  current_phase TEXT,
  
  -- Metadata
  priority TEXT DEFAULT 'medium',
  complexity TEXT DEFAULT 'medium'
);

-- Service packages table
CREATE TABLE service_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'ai', 'development', 'analytics', etc.
  
  -- Pricing
  base_price DECIMAL(10,2),
  price_per_hour DECIMAL(10,2),
  price_model TEXT DEFAULT 'fixed', -- 'fixed', 'hourly', 'subscription'
  
  -- Package details
  features TEXT[],
  deliverables TEXT[],
  estimated_hours INTEGER,
  estimated_duration_days INTEGER,
  
  -- Requirements
  technical_requirements JSONB,
  prerequisites TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Contracts table
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  
  -- Contract details
  contract_number TEXT UNIQUE,
  title TEXT NOT NULL,
  status contract_status DEFAULT 'draft',
  
  -- Content
  terms_and_conditions TEXT,
  scope_of_work TEXT,
  payment_terms TEXT,
  deliverables TEXT[],
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  
  -- Financial
  total_amount DECIMAL(10,2),
  payment_schedule JSONB, -- Array of payment milestones
  
  -- Signatures
  client_signed_at TIMESTAMP WITH TIME ZONE,
  client_signature_ip TEXT,
  bowery_signed_at TIMESTAMP WITH TIME ZONE,
  
  -- Files
  contract_file_url TEXT,
  signed_contract_url TEXT,
  
  -- Metadata
  template_used TEXT,
  revision_number INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  payment_type TEXT, -- 'deposit', 'milestone', 'final', 'subscription'
  
  -- Schedule
  due_date DATE,
  paid_date TIMESTAMP WITH TIME ZONE,
  
  -- Integration
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  payment_method TEXT,
  
  -- Milestone connection
  milestone_id UUID,
  milestone_description TEXT,
  
  -- Metadata
  notes TEXT,
  receipt_url TEXT,
  invoice_url TEXT
);

-- Project milestones table
CREATE TABLE project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Milestone details
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  
  -- Status and progress
  status onboarding_step_status DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0,
  
  -- Timeline
  start_date DATE,
  due_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  
  -- Deliverables
  deliverables TEXT[],
  deliverable_urls TEXT[],
  
  -- Payment connection
  payment_amount DECIMAL(10,2),
  payment_due BOOLEAN DEFAULT false,
  
  -- Approval
  requires_client_approval BOOLEAN DEFAULT false,
  client_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Dependencies
  depends_on_milestone_ids UUID[],
  
  -- Metadata
  estimated_hours INTEGER,
  actual_hours INTEGER,
  notes TEXT
);

-- Client portal access table
CREATE TABLE client_portal_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Access control
  user_id UUID, -- Supabase Auth user ID
  role TEXT DEFAULT 'client', -- 'client', 'admin', 'viewer'
  permissions JSONB, -- Detailed permissions object
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  
  -- Security
  password_last_changed TIMESTAMP WITH TIME ZONE,
  two_factor_enabled BOOLEAN DEFAULT false,
  
  -- Preferences
  notification_preferences JSONB,
  dashboard_preferences JSONB
);

-- Communication logs table
CREATE TABLE communication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Communication details
  type TEXT NOT NULL, -- 'email', 'call', 'meeting', 'chat', 'sms'
  direction TEXT NOT NULL, -- 'inbound', 'outbound'
  subject TEXT,
  content TEXT,
  
  -- Participants
  from_email TEXT,
  to_email TEXT,
  cc_emails TEXT[],
  participants TEXT[],
  
  -- Status and tracking
  status TEXT DEFAULT 'sent', -- 'draft', 'sent', 'delivered', 'opened', 'clicked'
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  
  -- Integration
  email_provider_id TEXT, -- SendGrid, Resend, etc.
  meeting_link TEXT,
  recording_url TEXT,
  
  -- Automation
  is_automated BOOLEAN DEFAULT false,
  trigger_event TEXT,
  template_used TEXT,
  
  -- Metadata
  tags TEXT[],
  priority TEXT DEFAULT 'normal',
  notes TEXT
);

-- Onboarding steps table
CREATE TABLE onboarding_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Step details
  step_name TEXT NOT NULL,
  step_type TEXT NOT NULL, -- 'form', 'document', 'payment', 'meeting', 'approval'
  order_index INTEGER NOT NULL,
  
  -- Status
  status onboarding_step_status DEFAULT 'not_started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Data
  form_data JSONB,
  documents_required TEXT[],
  documents_uploaded TEXT[],
  
  -- Automation
  auto_advance BOOLEAN DEFAULT false,
  trigger_conditions JSONB,
  
  -- Dependencies
  depends_on_step_ids UUID[],
  blocks_step_ids UUID[],
  
  -- Metadata
  notes TEXT,
  completion_notes TEXT
);

-- Email templates table
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Template details
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  
  -- Categorization
  category TEXT, -- 'onboarding', 'proposal', 'milestone', 'payment'
  trigger_event TEXT, -- 'contact_created', 'contract_signed', etc.
  
  -- Personalization
  variables JSONB, -- Available template variables
  conditional_blocks JSONB, -- Conditional content rules
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  
  -- Usage tracking
  sent_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  
  -- Metadata
  created_by UUID,
  last_used TIMESTAMP WITH TIME ZONE
);

-- File uploads table
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- File details
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Storage
  storage_path TEXT NOT NULL,
  public_url TEXT,
  is_public BOOLEAN DEFAULT false,
  
  -- Categorization
  file_type TEXT, -- 'contract', 'asset', 'deliverable', 'requirement'
  category TEXT,
  tags TEXT[],
  
  -- Metadata
  uploaded_by UUID,
  description TEXT,
  is_archived BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_projects_contact_id ON projects(contact_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_communication_contact_id ON communication_logs(contact_id);
CREATE INDEX idx_onboarding_contact_id ON onboarding_steps(contact_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portal_access_updated_at BEFORE UPDATE ON client_portal_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_updated_at BEFORE UPDATE ON onboarding_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default service packages
INSERT INTO service_packages (name, description, category, base_price, features, deliverables, estimated_hours, estimated_duration_days) VALUES
('AI Strategy Consultation', 'Comprehensive AI roadmap and implementation strategy', 'consulting', 5000, 
 ARRAY['AI readiness assessment', 'Technology stack recommendations', 'Implementation roadmap', 'ROI projections'],
 ARRAY['Strategic plan document', 'Technology recommendations', 'Implementation timeline'],
 40, 14),
 
('Custom AI Agent Development', 'Bespoke AI agents tailored to your business needs', 'ai', 15000,
 ARRAY['Custom AI model training', 'API integration', 'Performance optimization', 'Deployment support'],
 ARRAY['Trained AI model', 'API documentation', 'Deployment guide', 'Performance report'],
 120, 45),
 
('Full-Stack Web Application', 'Complete web application development with modern tech stack', 'development', 25000,
 ARRAY['Frontend development', 'Backend API', 'Database design', 'Cloud deployment'],
 ARRAY['Web application', 'Admin dashboard', 'API documentation', 'Source code'],
 200, 60),
 
('Data Analytics Platform', 'Custom analytics and reporting platform', 'analytics', 20000,
 ARRAY['Data pipeline setup', 'Custom dashboards', 'Automated reporting', 'Data visualization'],
 ARRAY['Analytics platform', 'Custom dashboards', 'Data documentation', 'Training materials'],
 160, 50),
 
('Process Automation', 'Automated workflows and business process optimization', 'automation', 12000,
 ARRAY['Process analysis', 'Workflow automation', 'Integration setup', 'Performance monitoring'],
 ARRAY['Automated workflows', 'Integration documentation', 'Performance metrics', 'User training'],
 96, 35),
 
('AI Infrastructure Setup', 'Complete AI/ML infrastructure and deployment pipeline', 'infrastructure', 18000,
 ARRAY['Cloud infrastructure', 'CI/CD pipeline', 'Monitoring setup', 'Security configuration'],
 ARRAY['Deployed infrastructure', 'Deployment pipeline', 'Monitoring dashboard', 'Security audit'],
 144, 42);

-- Insert default email templates
INSERT INTO email_templates (name, subject, html_content, category, trigger_event, variables) VALUES
('Welcome - New Contact', 'Welcome to Bowery Creative - Next Steps', 
 '<h1>Welcome {{name}}!</h1><p>Thank you for your interest in Bowery Creative. We''ve received your inquiry about {{project_type}} and will respond within 24 hours.</p>',
 'onboarding', 'contact_created',
 '{"name": "Contact name", "project_type": "Project type", "company": "Company name"}'),
 
('Proposal Sent', 'Your Custom Proposal from Bowery Creative',
 '<h1>Your Project Proposal</h1><p>Hi {{name}}, please find attached your custom proposal for {{project_name}}. Total investment: ${{total_amount}}</p>',
 'proposal', 'proposal_sent',
 '{"name": "Contact name", "project_name": "Project name", "total_amount": "Total amount"}'),
 
('Contract Ready', 'Contract Ready for Signature - {{project_name}}',
 '<h1>Ready to Move Forward!</h1><p>Your contract is ready for signature. Please review and sign at your earliest convenience.</p>',
 'contract', 'contract_ready',
 '{"name": "Contact name", "project_name": "Project name", "contract_url": "Contract URL"}'),
 
('Payment Reminder', 'Payment Due - {{project_name}}',
 '<h1>Payment Reminder</h1><p>This is a friendly reminder that payment for {{milestone_name}} is due on {{due_date}}.</p>',
 'payment', 'payment_due',
 '{"name": "Contact name", "project_name": "Project name", "milestone_name": "Milestone", "due_date": "Due date", "amount": "Amount"}'),
 
('Project Kickoff', 'Project Kickoff - Welcome to the Team!',
 '<h1>Let''s Build Something Amazing!</h1><p>Your project {{project_name}} is officially starting. Here''s what happens next...</p>',
 'onboarding', 'project_started',
 '{"name": "Contact name", "project_name": "Project name", "portal_url": "Client portal URL"}');

-- Enable Row Level Security policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)
CREATE POLICY "Public can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own contacts" ON contacts FOR SELECT USING (auth.email() = email OR auth.role() = 'service_role');
CREATE POLICY "Service role can do everything" ON contacts FOR ALL USING (auth.role() = 'service_role');

-- Add similar policies for other tables
CREATE POLICY "Service role can do everything on projects" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on contracts" ON contracts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on milestones" ON project_milestones FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on portal access" ON client_portal_access FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on communication" ON communication_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on onboarding" ON onboarding_steps FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can do everything on files" ON file_uploads FOR ALL USING (auth.role() = 'service_role');

-- Service packages are public read
CREATE POLICY "Public can read service packages" ON service_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can manage service packages" ON service_packages FOR ALL USING (auth.role() = 'service_role');

-- Email templates are admin only
CREATE POLICY "Service role can manage email templates" ON email_templates FOR ALL USING (auth.role() = 'service_role');