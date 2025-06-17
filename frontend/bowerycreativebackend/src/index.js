import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Parser from 'rss-parser';
import NodeCache from 'node-cache';
import { createClient } from '@supabase/supabase-js';
import {
  createCheckoutSession,
  createPortalSession,
  createPaymentIntent,
  handleWebhook,
  getOrCreateCustomer,
  BOWERY_PRODUCTS
} from './services/stripe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize cache for API responses
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Initialize RSS parser
const parser = new Parser({
  timeout: 10000,
  requestOptions: {
    rejectUnauthorized: false
  }
});

// Initialize Supabase with trimmed keys to handle potential whitespace issues
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

// Debug logging for production troubleshooting
console.log('Supabase Environment Check:');
console.log('- URL present:', !!supabaseUrl);
console.log('- Key present:', !!supabaseKey);
console.log('- Original URL length:', process.env.SUPABASE_URL?.length || 0);
console.log('- Trimmed URL length:', supabaseUrl?.length || 0);
console.log('- Original key length:', (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.length || 0);
console.log('- Trimmed key length:', supabaseKey?.length || 0);

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required Supabase environment variables');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  console.error('URL:', JSON.stringify(supabaseUrl));
  console.error('Key (first 50 chars):', JSON.stringify(supabaseKey.substring(0, 50)));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: [
    'https://bowerycreativeagency.com',
    'https://www.bowerycreativeagency.com',
    'https://bowerycreative.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// API Key authentication middleware
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create new contact (from contact form)
app.post('/api/contacts', authenticateAPI, async (req, res) => {
  try {
    const contactData = req.body;
    
    // Check for duplicate submissions in last 24 hours
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
      .insert([{
        ...contactData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get contact submissions (admin only)
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
    res.status(500).json({ error: error.message });
  }
});

// Get single contact
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
    res.status(500).json({ error: error.message });
  }
});

// Update contact
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
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = supabase
      .from('analytics')
      .select('*');

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track analytics event
app.post('/api/analytics', async (req, res) => {
  try {
    const { event_type, page_path, referrer } = req.body;
    
    const { data, error } = await supabase
      .from('analytics')
      .insert({
        event_type,
        page_path,
        referrer,
        user_agent: req.headers['user-agent'],
        ip_address: req.ip,
        session_id: req.body.session_id,
        metadata: req.body.metadata || {}
      });

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Onboarding API
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

// Email API (using Resend)
app.post('/api/emails/send', authenticateAPI, async (req, res) => {
  try {
    const { templateId, to, variables, from = 'noreply@bowerycreativeagency.com' } = req.body;
    
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email service not configured' });
    }
    
    // Get template from database
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError || !template) {
      return res.status(404).json({ error: 'Email template not found' });
    }
    
    // Replace variables in template
    let htmlContent = template.html_content;
    let textContent = template.text_content || '';
    let subject = template.subject;
    
    Object.entries(variables || {}).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, value);
      textContent = textContent.replace(regex, value);
      subject = subject.replace(regex, value);
    });
    
    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: htmlContent,
        text: textContent
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }
    
    // Log email sent
    await supabase.from('communication_logs').insert({
      type: 'email',
      direction: 'outgoing',
      subject,
      content: htmlContent,
      from_email: from,
      to_email: Array.isArray(to) ? to[0] : to,
      status: 'sent',
      email_provider_id: data.id,
      template_used: templateId,
      is_automated: true
    });
    
    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Service packages API
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
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics dashboard API
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
    
    // Simple metrics for now
    res.json({
      totalContacts: totalContacts || 0,
      activeProjects: activeProjects || 0,
      revenue: {
        total: 0,
        monthly: 0,
        growth: 0
      },
      conversionRate: 0,
      averageProjectValue: 0,
      upcomingMilestones: []
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======= MISSION CONTROL MULTI-TENANT API ENDPOINTS =======

// Multi-tenant middleware - extracts client_id from header or query
const getClientContext = async (req, res, next) => {
  try {
    const clientId = req.headers['x-client-id'] || req.query.client_id;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }
    
    // Verify client exists and is active
    const { data: client, error } = await supabase
      .from('clients')
      .select('*, agencies(*)')
      .eq('id', clientId)
      .eq('status', 'active')
      .single();
    
    if (error || !client) {
      return res.status(404).json({ error: 'Client not found or inactive' });
    }
    
    req.client = client;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Email Campaign Endpoints
app.get('/api/email/campaigns', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = supabase
      .from('email_campaigns')
      .select('*')
      .eq('client_id', req.client.id);
    
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/email/campaigns', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      client_id: req.client.id,
      status: 'draft'
    };
    
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([campaignData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/email/campaigns/:id/send', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { id } = req.params;
    const { test_email } = req.body;
    
    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', id)
      .eq('client_id', req.client.id)
      .single();
    
    if (campaignError || !campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Get recipients based on segment
    let recipients = [];
    if (test_email) {
      recipients = [{ email: test_email, name: 'Test User' }];
    } else {
      const { data: contacts } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', req.client.id)
        .eq('status', 'subscribed');
      
      recipients = contacts || [];
    }
    
    // Send emails
    const sendPromises = recipients.map(async (recipient) => {
      const variables = {
        recipient_name: recipient.name,
        client_name: req.client.name,
        unsubscribe_link: `https://bowerycreativeagency.com/unsubscribe?email=${recipient.email}`
      };
      
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: campaign.from_email || `${req.client.name} <noreply@bowerycreativeagency.com>`,
            to: recipient.email,
            subject: campaign.subject,
            html: replaceVariables(campaign.html_content, variables),
            text: replaceVariables(campaign.text_content || '', variables)
          })
        });
        
        const result = await response.json();
        
        // Log each email
        await supabase.from('email_campaign_logs').insert({
          campaign_id: campaign.id,
          recipient_email: recipient.email,
          status: response.ok ? 'sent' : 'failed',
          message_id: result.id,
          error: !response.ok ? result.message : null
        });
        
        return { email: recipient.email, success: response.ok };
      } catch (error) {
        return { email: recipient.email, success: false, error: error.message };
      }
    });
    
    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;
    
    // Update campaign status
    if (!test_email) {
      await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient_count: recipients.length,
          success_count: successCount
        })
        .eq('id', campaign.id);
    }
    
    // Log usage
    await supabase.from('usage_logs').insert({
      client_id: req.client.id,
      service_type: 'email',
      action: test_email ? 'test_email' : 'campaign_sent',
      quantity: recipients.length,
      metadata: { campaign_id: campaign.id }
    });
    
    res.json({
      success: true,
      sent_count: successCount,
      failed_count: results.length - successCount,
      results: results
    });
    
  } catch (error) {
    console.error('Campaign send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to replace variables
function replaceVariables(content, variables) {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

// Email Templates
app.get('/api/email/templates', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .or(`client_id.eq.${req.client.id},is_global.eq.true`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/email/templates', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const templateData = {
      ...req.body,
      client_id: req.client.id,
      is_global: false
    };
    
    const { data, error } = await supabase
      .from('email_templates')
      .insert([templateData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agency Management Endpoints
app.get('/api/agencies', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agencies', authenticateAPI, async (req, res) => {
  try {
    const agencyData = req.body;
    
    const { data, error } = await supabase
      .from('agencies')
      .insert([agencyData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agencies/:id/clients', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*, client_services(*)')
      .eq('agency_id', req.params.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client Management Endpoints
app.post('/api/clients', authenticateAPI, async (req, res) => {
  try {
    const clientData = req.body;
    
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients/:id', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*, agencies(*), client_services(*)')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', authenticateAPI, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chatbot Management Endpoints
app.get('/api/chatbots', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('client_id', req.client.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chatbots', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const chatbotData = {
      ...req.body,
      client_id: req.client.id
    };
    
    const { data, error } = await supabase
      .from('chatbots')
      .insert([chatbotData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/chatbots/:id', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', req.params.id)
      .eq('client_id', req.client.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public chatbot endpoints (for embedding)
app.post('/api/public/chatbots/:id/chat', async (req, res) => {
  try {
    const { message, visitor_id, conversation_id } = req.body;
    
    // Get chatbot configuration
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*, clients(*)')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single();
    
    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot not found' });
    }
    
    // Log usage
    await supabase.from('usage_logs').insert({
      client_id: chatbot.client_id,
      service_type: 'chatbot',
      action: 'chat_message',
      quantity: 1,
      metadata: { chatbot_id: chatbot.id, visitor_id }
    });
    
    // Generate AI response using OpenRouter
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const systemPrompt = `You are ${chatbot.name}, a helpful assistant for ${chatbot.clients.name}.
Business Info: ${JSON.stringify(chatbot.knowledge_base.business_info)}
Personality: ${JSON.stringify(chatbot.personality)}

Respond professionally and helpfully. If asked about things outside your knowledge, politely redirect to contacting the business directly.`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bowerycreativeagency.com',
        'X-Title': 'Mission Control Chatbot'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error('AI service error');
    }
    
    const aiResult = await response.json();
    const aiMessage = aiResult.choices[0].message.content;
    
    // Save conversation
    let conversationId = conversation_id;
    if (!conversationId) {
      const { data: newConv } = await supabase
        .from('chatbot_conversations')
        .insert({
          chatbot_id: chatbot.id,
          visitor_id,
          messages: []
        })
        .select()
        .single();
      conversationId = newConv.id;
    }
    
    // Update conversation with new messages
    const { data: conversation } = await supabase
      .from('chatbot_conversations')
      .select('messages')
      .eq('id', conversationId)
      .single();
    
    const updatedMessages = [
      ...(conversation.messages || []),
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiMessage, timestamp: new Date().toISOString() }
    ];
    
    await supabase
      .from('chatbot_conversations')
      .update({ messages: updatedMessages })
      .eq('id', conversationId);
    
    res.json({
      message: aiMessage,
      conversation_id: conversationId,
      chatbot_name: chatbot.name
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Sorry, I am having trouble right now. Please try again later.' });
  }
});

// Social Media Management Endpoints
app.get('/api/social/accounts', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('client_id', req.client.id);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/social/accounts', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const accountData = {
      ...req.body,
      client_id: req.client.id
    };
    
    const { data, error } = await supabase
      .from('social_accounts')
      .insert([accountData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Content Management Endpoints
app.get('/api/content/calendar', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;
    
    let query = supabase
      .from('content_calendar')
      .select('*')
      .eq('client_id', req.client.id);
    
    if (start_date) query = query.gte('scheduled_for', start_date);
    if (end_date) query = query.lte('scheduled_for', end_date);
    if (status) query = query.eq('status', status);
    
    const { data, error } = await query.order('scheduled_for');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/content/calendar', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const contentData = {
      ...req.body,
      client_id: req.client.id
    };
    
    const { data, error } = await supabase
      .from('content_calendar')
      .insert([contentData])
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Content Generation Endpoint
app.post('/api/content/generate', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { content_type, topic, platform, tone, length } = req.body;
    
    // Log usage
    await supabase.from('usage_logs').insert({
      client_id: req.client.id,
      service_type: 'content',
      action: 'content_generated',
      quantity: 1,
      metadata: { content_type, platform }
    });
    
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }
    
    const clientInfo = req.client;
    const systemPrompt = `You are a professional content creator for ${clientInfo.name}, a ${clientInfo.business_type} business.
    
Business Details:
- Name: ${clientInfo.name}
- Type: ${clientInfo.business_type}
- Brand Voice: ${clientInfo.branding?.brand_voice || 'professional and trustworthy'}
- Services: ${clientInfo.settings?.services?.join(', ') || 'various services'}

Create ${content_type} content for ${platform} that is:
- ${tone} in tone
- ${length} in length
- Engaging and relevant to the business
- Includes relevant hashtags if appropriate
- Professional but approachable`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bowerycreativeagency.com',
        'X-Title': 'Mission Control Content Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a ${content_type} about: ${topic}` }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error('AI service error');
    }
    
    const aiResult = await response.json();
    const generatedContent = aiResult.choices[0].message.content;
    
    res.json({
      content: generatedContent,
      content_type,
      platform,
      topic,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// SEO Analysis Endpoints
app.post('/api/seo/analyze', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { website, location, keywords } = req.body;
    
    // Log usage
    await supabase.from('usage_logs').insert({
      client_id: req.client.id,
      service_type: 'seo',
      action: 'analysis_generated',
      quantity: 1,
      metadata: { website, location }
    });
    
    // In production, this would call various SEO APIs
    // For now, return mock data
    const analysis = {
      overall_score: 72,
      metrics: {
        google_my_business: { score: 85, status: 'optimized' },
        local_citations: { score: 65, found: 45, total_possible: 80 },
        reviews: { score: 92, rating: 4.8, count: 127 },
        page_speed: { score: 58, load_time: 3.2 },
        mobile_optimization: { score: 78, status: 'responsive' },
        schema_markup: { score: 45, status: 'partial' }
      },
      recommendations: [
        {
          priority: 'high',
          category: 'technical',
          issue: 'Missing Medical Business Schema',
          impact: 'High visibility impact',
          solution: 'Add structured data markup for medical businesses'
        },
        {
          priority: 'medium',
          category: 'local',
          issue: 'Incomplete Local Citations',
          impact: 'Reduced local visibility',
          solution: 'Submit to 35 additional local directories'
        }
      ]
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('SEO analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seo/competitors', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { location, category, radius = 2 } = req.body;
    
    // Use Brave Search API to find local competitors
    const braveApiKey = process.env.BRAVE_API_KEY;
    
    if (braveApiKey) {
      const searchQuery = `${category} near ${location}`;
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=20`, {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': braveApiKey
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Process and return competitor data
        const competitors = data.results?.slice(0, 10).map((result, index) => ({
          name: result.title,
          url: result.url,
          description: result.description,
          ranking: index + 1
        })) || [];
        
        return res.json({ competitors });
      }
    }
    
    // Return mock data if no API key
    const mockCompetitors = [
      {
        name: 'HealthFirst Medical Center',
        address: '123 Main St',
        rating: 4.6,
        reviews: 234,
        distance: '0.5 mi',
        website: 'healthfirstmed.com',
        ranking: 1
      },
      {
        name: 'City Care Physicians',
        address: '456 Broadway',
        rating: 4.7,
        reviews: 189,
        distance: '0.8 mi',
        website: 'citycarephysicians.com',
        ranking: 2
      }
    ];
    
    res.json({ competitors: mockCompetitors });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seo/keywords', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { keywords, location } = req.body;
    const keywordList = keywords.split(',').map(k => k.trim());
    
    // In production, this would use keyword research APIs
    const keywordData = keywordList.map(keyword => ({
      keyword: `${keyword} ${location}`,
      volume: Math.floor(Math.random() * 3000) + 500,
      difficulty: Math.floor(Math.random() * 100),
      cpc: (Math.random() * 5 + 1).toFixed(2),
      trend: Math.random() > 0.5 ? 'up' : 'stable'
    }));
    
    res.json({ keywords: keywordData });
  } catch (error) {
    console.error('Keyword research error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Usage Analytics Endpoint
app.get('/api/usage/analytics', authenticateAPI, getClientContext, async (req, res) => {
  try {
    const { service_type, start_date, end_date } = req.query;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let query = supabase
      .from('usage_logs')
      .select('*')
      .eq('client_id', req.client.id)
      .gte('created_at', start_date || thirtyDaysAgo.toISOString());
    
    if (end_date) query = query.lte('created_at', end_date);
    if (service_type) query = query.eq('service_type', service_type);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Aggregate usage by service
    const usageByService = data.reduce((acc, log) => {
      if (!acc[log.service_type]) {
        acc[log.service_type] = { total: 0, cost_cents: 0 };
      }
      acc[log.service_type].total += log.quantity;
      acc[log.service_type].cost_cents += log.cost_cents;
      return acc;
    }, {});
    
    res.json({
      usage_by_service: usageByService,
      total_usage: data.length,
      raw_logs: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Campaign Marketplace Endpoints

// Get all active campaigns with enhanced filtering
app.get('/api/campaigns', async (req, res) => {
  try {
    const { category, industry, specialty_tags, channel_type } = req.query;
    
    let query = supabase
      .from('campaigns')
      .select('*, campaign_metrics(*), campaign_performance_metrics(*)')
      .eq('is_active', true);
    
    if (category) query = query.eq('category', category);
    if (industry) query = query.eq('industry', industry);
    if (channel_type) query = query.eq('channel_type', channel_type);
    if (specialty_tags) {
      const tags = specialty_tags.split(',');
      query = query.contains('specialty_tags', tags);
    }
    
    const { data: campaigns, error } = await query
      .order('success_rate', { ascending: false });
    
    if (error) throw error;
    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single campaign details
app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*, campaign_metrics(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Purchase a campaign
app.post('/api/campaigns/:id/purchase', authenticateAPI, async (req, res) => {
  try {
    const { id: campaignId } = req.params;
    const { clientId, paymentMethod = 'credit' } = req.body;
    
    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .insert({
        user_id: req.headers['x-user-id'], // Assuming user ID is passed in header
        organization_id: clientId,
        campaign_id: campaignId,
        credits_purchased: campaign.credits_included,
        amount_paid: campaign.base_price,
        payment_method: paymentMethod
      })
      .select()
      .single();
    
    if (purchaseError) throw purchaseError;
    
    res.json(purchase);
  } catch (error) {
    console.error('Purchase campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's campaign purchases
app.get('/api/purchases', authenticateAPI, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    const { data: purchases, error } = await supabase
      .from('campaign_purchases')
      .select('*, campaigns(*)')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });
    
    if (error) throw error;
    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate emails for a campaign
app.post('/api/purchases/:purchaseId/generate', authenticateAPI, async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { recipients } = req.body; // Array of {email, name, customData}
    const userId = req.headers['x-user-id'];
    
    // Verify purchase belongs to user
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .select('*, campaigns(*)')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();
    
    if (purchaseError) throw purchaseError;
    
    // Check if user has credits
    if (purchase.credits_used + recipients.length > purchase.credits_purchased) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }
    
    // Generate personalized emails
    const generatedEmails = [];
    
    for (const recipient of recipients) {
      // Use AI to generate personalized content
      const personalizedContent = await generatePersonalizedEmail(
        purchase.campaigns.ai_prompt_template,
        recipient
      );
      
      // Create mailto link
      const mailtoLink = createMailtoLink(
        recipient.email,
        personalizedContent.subject,
        personalizedContent.body
      );
      
      generatedEmails.push({
        purchase_id: purchaseId,
        recipient_email: recipient.email,
        recipient_name: recipient.name,
        subject_line: personalizedContent.subject,
        email_body: personalizedContent.body,
        personalization_data: recipient.customData,
        mailto_link: mailtoLink
      });
    }
    
    // Save generated emails
    const { data: savedEmails, error: saveError } = await supabase
      .from('generated_emails')
      .insert(generatedEmails)
      .select();
    
    if (saveError) throw saveError;
    
    // Update credits used
    await supabase
      .from('campaign_purchases')
      .update({ credits_used: purchase.credits_used + recipients.length })
      .eq('id', purchaseId);
    
    res.json(savedEmails);
  } catch (error) {
    console.error('Generate emails error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate personalized email content
async function generatePersonalizedEmail(promptTemplate, recipient) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  
  if (!openRouterKey) {
    // Fallback to simple template replacement
    const subject = promptTemplate.includes('{name}') 
      ? promptTemplate.replace('{name}', recipient.name).split('\n')[0]
      : `Important message for ${recipient.name}`;
      
    const body = promptTemplate
      .replace(/\{name\}/g, recipient.name)
      .replace(/\{email\}/g, recipient.email)
      .replace(/\{([^}]+)\}/g, (match, key) => recipient.customData?.[key] || match);
    
    return { subject, body };
  }
  
  try {
    // Use AI for more sophisticated personalization
    const prompt = promptTemplate
      .replace(/\{name\}/g, recipient.name)
      .replace(/\{email\}/g, recipient.email)
      .replace(/\{([^}]+)\}/g, (match, key) => recipient.customData?.[key] || match);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bowerycreativeagency.com',
        'X-Title': 'Mission Control Campaign Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert email copywriter. Generate a professional, engaging email based on the template provided. Extract the subject line as the first line of your response, followed by two newlines, then the email body.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      const content = result.choices[0].message.content;
      const [subject, ...bodyParts] = content.split('\n\n');
      return { 
        subject: subject.replace(/^Subject:\s*/i, ''), 
        body: bodyParts.join('\n\n') 
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
  }
  
  // Fallback to simple replacement if AI fails
  const subject = promptTemplate.split('\n')[0]
    .replace(/\{name\}/g, recipient.name);
  const body = promptTemplate
    .replace(/\{name\}/g, recipient.name)
    .replace(/\{email\}/g, recipient.email)
    .replace(/\{([^}]+)\}/g, (match, key) => recipient.customData?.[key] || match);
  
  return { subject, body };
}

// Helper function to create mailto link
function createMailtoLink(email, subject, body) {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

// Get generated emails for a purchase
app.get('/api/purchases/:purchaseId/emails', authenticateAPI, async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.headers['x-user-id'];
    
    // Verify purchase belongs to user
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .select('id')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();
    
    if (purchaseError) throw purchaseError;
    
    const { data: emails, error } = await supabase
      .from('generated_emails')
      .select('*')
      .eq('purchase_id', purchaseId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(emails);
  } catch (error) {
    console.error('Get generated emails error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Track campaign performance metrics
app.post('/api/campaigns/:id/track-performance', authenticateAPI, async (req, res) => {
  try {
    const { id: campaignId } = req.params;
    const { emails_sent, emails_opened, links_clicked, conversions, revenue_generated } = req.body;
    const userId = req.headers['x-user-id'];
    
    // Verify user has purchased this campaign
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();
    
    if (purchaseError) {
      return res.status(403).json({ error: 'Campaign not purchased' });
    }
    
    // Upsert performance metrics
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('campaign_performance_metrics')
      .upsert({
        campaign_id: campaignId,
        metric_date: today,
        emails_sent,
        emails_opened,
        links_clicked,
        conversions,
        revenue_generated,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'campaign_id,metric_date'
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Track performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get campaign performance analytics
app.get('/api/campaigns/:id/analytics', authenticateAPI, async (req, res) => {
  try {
    const { id: campaignId } = req.params;
    const { start_date, end_date } = req.query;
    const userId = req.headers['x-user-id'];
    
    // Verify access
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();
    
    if (purchaseError) {
      return res.status(403).json({ error: 'Campaign not purchased' });
    }
    
    let query = supabase
      .from('campaign_performance_metrics')
      .select('*')
      .eq('campaign_id', campaignId);
    
    if (start_date) query = query.gte('metric_date', start_date);
    if (end_date) query = query.lte('metric_date', end_date);
    
    const { data: metrics, error } = await query
      .order('metric_date', { ascending: true });
    
    if (error) throw error;
    
    // Calculate totals and averages
    const totals = metrics.reduce((acc, metric) => ({
      emails_sent: acc.emails_sent + metric.emails_sent,
      emails_opened: acc.emails_opened + metric.emails_opened,
      links_clicked: acc.links_clicked + metric.links_clicked,
      conversions: acc.conversions + metric.conversions,
      revenue_generated: acc.revenue_generated + metric.revenue_generated
    }), {
      emails_sent: 0,
      emails_opened: 0,
      links_clicked: 0,
      conversions: 0,
      revenue_generated: 0
    });
    
    const analytics = {
      totals,
      averages: {
        open_rate: totals.emails_sent > 0 ? (totals.emails_opened / totals.emails_sent * 100).toFixed(1) : 0,
        click_rate: totals.emails_opened > 0 ? (totals.links_clicked / totals.emails_opened * 100).toFixed(1) : 0,
        conversion_rate: totals.emails_sent > 0 ? (totals.conversions / totals.emails_sent * 100).toFixed(1) : 0
      },
      daily_metrics: metrics
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create A/B test variant
app.post('/api/campaigns/:id/ab-test', authenticateAPI, async (req, res) => {
  try {
    const { id: campaignId } = req.params;
    const { variant_name, subject_line, preview_text, cta_text, send_time } = req.body;
    const userId = req.headers['x-user-id'];
    
    // Verify access
    const { data: purchase, error: purchaseError } = await supabase
      .from('campaign_purchases')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();
    
    if (purchaseError) {
      return res.status(403).json({ error: 'Campaign not purchased' });
    }
    
    const { data, error } = await supabase
      .from('campaign_ab_tests')
      .insert({
        campaign_id: campaignId,
        variant_name,
        subject_line,
        preview_text,
        cta_text,
        send_time,
        performance_data: {}
      })
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Create A/B test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Podcast feed endpoints
// RSS Feed Parser endpoint
app.post('/api/feeds/rss', async (req, res) => {
  try {
    const { feedUrl, feedName, category, maxEpisodes = 3 } = req.body;
    
    if (!feedUrl) {
      return res.status(400).json({
        success: false,
        error: 'Feed URL is required'
      });
    }

    const cacheKey = `rss-feed-${Buffer.from(feedUrl).toString('base64')}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Parse RSS feed with error handling
    let feed;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (parseError) {
      console.warn(`Failed to parse RSS feed ${feedUrl}:`, parseError.message);
      // Return empty array for invalid feeds instead of throwing error
      return res.json([]);
    }
    
    // Process episodes
    const episodes = feed.items.slice(0, maxEpisodes).map((item, index) => {
      // Check if episode is live (published within 24 hours)
      const pubDate = new Date(item.pubDate || item.isoDate);
      const now = new Date();
      const isLive = !isNaN(pubDate.getTime()) && (now - pubDate) < 24 * 60 * 60 * 1000;
      
      // Extract audio URL from enclosure
      let audioUrl = null;
      if (item.enclosure && item.enclosure.url) {
        audioUrl = item.enclosure.url;
      } else if (item.link) {
        audioUrl = item.link;
      }
      
      // Extract duration if available
      let duration = null;
      if (item.itunes && item.itunes.duration) {
        // Convert duration to seconds
        const durationStr = item.itunes.duration;
        const parts = durationStr.split(':');
        if (parts.length === 3) {
          duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
          duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }

      return {
        id: `${feedName}-${index}-${Date.now()}`,
        title: item.title || 'Untitled Episode',
        author: item.creator || feed.title || feedName,
        description: item.contentSnippet || item.content || item.summary || 'No description available',
        pubDate: item.pubDate || item.isoDate,
        audioUrl: audioUrl,
        duration: duration,
        image: item.itunes?.image || feed.image?.url || `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300`,
        isLive: isLive
      };
    });

    const result = episodes;
    
    // Cache for 30 minutes
    cache.set(cacheKey, result, 1800);
    
    res.json(result);
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse RSS feed',
      details: error.message
    });
  }
});

// Apple Podcasts search endpoint
app.post('/api/feeds/apple', async (req, res) => {
  try {
    const { searchTerm, limit = 15 } = req.body;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }

    const cacheKey = `apple-podcasts-${Buffer.from(searchTerm).toString('base64')}-${limit}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use iTunes Search API
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: searchTerm,
        entity: 'podcast',
        limit: limit,
        media: 'podcast'
      },
      timeout: 10000
    });

    const podcasts = response.data.results.map(podcast => ({
      id: podcast.trackId || podcast.collectionId,
      title: podcast.trackName || podcast.collectionName,
      author: podcast.artistName,
      description: podcast.description || 'No description available',
      image: podcast.artworkUrl600 || podcast.artworkUrl100,
      sourceUrl: podcast.trackViewUrl || podcast.collectionViewUrl,
      genre: podcast.primaryGenreName,
      episodeCount: podcast.trackCount,
      rating: podcast.averageUserRating,
      releaseDate: podcast.releaseDate
    }));

    // Cache for 1 hour
    cache.set(cacheKey, podcasts, 3600);
    
    res.json(podcasts);
  } catch (error) {
    console.error('Error searching Apple Podcasts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search Apple Podcasts',
      details: error.message
    });
  }
});

// Trending podcasts endpoint
app.post('/api/feeds/trending', async (req, res) => {
  try {
    const { categories = ['medical', 'dental', 'healthcare', 'ai'], limit = 10 } = req.body;

    const cacheKey = `trending-podcasts-${categories.join('-')}-${limit}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Mock trending data for now - can be replaced with real trending API
    const trendingPodcasts = [
      {
        id: 'trending-1',
        title: 'The Future of Telemedicine Post-COVID',
        author: 'Healthcare Horizons',
        description: 'Expert panel discusses permanent changes in healthcare delivery and what it means for patient care',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300',
        audioUrl: 'https://example.com/trending1.mp3',
        downloads: 15420,
        pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trending-2',
        title: 'Robotics in Surgery: Year in Review',
        author: 'MedTech Weekly',
        description: 'Breakthrough robotic procedures that saved lives in 2024',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300',
        audioUrl: 'https://example.com/trending2.mp3',
        downloads: 12350,
        pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trending-3',
        title: 'AI Diagnosis: Success Stories from the ER',
        author: 'Emergency Medicine Today',
        description: 'Real cases where AI-assisted diagnosis made the difference',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300',
        audioUrl: 'https://example.com/trending3.mp3',
        downloads: 11200,
        pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trending-4',
        title: 'Dental Implants and 3D Printing Revolution',
        author: 'Digital Dentistry Podcast',
        description: 'How 3D printing is changing everything about dental implants',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300',
        audioUrl: 'https://example.com/trending4.mp3',
        downloads: 9800,
        pubDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'trending-5',
        title: 'Mental Health Apps That Actually Work',
        author: 'Digital Health Review',
        description: 'Evidence-based mental health applications making real impact',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300',
        audioUrl: 'https://example.com/trending5.mp3',
        downloads: 8900,
        pubDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const result = trendingPodcasts.slice(0, limit);
    
    // Cache for 2 hours
    cache.set(cacheKey, result, 7200);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching trending podcasts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending podcasts',
      details: error.message
    });
  }
});

// ======= STRIPE PAYMENT ENDPOINTS =======

// Create checkout session for client payments
app.post('/api/stripe/create-checkout-session', authenticateAPI, async (req, res) => {
  try {
    const {
      clientId,
      clientEmail,
      productType, // 'subscription', 'credits', 'service', 'custom'
      productId,
      quantity,
      successUrl,
      cancelUrl,
      metadata
    } = req.body;
    
    // Validate required fields
    if (!clientId || !clientEmail || !productType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(clientEmail, {
      clientId,
      source: 'mission-control'
    });
    
    // Create checkout session
    const session = await createCheckoutSession({
      clientId,
      clientEmail,
      productType,
      productId,
      quantity,
      successUrl,
      cancelUrl,
      metadata: {
        ...metadata,
        customerId: customer.id
      }
    });
    
    // Store payment intent in database
    await supabase.from('payment_intents').insert({
      client_id: clientId,
      stripe_session_id: session.sessionId,
      product_type: productType,
      product_id: productId,
      amount: metadata?.amount || 0,
      status: 'pending',
      metadata
    });
    
    res.json(session);
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create customer portal session
app.post('/api/stripe/create-portal-session', authenticateAPI, async (req, res) => {
  try {
    const { clientId, returnUrl } = req.body;
    
    // Get client's Stripe customer ID from database
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('stripe_customer_id, email')
      .eq('id', clientId)
      .single();
    
    if (clientError || !client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    let customerId = client.stripe_customer_id;
    
    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await getOrCreateCustomer(client.email, {
        clientId,
        source: 'mission-control'
      });
      
      // Update client with Stripe customer ID
      await supabase
        .from('clients')
        .update({ stripe_customer_id: customer.id })
        .eq('id', clientId);
      
      customerId = customer.id;
    }
    
    const session = await createPortalSession(customerId, returnUrl);
    res.json(session);
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent for custom amounts
app.post('/api/stripe/create-payment-intent', authenticateAPI, async (req, res) => {
  try {
    const {
      amount, // in dollars
      clientId,
      clientEmail,
      description,
      metadata
    } = req.body;
    
    if (!amount || !clientId || !clientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      clientId,
      clientEmail,
      description,
      metadata
    });
    
    // Store payment intent
    await supabase.from('payment_intents').insert({
      client_id: clientId,
      stripe_payment_intent_id: paymentIntent.paymentIntentId,
      amount: amount,
      status: 'pending',
      description,
      metadata
    });
    
    res.json(paymentIntent);
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = await handleWebhook(req.body, signature);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Update payment status
        await supabase
          .from('payment_intents')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);
        
        // Update client subscription if applicable
        if (session.mode === 'subscription') {
          await supabase
            .from('clients')
            .update({
              subscription_id: session.subscription,
              subscription_status: 'active'
            })
            .eq('id', session.client_reference_id);
        }
        
        // Add credits if purchasing campaign credits
        if (session.metadata?.productType === 'credits') {
          const credits = parseInt(session.metadata.creditAmount || '0');
          await supabase.rpc('add_client_credits', {
            p_client_id: session.client_reference_id,
            p_credits: credits
          });
        }
        
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabase
          .from('clients')
          .update({
            subscription_status: subscription.status,
            subscription_end_date: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null
          })
          .eq('subscription_id', subscription.id);
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        await supabase
          .from('payment_intents')
          .update({
            status: 'succeeded',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        await supabase
          .from('payment_intents')
          .update({
            status: 'failed',
            error_message: paymentIntent.last_payment_error?.message
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get payment history for a client
app.get('/api/stripe/payments/:clientId', authenticateAPI, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const { data: payments, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available products and pricing
app.get('/api/stripe/products', async (req, res) => {
  try {
    res.json({
      products: BOWERY_PRODUCTS,
      currency: 'usd'
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});