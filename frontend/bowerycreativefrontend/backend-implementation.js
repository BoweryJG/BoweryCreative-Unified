// BoweryCreative Backend API Implementation
// Copy this to your BoweryCreative-backend repository

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Resend = require('resend');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://bowerycreative.netlify.app',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// API Key middleware
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ====== CONTACTS API ======
app.post('/api/contacts', limiter, authenticateAPI, async (req, res) => {
  try {
    const contactData = req.body;
    
    // Check for duplicates in the last 24 hours
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', contactData.email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ 
        error: 'Duplicate submission',
        message: 'Contact already exists' 
      });
    }

    // Create contact
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.get('/api/contacts', authenticateAPI, async (req, res) => {
  try {
    const { status, leadScoreMin, assignedTo, tags } = req.query;
    
    let query = supabase.from('contacts').select('*');
    
    if (status) query = query.eq('status', status);
    if (leadScoreMin) query = query.gte('lead_score', leadScoreMin);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);
    if (tags) query = query.contains('tags', tags.split(','));
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.get('/api/contacts/:id', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

app.put('/api/contacts/:id', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.post('/api/contacts/:id/calculate-lead-score', authenticateAPI, async (req, res) => {
  try {
    const { data: contact, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    
    // Calculate lead score
    let score = 0;
    const factors = {};
    
    // Budget scoring
    const budgetScores = {
      'Under $10k': 10,
      '$10k - $25k': 25,
      '$25k - $50k': 40,
      '$50k - $100k': 60,
      '$100k - $250k': 80,
      '$250k+': 100
    };
    const budgetScore = budgetScores[contact.budget_range] || 0;
    score += budgetScore;
    factors.budget = budgetScore;
    
    // Urgency scoring
    const urgencyScores = {
      'low': 10,
      'medium': 30,
      'high': 60,
      'urgent': 100
    };
    const urgencyScore = urgencyScores[contact.urgency] || 0;
    score += urgencyScore;
    factors.urgency = urgencyScore;
    
    // Update contact with score
    await supabase
      .from('contacts')
      .update({ lead_score: Math.min(score, 100) })
      .eq('id', req.params.id);
    
    res.json({ score: Math.min(score, 100), factors });
  } catch (error) {
    console.error('Error calculating lead score:', error);
    res.status(500).json({ error: 'Failed to calculate lead score' });
  }
});

// ====== ONBOARDING API ======
app.post('/api/onboarding/start', authenticateAPI, async (req, res) => {
  try {
    const { contactId } = req.body;
    
    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        contact_id: contactId,
        name: 'New Project',
        status: 'lead',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (projectError) throw projectError;
    
    // Create onboarding steps
    const steps = [
      { step_name: 'qualification', step_type: 'form', order_index: 0 },
      { step_name: 'packages', step_type: 'form', order_index: 1 },
      { step_name: 'proposal', step_type: 'document', order_index: 2 },
      { step_name: 'contract', step_type: 'document', order_index: 3 },
      { step_name: 'payment', step_type: 'payment', order_index: 4 },
      { step_name: 'kickoff', step_type: 'meeting', order_index: 5 }
    ];
    
    const onboardingSteps = steps.map(step => ({
      contact_id: contactId,
      project_id: project.id,
      ...step,
      status: 'not_started',
      created_at: new Date().toISOString()
    }));
    
    const { data: createdSteps, error: stepsError } = await supabase
      .from('onboarding_steps')
      .insert(onboardingSteps)
      .select();
    
    if (stepsError) throw stepsError;
    
    res.json({ projectId: project.id, steps: createdSteps });
  } catch (error) {
    console.error('Error starting onboarding:', error);
    res.status(500).json({ error: 'Failed to start onboarding' });
  }
});

app.get('/api/onboarding/contacts/:contactId/steps', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('contact_id', req.params.contactId)
      .order('order_index');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching onboarding steps:', error);
    res.status(500).json({ error: 'Failed to fetch onboarding steps' });
  }
});

app.post('/api/onboarding/steps/:stepId/complete', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        form_data: req.body
      })
      .eq('id', req.params.stepId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error completing step:', error);
    res.status(500).json({ error: 'Failed to complete step' });
  }
});

// ====== EMAIL API ======
app.post('/api/emails/send', authenticateAPI, async (req, res) => {
  try {
    const { templateId, to, variables } = req.body;
    
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw templateError;
    
    // Replace variables in template
    let html = template.html_content;
    let subject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: 'Bowery Creative <noreply@bowerycreativeagency.com>',
      to,
      subject,
      html,
      tags: [
        { name: 'template', value: templateId },
        { name: 'type', value: template.category }
      ]
    });
    
    if (error) throw error;
    
    // Log communication
    await supabase
      .from('communication_logs')
      .insert([{
        contact_id: variables.contactId,
        type: 'email',
        direction: 'outbound',
        subject,
        status: 'sent',
        email_provider_id: data.id,
        is_automated: true,
        template_used: templateId,
        created_at: new Date().toISOString()
      }]);
    
    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/emails/send-custom', authenticateAPI, async (req, res) => {
  try {
    const { to, subject, html, text, cc, bcc } = req.body;
    
    const { data, error } = await resend.emails.send({
      from: 'Bowery Creative <noreply@bowerycreativeagency.com>',
      to,
      subject,
      html,
      text,
      cc,
      bcc
    });
    
    if (error) throw error;
    
    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending custom email:', error);
    res.status(500).json({ error: 'Failed to send custom email' });
  }
});

// ====== SERVICES API ======
app.get('/api/services/packages', authenticateAPI, async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    
    let query = supabase
      .from('service_packages')
      .select('*')
      .eq('is_active', isActive === 'true');
    
    if (category) query = query.eq('category', category);
    
    const { data, error } = await query.order('display_order');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    res.status(500).json({ error: 'Failed to fetch service packages' });
  }
});

// ====== ANALYTICS API ======
app.get('/api/analytics/dashboard', authenticateAPI, async (req, res) => {
  try {
    // Total contacts
    const { count: totalContacts } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });
    
    // Active projects
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['in_progress', 'contract_signed']);
    
    // Revenue calculation (simplified)
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('created_at', new Date(new Date().setDate(1)).toISOString());
    
    const monthlyRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    
    // Conversion rate
    const { count: qualifiedLeads } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'lead');
    
    const conversionRate = totalContacts > 0 ? (qualifiedLeads / totalContacts) * 100 : 0;
    
    // Average project value
    const { data: projects } = await supabase
      .from('projects')
      .select('actual_budget')
      .not('actual_budget', 'is', null);
    
    const totalValue = projects?.reduce((sum, p) => sum + (p.actual_budget || 0), 0) || 0;
    const averageProjectValue = projects?.length > 0 ? totalValue / projects.length : 0;
    
    // Upcoming milestones
    const { data: upcomingMilestones } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('status', 'in_progress')
      .order('due_date')
      .limit(5);
    
    res.json({
      totalContacts: totalContacts || 0,
      activeProjects: activeProjects || 0,
      revenue: {
        total: totalValue,
        monthly: monthlyRevenue,
        growth: 0 // Calculate based on previous month
      },
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageProjectValue: Math.round(averageProjectValue),
      upcomingMilestones: upcomingMilestones || []
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`BoweryCreative Backend running on port ${PORT}`);
  console.log('Environment:', {
    hasSupabase: !!process.env.SUPABASE_URL,
    hasResend: !!process.env.RESEND_API_KEY,
    hasAPIKey: !!process.env.API_KEY,
    port: PORT
  });
});

// Export for testing
module.exports = app;