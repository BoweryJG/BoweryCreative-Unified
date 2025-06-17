import { createTransport } from 'nodemailer';
import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

class BoweryEmailService {
  constructor() {
    this.primaryAccount = null;
    this.resendEnabled = false;
    this.dailySendCount = 0;
    this.initializeGmailAccount();
    this.initializeResend();
    this.startDailyReset();
  }

  initializeGmailAccount() {
    // Bowery Creative Google Workspace account
    const email = process.env.BOWERY_EMAIL || 'jgolden@bowerycreativeagency.com';
    const password = process.env.BOWERY_APP_PASSWORD;

    if (email && password) {
      try {
        this.primaryAccount = {
          email,
          transporter: createTransport({
            service: 'gmail',
            auth: {
              user: email,
              pass: password
            }
          }),
          dailyLimit: 2000, // Google Workspace limit
          sentToday: 0
        };
        console.log('✅ Bowery Creative email service initialized');
      } catch (error) {
        console.error('Failed to initialize Gmail:', error);
      }
    } else {
      console.warn('⚠️  Bowery email credentials not configured');
    }
  }

  initializeResend() {
    // Keep existing Resend as backup
    if (process.env.RESEND_API_KEY) {
      this.resendEnabled = true;
      this.resendApiKey = process.env.RESEND_API_KEY;
      console.log('✅ Resend backup service available');
    }
  }

  startDailyReset() {
    // Reset counts at midnight
    cron.schedule('0 0 * * *', () => {
      console.log('Resetting daily email counts');
      if (this.primaryAccount) {
        this.primaryAccount.sentToday = 0;
      }
      this.dailySendCount = 0;
    });
  }

  async sendEmail(options) {
    const {
      from,
      to,
      subject,
      html,
      text,
      replyTo,
      headers = {},
      attachments = [],
      useResend = false
    } = options;

    try {
      // Use Resend if specifically requested or Gmail limit reached
      if (useResend || !this.primaryAccount || this.primaryAccount.sentToday >= this.primaryAccount.dailyLimit) {
        if (this.resendEnabled) {
          return this.sendViaResend(options);
        } else {
          throw new Error('Gmail limit reached and Resend not configured');
        }
      }

      // Send via Gmail (primary)
      const mailOptions = {
        from: from || `"Bowery Creative" <${this.primaryAccount.email}>`,
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
        replyTo: replyTo || this.primaryAccount.email,
        headers: {
          'X-Mailer': 'Bowery Creative Email System',
          ...headers
        },
        attachments
      };

      const info = await this.primaryAccount.transporter.sendMail(mailOptions);
      
      // Update counts
      this.primaryAccount.sentToday++;
      this.dailySendCount++;
      
      // Log to database
      await this.logEmail({
        message_id: info.messageId,
        from_email: this.primaryAccount.email,
        to_email: to,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_via: 'gmail'
      });

      return {
        success: true,
        messageId: info.messageId,
        sentVia: 'gmail',
        remainingToday: this.primaryAccount.dailyLimit - this.primaryAccount.sentToday
      };

    } catch (error) {
      console.error('Email send error:', error);
      
      // Log failure
      await this.logEmail({
        from_email: from,
        to_email: to,
        subject,
        status: 'failed',
        error: error.message,
        sent_at: new Date().toISOString()
      });

      throw error;
    }
  }

  async sendViaResend(options) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: options.from || 'Bowery Creative <noreply@bowerycreativeagency.com>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Resend API error');
    }

    await this.logEmail({
      message_id: data.id,
      from_email: options.from || 'noreply@bowerycreativeagency.com',
      to_email: options.to,
      subject: options.subject,
      status: 'sent',
      sent_via: 'resend',
      sent_at: new Date().toISOString()
    });

    return {
      success: true,
      messageId: data.id,
      sentVia: 'resend'
    };
  }

  async logEmail(emailData) {
    try {
      await supabase
        .from('email_logs')
        .insert(emailData);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  htmlToText(html) {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  async getStats() {
    return {
      primaryAccount: this.primaryAccount ? {
        email: this.primaryAccount.email,
        sentToday: this.primaryAccount.sentToday,
        remainingToday: this.primaryAccount.dailyLimit - this.primaryAccount.sentToday,
        dailyLimit: this.primaryAccount.dailyLimit
      } : null,
      resendEnabled: this.resendEnabled,
      totalSentToday: this.dailySendCount
    };
  }
}

// Export singleton instance
export const emailService = new BoweryEmailService();

// Export convenience functions
export const sendEmail = (options) => emailService.sendEmail(options);
export const getEmailStats = () => emailService.getStats();