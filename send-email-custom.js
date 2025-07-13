require('dotenv').config();
const nodemailer = require('nodemailer');
const emailTracker = require('./email-tracker');

// Get command line arguments
const args = process.argv.slice(2);
const fromAlias = args[0] || 'jgolden@bowerycreativeagency.com';
const toEmail = args[1] || 'jasonwilliamgolden@gmail.com';
const subject = args[2] || 'Test Email from Bowery Creative';
const message = args[3] || 'This is a test email sent from Bowery Creative Agency.';

// Available Bowery aliases (all forward to jgolden@bowerycreativeagency.com)
const boweryAliases = [
  'jgolden@bowerycreativeagency.com',
  'jason@bowerycreativeagency.com',
  'emily@bowerycreativeagency.com',
  'hello@bowerycreativeagency.com',
  'info@bowerycreativeagency.com',
  'team@bowerycreativeagency.com',
  'support@bowerycreativeagency.com',
  'billing@bowerycreativeagency.com',
  'design@bowerycreativeagency.com',
  'development@bowerycreativeagency.com',
  'marketing@bowerycreativeagency.com',
  'projects@bowerycreativeagency.com',
  'newbusiness@bowerycreativeagency.com',
  'careers@bowerycreativeagency.com',
  'press@bowerycreativeagency.com',
  'noreply@bowerycreativeagency.com',
  'notifications@bowerycreativeagency.com',
  'admin@bowerycreativeagency.com'
];

// Validate the from alias
if (!fromAlias.endsWith('@bowerycreativeagency.com')) {
  console.error('Error: From address must be a @bowerycreativeagency.com alias');
  console.log('\nAvailable aliases:');
  boweryAliases.forEach(alias => console.log(`  - ${alias}`));
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
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 3px solid #007bff;">
        <h2 style="color: #333; margin: 0;">Bowery Creative Agency</h2>
      </div>
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6;">${message}</p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 5px 0;">Sent from: ${fromAlias}</p>
        <p style="margin: 5px 0;">Bowery Creative Agency</p>
      </div>
    </div>
  `
};

// Send the email
console.log(`\nSending email...`);
console.log(`From: ${fromAlias}`);
console.log(`To: ${toEmail}`);
console.log(`Subject: ${subject}`);

transporter.sendMail(mailOptions, async (error, info) => {
  if (error) {
    console.error('\nError sending email:', error);
    // Log failed email
    await emailTracker.logEmail({
      from: fromAlias,
      to: toEmail,
      subject: subject,
      messageId: null,
      status: 'failed',
      template: 'custom',
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
      template: 'custom',
      senderAlias: fromAlias.split('@')[0],
      metadata: {
        template_style: 'custom'
      }
    });
    
    console.log('✅ Email tracked in CRM');
  }
});

// Show usage if no arguments
if (args.length === 0) {
  console.log('\nUsage: node send-email-custom.js [from] [to] [subject] [message]');
  console.log('\nExample:');
  console.log('  node send-email-custom.js billing@bowerycreativeagency.com client@example.com "Invoice #1234" "Your invoice is attached."');
  console.log('\nAvailable from aliases:');
  boweryAliases.forEach(alias => console.log(`  - ${alias}`));
}