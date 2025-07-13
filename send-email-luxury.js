require('dotenv').config();
const nodemailer = require('nodemailer');
const emailTracker = require('./email-tracker');

// Get command line arguments
const args = process.argv.slice(2);
const template = args[0] || 'essence';
const fromAlias = args[1] || 'hello@bowerycreativeagency.com';
const toEmail = args[2] || 'jasonwilliamgolden@gmail.com';
const subject = args[3] || 'A Message from Bowery Creative';
const message = args[4] || 'We look forward to creating something extraordinary together.';

// Luxury email templates
const templates = {
  essence: (content, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #000000 !important; }
      .email-content { background-color: #1a1a1a !important; }
      .email-text { color: #ffffff !important; }
      .email-muted { color: #999999 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #1d1d1f; background-color: #ffffff;" class="email-body">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="min-width: 100%;">
    <tr>
      <td align="center" style="padding: 80px 20px;" class="email-content">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width: 600px; max-width: 100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 0 0 80px 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: -0.5px; color: #1d1d1f;" class="email-text">BOWERY</h1>
            </td>
          </tr>
          
          <!-- Subject -->
          <tr>
            <td align="center" style="padding: 0 40px 40px 40px;">
              <h2 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: -1px; color: #1d1d1f;" class="email-text">${subject}</h2>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td align="center" style="padding: 0 40px 80px 40px;">
              <p style="margin: 0; font-size: 18px; font-weight: 300; line-height: 1.6; color: #1d1d1f;" class="email-text">${content}</p>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 0 40px 80px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border: 1px solid #1d1d1f; border-radius: 50px;" class="email-text">
                    <a href="https://bowerycreativeagency.com" style="display: inline-block; padding: 12px 32px; font-size: 16px; font-weight: 400; color: #1d1d1f; text-decoration: none;" class="email-text">Learn More</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 40px 40px 0 40px; border-top: 1px solid #d2d2d7;">
              <p style="margin: 0; font-size: 12px; font-weight: 400; color: #86868b;" class="email-muted">© ${new Date().getFullYear()} Bowery Creative Agency</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  
  atelier: (content, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #2c2c2c; background-color: #fdfbf7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width: 600px; max-width: 100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 0 0 60px 0;">
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 42px; font-weight: 400; letter-spacing: 2px; color: #1a1a1a;">BOWERY</h1>
              <div style="width: 40px; height: 1px; background-color: #d4af37; margin: 20px auto 0;"></div>
              <p style="margin: 15px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #8b8b8b;">Creative Agency</p>
            </td>
          </tr>
          
          <!-- Subject -->
          <tr>
            <td align="center" style="padding: 0 60px 40px 60px;">
              <h2 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 400; line-height: 1.3; color: #1a1a1a;">${subject}</h2>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td align="center" style="padding: 0 60px 60px 60px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #4a4a4a;">${content}</p>
            </td>
          </tr>
          
          <!-- Signature -->
          <tr>
            <td align="center" style="padding: 0 60px 60px 60px;">
              <div style="width: 60px; height: 1px; background-color: #d4af37; margin: 0 auto 30px;"></div>
              <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-style: italic; color: #2c2c2c;">The Bowery Atelier</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 40px 60px; border-top: 1px solid #e8e3dc;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 1px; color: #8b8b8b;">
                BOWERYCREATIVEAGENCY.COM<br>
                EST. MMXXIV
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
  
  horizon: (content, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.5; color: #0a0a0a; background-color: #fafafa;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding: 48px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width: 600px; max-width: 100%; margin: 0 auto;">
          <!-- Asymmetric Header -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="60%" style="padding: 0 0 64px 0;">
                    <h1 style="margin: 0; font-size: 14px; font-weight: 500; letter-spacing: -0.2px; color: #0a0a0a;">BOWERY CREATIVE</h1>
                  </td>
                  <td width="40%" align="right" style="padding: 0 0 64px 0;">
                    <p style="margin: 0; font-size: 12px; font-weight: 400; color: #6b6b6b;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Dynamic Subject -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <h2 style="margin: 0; font-size: 48px; font-weight: 200; letter-spacing: -2px; line-height: 1.1; color: #0a0a0a;">${subject}</h2>
            </td>
          </tr>
          
          <!-- Content Block -->
          <tr>
            <td style="padding: 0 0 48px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="8%" style="vertical-align: top; padding-top: 8px;">
                    <div style="width: 2px; height: 60px; background-color: #0a0a0a;"></div>
                  </td>
                  <td width="92%">
                    <p style="margin: 0; font-size: 18px; font-weight: 300; line-height: 1.7; color: #2a2a2a;">${content}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Geometric CTA -->
          <tr>
            <td style="padding: 0 0 80px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #0a0a0a;">
                    <a href="https://bowerycreativeagency.com" style="display: inline-block; padding: 16px 48px; font-size: 14px; font-weight: 400; letter-spacing: 0.5px; color: #ffffff; text-decoration: none;">EXPLORE →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Minimal Footer -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e5e5e5;">
                <tr>
                  <td style="padding: 24px 0 0 0;">
                    <p style="margin: 0; font-size: 11px; font-weight: 400; color: #8a8a8a; line-height: 1.6;">
                      © ${new Date().getFullYear()} Bowery Creative Agency<br>
                      Shaping tomorrow's digital landscape
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
  
  zen: (content, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; line-height: 1.6; color: #333333; background-color: #ffffff;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="min-height: 100vh;">
    <tr>
      <td align="center" valign="middle" style="padding: 120px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="500" style="width: 500px; max-width: 100%;">
          <!-- Single Message -->
          <tr>
            <td align="center" style="padding: 0 0 120px 0;">
              <p style="margin: 0; font-size: 22px; font-weight: 400; line-height: 1.8; color: #1a1a1a;">${content}</p>
            </td>
          </tr>
          
          <!-- Signature -->
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 14px; font-weight: 400; color: #999999;">— Bowery Creative</p>
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
  console.error(`\nError: Template "${template}" not found.`);
  console.log('\nAvailable luxury templates:');
  console.log('  • essence   - Apple-inspired minimalism');
  console.log('  • atelier   - Cartier heritage luxury');
  console.log('  • horizon   - Future-forward premium');
  console.log('  • zen       - Ultimate restraint\n');
  console.log('Usage: node send-email-luxury.js [template] [from] [to] [subject] [message]\n');
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
  from: `Bowery Creative <${fromAlias}>`,
  to: toEmail,
  subject: subject,
  text: `${subject}\n\n${message}\n\n---\nBowery Creative Agency\nbowerycreativeagency.com`,
  html: templates[template](message, subject)
};

// Send the email
console.log(`\nSending luxury email...`);
console.log(`Template: ${template}`);
console.log(`From: ${fromAlias}`);
console.log(`To: ${toEmail}\n`);

transporter.sendMail(mailOptions, async (error, info) => {
  if (error) {
    console.error('Error:', error);
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
    console.log(`✓ Email sent successfully`);
    console.log(`  ID: ${info.messageId}\n`);
    
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
        template_style: 'luxury',
        template_variant: template
      }
    });
    
    console.log(`✓ Email tracked in CRM`);
  }
});