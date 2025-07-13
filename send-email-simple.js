require('dotenv').config();
const nodemailer = require('nodemailer');
const emailTracker = require('./email-tracker');

// Create a transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL_1 || 'jgolden@bowerycreativeagency.com',
    pass: process.env.GMAIL_APP_PASSWORD_1 // You'll need to set this
  }
});

// Email options
const mailOptions = {
  from: process.env.GMAIL_EMAIL_1 || 'jgolden@bowerycreativeagency.com',
  to: 'jasonwilliamgolden@gmail.com',
  subject: 'Test Email from Bowery Creative CLI',
  text: 'This is a test email sent directly from the command line!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Test Email from Bowery Creative</h2>
      <p>This is a test email sent directly from the command line!</p>
      <p style="color: #666;">Sent via Bowery Creative Agency email system</p>
    </div>
  `
};

// Send the email
console.log('Sending email to:', mailOptions.to);
transporter.sendMail(mailOptions, async (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
    // Log failed email
    await emailTracker.logEmail({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      messageId: null,
      status: 'failed',
      template: 'simple',
      senderAlias: 'jgolden',
      error: error.message
    });
  } else {
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Log successful email
    await emailTracker.logEmail({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      messageId: info.messageId,
      status: 'sent',
      template: 'simple',
      senderAlias: 'jgolden',
      metadata: {
        template_style: 'simple'
      }
    });
    
    console.log('Email tracked in CRM');
  }
});