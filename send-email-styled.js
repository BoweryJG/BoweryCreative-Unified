require('dotenv').config();
const nodemailer = require('nodemailer');
const emailTracker = require('./email-tracker');

// Get command line arguments
const args = process.argv.slice(2);
const template = args[0] || 'modern';
const fromAlias = args[1] || 'hello@bowerycreativeagency.com';
const toEmail = args[2] || 'jasonwilliamgolden@gmail.com';
const subject = args[3] || 'Greetings from Bowery Creative';
const message = args[4] || 'We hope this message finds you well. We are excited to connect with you!';

// Email templates
const templates = {
  modern: (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Bowery Creative Agency</h1>
                  <p style="margin: 10px 0 0 0; color: #e9d8fd; font-size: 16px;">Digital Excellence, Delivered</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">${content}</p>
                  <table role="presentation" style="margin-top: 30px;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px;">
                        <a href="https://bowerycreativeagency.com" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600;">Visit Our Website</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                    <strong>Bowery Creative Agency</strong><br>
                    Transforming Ideas into Digital Reality
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    © ${new Date().getFullYear()} Bowery Creative Agency. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  
  minimal: (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #ffffff;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 60px 20px;">
            <table role="presentation" style="width: 580px; max-width: 100%;">
              <!-- Logo -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #1a202c; letter-spacing: -1px;">BOWERY</h1>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #718096; letter-spacing: 3px; text-transform: uppercase;">Creative Agency</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 40px 0;">
                  <p style="margin: 0; color: #2d3748; font-size: 18px; line-height: 1.8;">${content}</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding-top: 40px; text-align: center;">
                  <p style="margin: 0; color: #a0aec0; font-size: 14px;">
                    bowerycreativeagency.com
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  
  vibrant: (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 50px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Bowery Creative</h1>
                  <div style="width: 60px; height: 4px; background-color: #ffffff; margin: 20px auto;"></div>
                  <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 300;">Where Creativity Meets Innovation</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  <div style="background-color: #f7fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #f5576c;">
                    <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.7;">${content}</p>
                  </div>
                  <div style="text-align: center; margin-top: 40px;">
                    <a href="https://bowerycreativeagency.com" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);">Get Started</a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #1a202c; padding: 40px; text-align: center;">
                  <p style="margin: 0 0 15px 0; color: #e2e8f0; font-size: 16px; font-weight: 600;">Let's Create Something Amazing</p>
                  <p style="margin: 0; color: #718096; font-size: 14px;">
                    © ${new Date().getFullYear()} Bowery Creative Agency<br>
                    <a href="mailto:hello@bowerycreativeagency.com" style="color: #f5576c; text-decoration: none;">hello@bowerycreativeagency.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  
  professional: (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border: 1px solid #e0e0e0;">
              <!-- Header -->
              <tr>
                <td style="background-color: #1a202c; padding: 30px 40px;">
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td>
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 400;">BOWERY CREATIVE AGENCY</h1>
                      </td>
                      <td style="text-align: right;">
                        <p style="margin: 0; color: #cbd5e0; font-size: 14px;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">${content}</p>
                  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="width: 50%;">
                        <h3 style="margin: 0 0 10px 0; color: #1a202c; font-size: 16px;">Contact Us</h3>
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          hello@bowerycreativeagency.com<br>
                          bowerycreativeagency.com
                        </p>
                      </td>
                      <td style="width: 50%; text-align: right;">
                        <a href="https://bowerycreativeagency.com" style="display: inline-block; background-color: #1a202c; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 600;">Learn More</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    This email was sent from ${fromAlias}<br>
                    © ${new Date().getFullYear()} Bowery Creative Agency. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

// Validate template
if (!templates[template]) {
  console.error(`Error: Template "${template}" not found.`);
  console.log('\nAvailable templates:');
  Object.keys(templates).forEach(t => console.log(`  - ${t}`));
  console.log('\nUsage: node send-email-styled.js [template] [from] [to] [subject] [message]');
  console.log('Example: node send-email-styled.js vibrant emily@bowerycreativeagency.com client@example.com "Hello!" "Great to connect with you!"');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_1 || 'jgolden@bowerycreativeagency.com',
    pass: process.env.GMAIL_APP_PASSWORD_1
  }
});

// Email options
const mailOptions = {
  from: `${fromAlias.split('@')[0].charAt(0).toUpperCase() + fromAlias.split('@')[0].slice(1)} <${fromAlias}>`,
  to: toEmail,
  subject: subject,
  text: message,
  html: templates[template](message)
};

// Send the email
console.log(`\n📧 Sending styled email...`);
console.log(`Template: ${template}`);
console.log(`From: ${fromAlias}`);
console.log(`To: ${toEmail}`);
console.log(`Subject: ${subject}`);

transporter.sendMail(mailOptions, async (error, info) => {
  if (error) {
    console.error('\n❌ Error sending email:', error);
    // Log failed email
    await emailTracker.logEmail({
      from: fromAlias,
      to: toEmail,
      subject: subject,
      messageId: null,
      status: 'failed',
      template: template,
      senderAlias: fromAlias.split('@')[0],
      error: error.message
    });
  } else {
    console.log('\n✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    // Log successful email
    await emailTracker.logEmail({
      from: fromAlias,
      to: toEmail,
      subject: subject,
      messageId: info.messageId,
      status: 'sent',
      template: template,
      senderAlias: fromAlias.split('@')[0],
      metadata: {
        template_style: 'styled',
        template_variant: template
      }
    });
    
    console.log(`✅ Email tracked in CRM`);
  }
});