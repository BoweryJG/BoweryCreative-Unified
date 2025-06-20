import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface InvoiceEmailRequest {
  invoice: {
    invoice_number: string;
    client_name: string;
    client_email: string;
    amount_due: number;
    due_date: string;
    payment_link: string;
    line_items: Array<{
      description: string;
      amount: number;
    }>;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { invoice }: InvoiceEmailRequest = await req.json();
    
    // Get Resend API key from environment
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }

    // Format the due date
    const dueDate = new Date(invoice.due_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Build line items HTML
    const lineItemsHtml = invoice.line_items
      .map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">$${item.amount.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoice_number}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">BOWERY</h1>
          <p style="color: #666; margin: 5px 0;">Engineering Intelligence</p>
        </div>

        <!-- Invoice Badge -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">Invoice ${invoice.invoice_number}</h2>
          <p style="margin: 5px 0; opacity: 0.9;">Due Date: ${dueDate}</p>
        </div>

        <!-- Client Info -->
        <div style="margin-bottom: 30px;">
          <p style="margin: 5px 0;"><strong>Bill To:</strong></p>
          <p style="margin: 5px 0;">${invoice.client_name}</p>
          <p style="margin: 5px 0;">${invoice.client_email}</p>
        </div>

        <!-- Line Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Description</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 12px; font-weight: bold; font-size: 18px;">Total Due</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px; color: #f59e0b;">
                $${invoice.amount_due.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Payment Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${invoice.payment_link}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Pay Invoice
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 5px 0;">Questions? Contact us at billing@bowerycreativeagency.com</p>
          <p style="margin: 5px 0;">© 2025 Bowery Creative Agency. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bowery Creative Billing <billing@mail.bowerycreativeagency.com>',
        to: invoice.client_email,
        subject: `Invoice ${invoice.invoice_number} - $${invoice.amount_due.toFixed(2)} Due`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || data.name || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invoice email sent successfully',
        emailId: data.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});