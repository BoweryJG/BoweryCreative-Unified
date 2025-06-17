import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type ProjectStatus = 'lead' | 'qualified' | 'proposal_sent' | 'contract_signed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired';
export type OnboardingStepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface Contact {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  position?: string;
  project_type?: string;
  message?: string;
  budget_range?: string;
  timeline?: string;
  urgency?: string;
  status?: ProjectStatus;
  lead_score?: number;
  source?: string;
  assigned_to?: string;
  preferred_contact_method?: string;
  timezone?: string;
  availability?: string;
  notes?: string;
  tags?: string[];
  last_contacted?: string;
  next_follow_up?: string;
}

export interface Project {
  id?: string;
  created_at?: string;
  updated_at?: string;
  contact_id: string;
  name: string;
  description?: string;
  project_type: string;
  status?: ProjectStatus;
  scope_of_work?: string;
  technical_requirements?: Record<string, any>;
  deliverables?: string[];
  estimated_budget?: number;
  actual_budget?: number;
  start_date?: string;
  estimated_end_date?: string;
  actual_end_date?: string;
  service_packages?: string[];
  custom_services?: string[];
  progress_percentage?: number;
  current_phase?: string;
  priority?: string;
  complexity?: string;
}

export interface ServicePackage {
  id?: string;
  created_at?: string;
  name: string;
  description?: string;
  category?: string;
  base_price?: number;
  price_per_hour?: number;
  price_model?: string;
  features?: string[];
  deliverables?: string[];
  estimated_hours?: number;
  estimated_duration_days?: number;
  technical_requirements?: Record<string, any>;
  prerequisites?: string[];
  is_active?: boolean;
  display_order?: number;
}

export interface Contract {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_id: string;
  contact_id: string;
  contract_number?: string;
  title: string;
  status?: ContractStatus;
  terms_and_conditions?: string;
  scope_of_work?: string;
  payment_terms?: string;
  deliverables?: string[];
  start_date?: string;
  end_date?: string;
  total_amount?: number;
  payment_schedule?: Record<string, any>;
  client_signed_at?: string;
  client_signature_ip?: string;
  bowery_signed_at?: string;
  contract_file_url?: string;
  signed_contract_url?: string;
  template_used?: string;
  revision_number?: number;
  expires_at?: string;
}

export interface Payment {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_id: string;
  contract_id?: string;
  amount: number;
  currency?: string;
  status?: PaymentStatus;
  payment_type?: string;
  due_date?: string;
  paid_date?: string;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  payment_method?: string;
  milestone_id?: string;
  milestone_description?: string;
  notes?: string;
  receipt_url?: string;
  invoice_url?: string;
}

export interface ProjectMilestone {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_id: string;
  title: string;
  description?: string;
  order_index: number;
  status?: OnboardingStepStatus;
  progress_percentage?: number;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  deliverables?: string[];
  deliverable_urls?: string[];
  payment_amount?: number;
  payment_due?: boolean;
  requires_client_approval?: boolean;
  client_approved_at?: string;
  depends_on_milestone_ids?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  notes?: string;
}

export interface OnboardingStep {
  id?: string;
  created_at?: string;
  updated_at?: string;
  contact_id: string;
  project_id?: string;
  step_name: string;
  step_type: string;
  order_index: number;
  status?: OnboardingStepStatus;
  started_at?: string;
  completed_at?: string;
  form_data?: Record<string, any>;
  documents_required?: string[];
  documents_uploaded?: string[];
  auto_advance?: boolean;
  trigger_conditions?: Record<string, any>;
  depends_on_step_ids?: string[];
  blocks_step_ids?: string[];
  notes?: string;
  completion_notes?: string;
}

export interface CommunicationLog {
  id?: string;
  created_at?: string;
  contact_id: string;
  project_id?: string;
  type: string;
  direction: string;
  subject?: string;
  content?: string;
  from_email?: string;
  to_email?: string;
  cc_emails?: string[];
  participants?: string[];
  status?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  email_provider_id?: string;
  meeting_link?: string;
  recording_url?: string;
  is_automated?: boolean;
  trigger_event?: string;
  template_used?: string;
  tags?: string[];
  priority?: string;
  notes?: string;
}

export interface EmailTemplate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  category?: string;
  trigger_event?: string;
  variables?: Record<string, any>;
  conditional_blocks?: Record<string, any>;
  is_active?: boolean;
  version?: number;
  sent_count?: number;
  open_rate?: number;
  click_rate?: number;
  created_by?: string;
  last_used?: string;
}

export interface Subscriber {
  id?: string;
  created_at?: string;
  email: string;
  status?: string;
  source?: string;
}

export interface Analytics {
  id?: string;
  created_at?: string;
  event_type: string;
  page_path?: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}