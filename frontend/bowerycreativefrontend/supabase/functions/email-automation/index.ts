import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  contactId: string;
  templateId?: string;
  triggerEvent: string;
  customData?: Record<string, any>;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables?: Record<string, any>;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  [key: string]: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { contactId, templateId, triggerEvent, customData = {} }: EmailRequest = await req.json()

    // Get contact information
    const { data: contact, error: contactError } = await supabaseClient
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      throw new Error(`Contact not found: ${contactError?.message}`)
    }

    // Get email template
    let template: EmailTemplate
    if (templateId) {
      const { data: templateData, error: templateError } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError || !templateData) {
        throw new Error(`Template not found: ${templateError?.message}`)
      }
      template = templateData
    } else {
      // Find template by trigger event
      const { data: templateData, error: templateError } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('trigger_event', triggerEvent)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (templateError || !templateData) {
        throw new Error(`No template found for trigger: ${triggerEvent}`)
      }
      template = templateData
    }

    // Prepare template variables
    const templateVars = {
      name: contact.name,
      email: contact.email,
      company: contact.company || 'Your Company',
      project_type: contact.project_type || 'your project',
      ...customData
    }

    // Replace variables in subject and content
    let subject = template.subject
    let htmlContent = template.html_content
    let textContent = template.text_content || ''

    Object.entries(templateVars).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value))
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value))
    })

    // Send email using Resend (or your preferred email service)
    const emailResponse = await sendEmail({
      to: contact.email,
      subject,
      html: htmlContent,
      text: textContent
    })

    // Log communication
    await supabaseClient
      .from('communication_logs')
      .insert({
        contact_id: contactId,
        type: 'email',
        direction: 'outbound',
        subject,
        content: htmlContent,
        to_email: contact.email,
        from_email: 'noreply@bowerycreativeagency.com',
        status: 'sent',
        is_automated: true,
        trigger_event: triggerEvent,
        template_used: template.name,
        email_provider_id: emailResponse.id
      })

    // Update template usage stats
    await supabaseClient
      .from('email_templates')
      .update({
        sent_count: (template.sent_count || 0) + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', template.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: emailResponse.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Email automation error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function sendEmail({ to, subject, html, text }: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is required')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Bowery Creative <noreply@bowerycreativeagency.com>',
      to: [to],
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to send email: ${response.status} ${errorData}`)
  }

  return await response.json()
}

/* Deno.cron("Send follow-up emails", "0 9 * * *", async () => {
  // Daily cron job to send follow-up emails
  console.log("Running daily follow-up email job...")
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  // Find contacts that need follow-up
  const { data: contacts } = await supabaseClient
    .from('contacts')
    .select('*')
    .not('next_follow_up', 'is', null)
    .lte('next_follow_up', new Date().toISOString())
    .eq('status', 'lead')

  for (const contact of contacts || []) {
    try {
      // Send follow-up email
      await sendEmail({
        to: contact.email,
        subject: `Following up on your ${contact.project_type} project`,
        html: `
          <h1>Hi ${contact.name},</h1>
          <p>Just wanted to follow up on your inquiry about ${contact.project_type}.</p>
          <p>Do you have any questions about how we can help with your project?</p>
          <p>Best regards,<br>Bowery Creative Team</p>
        `,
        text: `Hi ${contact.name}, just wanted to follow up on your inquiry about ${contact.project_type}. Do you have any questions about how we can help with your project?`
      })

      // Update next follow-up date (7 days from now)
      const nextFollowUp = new Date()
      nextFollowUp.setDate(nextFollowUp.getDate() + 7)
      
      await supabaseClient
        .from('contacts')
        .update({ 
          next_follow_up: nextFollowUp.toISOString(),
          last_contacted: new Date().toISOString()
        })
        .eq('id', contact.id)

    } catch (error) {
      console.error(`Failed to send follow-up to ${contact.email}:`, error)
    }
  }
}) */