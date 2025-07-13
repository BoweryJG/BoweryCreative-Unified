import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { to, name, accessCode, monthlyAmount, packageName } = await req.json();

    if (!to || !name || !accessCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0;
      background: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      color: white; 
      padding: 40px; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .content { 
      padding: 40px;
    }
    .code-box {
      background: #f8f9fa;
      border: 2px solid #D4AF37;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .access-code {
      font-size: 36px;
      font-weight: bold;
      color: #1a1a1a;
      letter-spacing: 4px;
      margin: 10px 0;
      font-family: monospace;
    }
    .button {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .package-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .steps {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .steps li {
      padding: 10px 0;
      padding-left: 30px;
      position: relative;
    }
    .steps li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #D4AF37;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Bowery Creative</h1>
      <p style="color: #ccc; margin: 10px 0 0 0;">Your Premium Marketing Journey Begins</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hi ${name},</p>
      
      <p>We're thrilled to have you join the Bowery Creative family! Your custom marketing account has been created and is ready for activation.</p>
      
      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #666;">Your Exclusive Access Code:</p>
        <div class="access-code">${accessCode}</div>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Keep this code secure - you'll need it to activate your account</p>
      </div>
      
      <div class="package-info">
        <h3 style="margin-top: 0;">Your Custom Package</h3>
        <p><strong>${packageName}</strong></p>
        <p style="font-size: 24px; color: #D4AF37; margin: 10px 0;">$${monthlyAmount}/month</p>
      </div>
      
      <h3>Getting Started is Easy:</h3>
      <ol class="steps">
        <li>Click the button below to begin onboarding</li>
        <li>Enter your access code: <strong>${accessCode}</strong></li>
        <li>Complete your profile information</li>
        <li>Set up your payment method</li>
        <li>Access your premium dashboard instantly!</li>
      </ol>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://bowerycreativeagency.com" class="button">Start Your Journey</a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        Once you click "Start Project" on our website, you'll be guided through a seamless onboarding experience. 
        Your access code will unlock your custom pricing and package.
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
      
      <p style="color: #666; font-size: 14px;">
        Questions? We're here to help!<br>
        Email: support@bowerycreativeagency.com<br>
        Phone: (845) 409-0692
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Bowery Creative <onboarding@bowerycreativeagency.com>',
        to: [to],
        subject: `${name}, Your Bowery Creative Account is Ready! 🚀`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error sending invite email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});