import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json()
    console.log('SMS Request received:', requestBody)
    
    const { to, message, invoiceId } = requestBody

    // Validate inputs
    if (!to || !message) {
      throw new Error('Phone number and message are required')
    }
    
    // Ensure phone number is in E.164 format
    let formattedPhone = to.toString()
    if (!formattedPhone.startsWith('+')) {
      // Assume US number if no country code
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone
      } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
        formattedPhone = '+' + formattedPhone
      }
    }
    console.log('Formatted phone:', formattedPhone)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Twilio credentials from environment
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    let smsResult

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      // Send real SMS via Twilio
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
      
      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: twilioPhoneNumber,
          Body: message,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Twilio error: ${error}`)
      }

      const twilioResponse = await response.json()
      
      smsResult = {
        status: 'sent',
        twilio_sid: twilioResponse.sid,
      }
    } else {
      // Mock mode when Twilio is not configured
      console.log('Twilio not configured, using mock mode')
      console.log(`Would send SMS to ${formattedPhone}: ${message}`)
      
      smsResult = {
        status: 'mock_sent',
        twilio_sid: null,
      }
    }

    // Log SMS to database
    const { error: logError } = await supabaseClient
      .from('sms_logs')
      .insert({
        invoice_id: invoiceId,
        phone_number: formattedPhone,
        message: message,
        status: smsResult.status,
        twilio_sid: smsResult.twilio_sid,
        sent_by: 'admin',
      })

    if (logError) {
      console.error('Failed to log SMS:', logError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: smsResult.status,
        message: smsResult.status === 'mock_sent' 
          ? 'SMS mock sent (Twilio not configured)' 
          : 'SMS sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('SMS error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})