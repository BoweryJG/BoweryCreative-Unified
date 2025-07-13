require('dotenv').config({ path: './backend/.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTgxNTE4NywiZXhwIjoyMDY1MzkxMTg3fQ.2IR_pM8Yr2HYSzf7jmaU20MxeBzTOYsQK1CsCCCDjSE';

const supabase = createClient(supabaseUrl, supabaseKey);

class EmailTracker {
  /**
   * Log an email to the database with automatic client association
   * @param {Object} emailData - Email information to log
   * @returns {Promise<Object>} - The logged email record
   */
  async logEmail(emailData) {
    try {
      const {
        from,
        to,
        subject,
        messageId,
        status = 'sent',
        template = null,
        senderAlias = null,
        metadata = {},
        error = null
      } = emailData;

      // Try to associate with a client
      const { data: clientData } = await supabase.rpc('associate_email_with_client', {
        email_to: to
      });

      // Prepare email log entry
      const emailLog = {
        message_id: messageId,
        from_email: from,
        to_email: to,
        subject: subject,
        status: status,
        sent_via: 'direct', // Since we're using Gmail directly
        error: error,
        sent_at: new Date().toISOString(),
        client_id: clientData,
        template_used: template,
        sender_alias: senderAlias,
        metadata: metadata
      };

      // Insert into email_logs
      const { data, error: insertError } = await supabase
        .from('email_logs')
        .insert([emailLog])
        .select()
        .single();

      if (insertError) {
        console.error('Error logging email:', insertError);
        throw insertError;
      }

      // Also create a communication log entry
      if (clientData) {
        await this.logCommunication({
          client_id: clientData,
          type: 'email',
          direction: 'outbound',
          subject: subject,
          content: `Email sent to ${to}`,
          related_to: data.id,
          metadata: {
            email_id: data.id,
            template: template,
            sender_alias: senderAlias
          }
        });
      }

      return data;
    } catch (error) {
      console.error('Failed to log email:', error);
      // Don't throw - we don't want email logging failures to prevent email sending
      return null;
    }
  }

  /**
   * Log a communication event
   * @param {Object} commData - Communication data
   * @returns {Promise<Object>} - The logged communication record
   */
  async logCommunication(commData) {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert([commData])
        .select()
        .single();

      if (error) {
        console.error('Error logging communication:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to log communication:', error);
      return null;
    }
  }

  /**
   * Get email history for a client
   * @param {string} clientId - The client's ID
   * @param {number} limit - Maximum number of emails to return
   * @returns {Promise<Array>} - Array of email records
   */
  async getClientEmailHistory(clientId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get client email history:', error);
      return [];
    }
  }

  /**
   * Get all communications for a client
   * @param {string} clientId - The client's ID
   * @param {string} type - Filter by communication type (optional)
   * @returns {Promise<Array>} - Array of communication records
   */
  async getClientCommunications(clientId, type = null) {
    try {
      let query = supabase
        .from('communication_logs')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get client communications:', error);
      return [];
    }
  }

  /**
   * Add an email address to a client
   * @param {string} clientId - The client's ID
   * @param {string} email - Email address to add
   * @param {boolean} isPrimary - Whether this is the primary email
   * @returns {Promise<Object>} - The created record
   */
  async addClientEmail(clientId, email, isPrimary = false) {
    try {
      const { data, error } = await supabase
        .from('client_email_addresses')
        .insert([{
          client_id: clientId,
          email_address: email,
          is_primary: isPrimary,
          verified: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add client email:', error);
      return null;
    }
  }

  /**
   * Get email statistics
   * @param {string} period - Time period: 'today', 'week', 'month'
   * @returns {Promise<Object>} - Email statistics
   */
  async getEmailStats(period = 'today') {
    try {
      let startDate = new Date();
      
      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('email_logs')
        .select('status')
        .gte('sent_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        total: data.length,
        sent: data.filter(e => e.status === 'sent').length,
        failed: data.filter(e => e.status === 'failed').length,
        period: period
      };

      return stats;
    } catch (error) {
      console.error('Failed to get email stats:', error);
      return null;
    }
  }
}

module.exports = new EmailTracker();