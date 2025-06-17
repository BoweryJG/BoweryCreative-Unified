import type { 
  Contact, 
  Project, 
  ServicePackage, 
  Contract, 
  Payment,
  CommunicationLog,
  EmailTemplate,
  OnboardingStep,
  ProjectMilestone
} from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'https://bowerycreative-backend.onrender.com';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// API Client with authentication and error handling
class APIClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }
}

const apiClient = new APIClient();

// Contact Management API
export const contactsAPI = {
  // Create a new contact with lead scoring
  async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    return apiClient.post<Contact>('/api/contacts', contact);
  },

  // Get all contacts with filtering
  async getAll(filters?: {
    status?: string;
    leadScoreMin?: number;
    assignedTo?: string;
    tags?: string[];
  }): Promise<Contact[]> {
    return apiClient.get<Contact[]>('/api/contacts', filters);
  },

  // Get single contact
  async getById(id: string): Promise<Contact> {
    return apiClient.get<Contact>(`/api/contacts/${id}`);
  },

  // Update contact
  async update(id: string, updates: Partial<Contact>): Promise<Contact> {
    return apiClient.put<Contact>(`/api/contacts/${id}`, updates);
  },

  // Calculate lead score
  async calculateLeadScore(contactId: string): Promise<{ score: number; factors: Record<string, number> }> {
    return apiClient.post(`/api/contacts/${contactId}/calculate-lead-score`);
  },

  // Schedule follow-up
  async scheduleFollowUp(contactId: string, followUpDate: string, notes?: string): Promise<void> {
    return apiClient.post(`/api/contacts/${contactId}/schedule-follow-up`, { followUpDate, notes });
  }
};

// Onboarding API
export const onboardingAPI = {
  // Start onboarding process
  async startOnboarding(contactId: string): Promise<{ projectId: string; steps: OnboardingStep[] }> {
    return apiClient.post('/api/onboarding/start', { contactId });
  },

  // Get onboarding status
  async getStatus(contactId: string): Promise<{
    currentStep: OnboardingStep;
    completedSteps: number;
    totalSteps: number;
    progress: number;
  }> {
    return apiClient.get(`/api/onboarding/status/${contactId}`);
  },

  // Complete onboarding step
  async completeStep(stepId: string, data: any): Promise<OnboardingStep> {
    return apiClient.post(`/api/onboarding/steps/${stepId}/complete`, data);
  },

  // Skip step
  async skipStep(stepId: string, reason?: string): Promise<OnboardingStep> {
    return apiClient.post(`/api/onboarding/steps/${stepId}/skip`, { reason });
  },

  // Get all steps for a contact
  async getSteps(contactId: string): Promise<OnboardingStep[]> {
    return apiClient.get(`/api/onboarding/contacts/${contactId}/steps`);
  }
};

// Email Automation API with Resend
export const emailAPI = {
  // Send email using template via backend
  async sendEmail(templateId: string, to: string, variables: Record<string, any>): Promise<{
    success: boolean;
    messageId: string;
  }> {
    return apiClient.post('/api/emails/send', {
      templateId,
      to,
      variables
    });
  },

  // Send custom email via backend
  async sendCustomEmail(data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
  }): Promise<{ success: boolean; messageId: string }> {
    return apiClient.post('/api/emails/send-custom', data);
  },

  // Direct Resend integration for immediate needs
  async sendViaResend(data: {
    to: string | string[];
    from?: string;
    subject: string;
    html?: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    tags?: Array<{ name: string; value: string }>;
  }): Promise<{ id: string; from: string; to: string[] }> {
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: data.from || 'Bowery Creative <noreply@bowerycreativeagency.com>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        cc: data.cc,
        bcc: data.bcc,
        reply_to: data.replyTo,
        tags: data.tags
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${error.message || response.statusText}`);
    }

    return response.json();
  },

  // Send medical/healthcare specific emails
  async sendMedicalEmail(data: {
    to: string;
    type: 'appointment_reminder' | 'treatment_followup' | 'consultation_booking' | 'results_ready';
    patientName: string;
    details: Record<string, any>;
  }): Promise<{ success: boolean; messageId: string }> {
    const templates = {
      appointment_reminder: {
        subject: `Appointment Reminder - ${data.details.date}`,
        html: `
          <h2>Hello ${data.patientName},</h2>
          <p>This is a reminder about your upcoming appointment:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${data.details.date}</p>
            <p><strong>Time:</strong> ${data.details.time}</p>
            <p><strong>Provider:</strong> ${data.details.provider}</p>
            <p><strong>Location:</strong> ${data.details.location}</p>
          </div>
          <p>Please arrive 15 minutes early to complete any necessary paperwork.</p>
        `
      },
      treatment_followup: {
        subject: `Follow-up: How are you feeling, ${data.patientName}?`,
        html: `
          <h2>Hello ${data.patientName},</h2>
          <p>We hope you're doing well after your recent ${data.details.treatment} treatment.</p>
          <p>It's been ${data.details.daysSince} days since your procedure. We'd love to hear how you're feeling.</p>
          <p>If you have any concerns or questions, please don't hesitate to contact us.</p>
        `
      },
      consultation_booking: {
        subject: 'Your Consultation is Confirmed',
        html: `
          <h2>Welcome ${data.patientName},</h2>
          <p>Your consultation has been successfully scheduled.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Consultation Type:</strong> ${data.details.consultationType}</p>
            <p><strong>Date:</strong> ${data.details.date}</p>
            <p><strong>Duration:</strong> ${data.details.duration}</p>
            <p><strong>Format:</strong> ${data.details.format}</p>
          </div>
          <p>We'll send you a reminder 24 hours before your consultation.</p>
        `
      },
      results_ready: {
        subject: 'Your Results Are Ready',
        html: `
          <h2>Hello ${data.patientName},</h2>
          <p>Your ${data.details.testType} results are now available.</p>
          <p>Please log into your patient portal to view your results, or contact our office to discuss them with your provider.</p>
        `
      }
    };

    const template = templates[data.type];
    return emailAPI.sendViaResend({
      to: data.to,
      subject: template.subject,
      html: template.html,
      tags: [
        { name: 'type', value: data.type },
        { name: 'patient', value: data.patientName }
      ]
    }).then(result => ({
      success: true,
      messageId: result.id
    }));
  },

  // Get email templates
  async getTemplates(category?: string): Promise<EmailTemplate[]> {
    return apiClient.get('/api/emails/templates', { category });
  },

  // Create email template
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    return apiClient.post('/api/emails/templates', template);
  },

  // Update template
  async updateTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiClient.put(`/api/emails/templates/${id}`, updates);
  },

  // Get email logs for contact
  async getContactEmails(contactId: string): Promise<CommunicationLog[]> {
    return apiClient.get(`/api/emails/contacts/${contactId}/logs`);
  }
};

// Service Packages API
export const servicesAPI = {
  // Get all active service packages
  async getPackages(category?: string): Promise<ServicePackage[]> {
    return apiClient.get('/api/services/packages', { category, isActive: true });
  },

  // Get package details
  async getPackageById(id: string): Promise<ServicePackage> {
    return apiClient.get(`/api/services/packages/${id}`);
  },

  // Calculate custom quote
  async calculateQuote(data: {
    packageIds: string[];
    customServices?: string[];
    urgency?: string;
    complexity?: string;
  }): Promise<{
    basePrice: number;
    adjustments: Record<string, number>;
    totalPrice: number;
    estimatedHours: number;
    estimatedDuration: string;
  }> {
    return apiClient.post('/api/services/calculate-quote', data);
  }
};

// Contract Management API
export const contractsAPI = {
  // Generate contract from template
  async generateContract(data: {
    projectId: string;
    contactId: string;
    templateId?: string;
    customTerms?: string;
  }): Promise<Contract> {
    return apiClient.post('/api/contracts/generate', data);
  },

  // Send contract for signing
  async sendForSigning(contractId: string): Promise<{
    success: boolean;
    signingUrl: string;
  }> {
    return apiClient.post(`/api/contracts/${contractId}/send`);
  },

  // Record signature
  async recordSignature(contractId: string, signatureData: {
    signatureImage?: string;
    ipAddress: string;
    signedAt: string;
  }): Promise<Contract> {
    return apiClient.post(`/api/contracts/${contractId}/sign`, signatureData);
  },

  // Get contracts for project
  async getProjectContracts(projectId: string): Promise<Contract[]> {
    return apiClient.get(`/api/contracts/projects/${projectId}`);
  }
};

// Payment Processing API
export const paymentsAPI = {
  // Create payment intent
  async createPaymentIntent(data: {
    amount: number;
    currency?: string;
    projectId: string;
    description?: string;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    return apiClient.post('/api/payments/create-intent', data);
  },

  // Process payment
  async processPayment(paymentIntentId: string): Promise<Payment> {
    return apiClient.post(`/api/payments/process/${paymentIntentId}`);
  },

  // Get payment history
  async getPaymentHistory(projectId: string): Promise<Payment[]> {
    return apiClient.get(`/api/payments/projects/${projectId}`);
  },

  // Create invoice
  async createInvoice(data: {
    projectId: string;
    items: { description: string; amount: number }[];
    dueDate?: string;
  }): Promise<{
    invoiceId: string;
    invoiceUrl: string;
    amount: number;
  }> {
    return apiClient.post('/api/payments/invoices', data);
  }
};

// Project Management API
export const projectsAPI = {
  // Create project
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return apiClient.post('/api/projects', project);
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return apiClient.put(`/api/projects/${id}`, updates);
  },

  // Get project details with milestones
  async getProjectWithMilestones(id: string): Promise<{
    project: Project;
    milestones: ProjectMilestone[];
    progress: number;
  }> {
    return apiClient.get(`/api/projects/${id}/details`);
  },

  // Update milestone
  async updateMilestone(milestoneId: string, updates: Partial<ProjectMilestone>): Promise<ProjectMilestone> {
    return apiClient.put(`/api/projects/milestones/${milestoneId}`, updates);
  },

  // Complete milestone
  async completeMilestone(milestoneId: string, deliverableUrls?: string[]): Promise<ProjectMilestone> {
    return apiClient.post(`/api/projects/milestones/${milestoneId}/complete`, { deliverableUrls });
  }
};

// OpenRouter AI API
export const openRouterAPI = {
  // Chat completion with various models
  async chat(data: {
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }): Promise<{ content: string; model: string; usage: any }> {
    const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Bowery Creative AI'
      },
      body: JSON.stringify({
        model: data.model || 'anthropic/claude-3.5-sonnet',
        messages: data.messages,
        temperature: data.temperature || 0.7,
        max_tokens: data.max_tokens || 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: result.choices[0].message.content,
      model: result.model,
      usage: result.usage
    };
  },

  // Medical/Healthcare specific models
  async medicalChat(data: {
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    context?: string;
  }): Promise<{ content: string; citations?: string[] }> {
    // Use specialized medical models when available
    return openRouterAPI.chat({
      messages: data.messages,
      model: 'meta-llama/llama-3.2-90b-vision-instruct', // Or other appropriate model
      temperature: 0.3 // Lower temperature for medical accuracy
    });
  },

  // Generate treatment recommendations
  async generateTreatmentPlan(data: {
    patientProfile: any;
    condition: string;
    preferences?: string[];
  }): Promise<{ plan: string; alternatives: string[] }> {
    const prompt = `Generate a personalized treatment plan for:
    Condition: ${data.condition}
    Patient Profile: ${JSON.stringify(data.patientProfile)}
    Preferences: ${data.preferences?.join(', ') || 'None specified'}
    
    Provide evidence-based recommendations suitable for medical/aesthetic practices.`;

    const response = await openRouterAPI.chat({
      messages: [
        { role: 'system', content: 'You are a medical AI assistant providing treatment recommendations for healthcare professionals.' },
        { role: 'user', content: prompt }
      ],
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.3
    });

    // Parse the response to extract plan and alternatives
    return {
      plan: response.content,
      alternatives: []
    };
  }
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalContacts: number;
    activeProjects: number;
    revenue: { total: number; monthly: number; growth: number };
    conversionRate: number;
    averageProjectValue: number;
    upcomingMilestones: ProjectMilestone[];
  }> {
    return apiClient.get('/api/analytics/dashboard');
  },

  // Get conversion funnel
  async getConversionFunnel(dateRange?: { start: string; end: string }): Promise<{
    stages: { name: string; count: number; conversionRate: number }[];
  }> {
    return apiClient.get('/api/analytics/funnel', dateRange);
  },

  // Get revenue analytics
  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{
    data: { date: string; revenue: number; projects: number }[];
    total: number;
    average: number;
  }> {
    return apiClient.get('/api/analytics/revenue', { period });
  }
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  return apiClient.get('/health');
};

// Export the API client for custom endpoints
export { apiClient };