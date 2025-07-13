require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_1 || 'jgolden@bowerycreativeagency.com',
    pass: process.env.GMAIL_APP_PASSWORD_1
  }
});

// Email with all signature variations
const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="700" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 300; color: #000;">Your Email Signature Collection</h1>
              <p style="margin: 0 0 40px 0; font-size: 16px; line-height: 1.6; color: #666;">
                Here are all 5 signature variations for your review. Each represents a different aesthetic approach while maintaining professional excellence.
              </p>

              <!-- Version 1 -->
              <div style="background-color: #fafafa; padding: 30px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #999; letter-spacing: 1px; text-transform: uppercase;">Version 1: Ultra-Minimalist</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  <tr>
                    <td style="padding: 0;">
                      <div style="font-size: 16px; font-weight: 600; color: #000000; letter-spacing: -0.3px;">Jason Golden</div>
                      <div style="font-size: 13px; color: #666666; margin-top: 2px; letter-spacing: 0.5px;">FOUNDER & CREATIVE CHAIRMAN</div>
                      <div style="font-size: 13px; color: #999999; margin-top: 2px;">Bowery Creative Agency</div>
                      <div style="margin-top: 16px;">
                        <a href="https://bowerycreativeagency.com" style="font-size: 12px; color: #000000; text-decoration: none;">bowerycreativeagency.com</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Version 2 -->
              <div style="background-color: #fafafa; padding: 30px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #999; letter-spacing: 1px; text-transform: uppercase;">Version 2: Elegant with Divider</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  <tr>
                    <td style="padding: 0;">
                      <div style="font-size: 18px; font-weight: 300; color: #000000; letter-spacing: -0.5px;">Jason Golden</div>
                      <div style="width: 30px; height: 2px; background-color: #000000; margin: 12px 0;"></div>
                      <div style="font-size: 11px; color: #666666; letter-spacing: 1.5px; text-transform: uppercase;">Founder & Creative Chairman</div>
                      <div style="font-size: 14px; color: #000000; margin-top: 8px; font-weight: 500;">Bowery Creative Agency</div>
                      <div style="margin-top: 20px;">
                        <a href="mailto:jgolden@bowerycreativeagency.com" style="font-size: 13px; color: #666666; text-decoration: none;">jgolden@bowerycreativeagency.com</a><br>
                        <a href="https://bowerycreativeagency.com" style="font-size: 13px; color: #666666; text-decoration: none;">bowerycreativeagency.com</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Version 3 -->
              <div style="background-color: #fafafa; padding: 30px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #999; letter-spacing: 1px; text-transform: uppercase;">Version 3: Modern Professional</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <tr>
                    <td style="padding: 0; border-left: 3px solid #000000; padding-left: 16px;">
                      <div style="font-size: 16px; font-weight: 600; color: #000000;">JASON GOLDEN</div>
                      <div style="font-size: 12px; color: #666666; margin-top: 4px; letter-spacing: 0.3px;">Founder & Creative Chairman</div>
                      <div style="font-size: 13px; color: #000000; margin-top: 12px; font-weight: 500;">BOWERY CREATIVE AGENCY</div>
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;">
                        <tr>
                          <td style="padding: 0;">
                            <a href="mailto:jgolden@bowerycreativeagency.com" style="font-size: 12px; color: #666666; text-decoration: none;">Email</a>
                          </td>
                          <td style="padding: 0 8px; color: #cccccc;">|</td>
                          <td style="padding: 0;">
                            <a href="https://bowerycreativeagency.com" style="font-size: 12px; color: #666666; text-decoration: none;">Website</a>
                          </td>
                          <td style="padding: 0 8px; color: #cccccc;">|</td>
                          <td style="padding: 0;">
                            <a href="https://linkedin.com/company/bowerycreative" style="font-size: 12px; color: #666666; text-decoration: none;">LinkedIn</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Version 4 -->
              <div style="background-color: #fafafa; padding: 30px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #999; letter-spacing: 1px; text-transform: uppercase;">Version 4: Luxury Minimal (Recommended)</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #000000;">
                  <tr>
                    <td style="padding: 0;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 0;">
                            <div style="font-size: 15px; font-weight: 500; color: #000000; letter-spacing: -0.2px;">Jason Golden</div>
                            <div style="font-size: 11px; color: #666666; margin-top: 3px; letter-spacing: 1px; text-transform: uppercase;">Founder & Creative Chairman</div>
                            <div style="margin-top: 16px;">
                              <span style="font-size: 13px; font-weight: 600; color: #000000;">BOWERY</span>
                              <span style="font-size: 13px; font-weight: 300; color: #666666; margin-left: 2px;">Creative Agency</span>
                            </div>
                            <div style="margin-top: 16px; font-size: 12px; line-height: 18px;">
                              <a href="tel:+1234567890" style="color: #666666; text-decoration: none;">+1 (845) 409-0692</a><br>
                              <a href="mailto:jgolden@bowerycreativeagency.com" style="color: #666666; text-decoration: none;">jgolden@bowerycreativeagency.com</a><br>
                              <a href="https://bowerycreativeagency.com" style="color: #000000; text-decoration: none;">bowerycreativeagency.com</a>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Version 5 -->
              <div style="background-color: #fafafa; padding: 30px; border-radius: 6px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #999; letter-spacing: 1px; text-transform: uppercase;">Version 5: Ultra-Luxury Single Line</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="font-family: Georgia, 'Times New Roman', serif;">
                  <tr>
                    <td style="padding: 0;">
                      <div style="font-size: 14px; color: #000000; letter-spacing: 0.5px;">
                        <span style="font-weight: 400;">Jason Golden</span>
                        <span style="color: #999999; margin: 0 8px;">—</span>
                        <span style="font-style: italic; color: #666666;">Founder & Creative Chairman</span>
                        <span style="color: #999999; margin: 0 8px;">—</span>
                        <span style="font-weight: 300;">Bowery Creative Agency</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 40px 0 0 0; font-size: 14px; line-height: 1.6; color: #666;">
                Each signature has been crafted to reflect different aspects of professional communication. Version 4 (Luxury Minimal) offers the best balance for most situations, while Version 5 works beautifully for high-level executive correspondence.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Email options
const mailOptions = {
  from: 'Jason Golden <jgolden@bowerycreativeagency.com>',
  to: 'jasonwilliamgolden@gmail.com',
  subject: 'Your Email Signature Collection - Founder & Creative Chairman',
  html: emailContent
};

// Send the email
console.log('\nSending signature showcase email...');
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✓ Email sent successfully');
    console.log(`  ID: ${info.messageId}\n`);
  }
});