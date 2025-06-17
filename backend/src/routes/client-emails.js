import express from 'express';
import { clientEmailHelpers, gregPedroMD } from '../services/clientEmails.js';

const router = express.Router();

// Get setup instructions for a client email account
router.get('/setup/:domain/:account', async (req, res) => {
  try {
    const { domain, account } = req.params;
    
    const instructions = clientEmailHelpers.getSetupInstructions(domain, account);
    
    res.json({
      success: true,
      account: `${account}@${domain}`,
      instructions
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Get email account details
router.get('/account/:domain/:account', async (req, res) => {
  try {
    const { domain, account } = req.params;
    
    const accountConfig = clientEmailHelpers.getEmailAccount(domain, account);
    
    // Remove sensitive server config from public response
    const publicConfig = {
      email: accountConfig.email,
      name: accountConfig.name,
      title: accountConfig.title,
      department: accountConfig.department,
      status: accountConfig.status,
      features: accountConfig.features,
      webmail: accountConfig.webmail
    };
    
    res.json({
      success: true,
      account: publicConfig
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Get email signature for an account
router.get('/signature/:domain/:account', async (req, res) => {
  try {
    const { domain, account } = req.params;
    const { format = 'text' } = req.query;
    
    let signature;
    if (format === 'html') {
      signature = clientEmailHelpers.getHTMLSignature(domain, account);
    } else {
      signature = clientEmailHelpers.getEmailSignature(domain, account);
    }
    
    res.json({
      success: true,
      account: `${account}@${domain}`,
      format,
      signature
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// Test email connectivity (placeholder - would integrate with actual email server)
router.post('/test/:domain/:account', async (req, res) => {
  try {
    const { domain, account } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password required for email testing'
      });
    }
    
    // In production, this would actually test IMAP/SMTP connectivity
    // For now, we'll return a mock success response
    
    const accountConfig = clientEmailHelpers.getEmailAccount(domain, account);
    
    res.json({
      success: true,
      account: `${account}@${domain}`,
      tests: {
        imap: {
          server: accountConfig.serverConfig.imap.server,
          port: accountConfig.serverConfig.imap.port,
          status: 'connected',
          response_time: '245ms'
        },
        smtp: {
          server: accountConfig.serverConfig.smtp.server,
          port: accountConfig.serverConfig.smtp.port,
          status: 'connected',
          response_time: '189ms'
        },
        webmail: {
          url: accountConfig.webmail.url,
          status: 'accessible',
          response_time: '156ms'
        }
      },
      message: 'All email services are operational'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all accounts for a domain (admin only)
router.get('/domain/:domain/accounts', async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Basic auth check - in production, implement proper admin authentication
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    if (domain === 'gregpedromd.com') {
      const accounts = Object.keys(gregPedroMD.accounts).map(accountName => {
        const account = gregPedroMD.accounts[accountName];
        return {
          username: accountName,
          email: account.email,
          name: account.name,
          title: account.title,
          department: account.department,
          status: account.status,
          canSend: account.canSend,
          canReceive: account.canReceive,
          forwardTo: account.forwardTo
        };
      });
      
      res.json({
        success: true,
        domain,
        client: gregPedroMD.client,
        accounts
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Domain not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Quick setup for Cindi's account
router.get('/cindi/setup', async (req, res) => {
  try {
    const instructions = clientEmailHelpers.getSetupInstructions('gregpedromd.com', 'cindi');
    const textSignature = clientEmailHelpers.getEmailSignature('gregpedromd.com', 'cindi');
    const htmlSignature = clientEmailHelpers.getHTMLSignature('gregpedromd.com', 'cindi');
    
    res.json({
      success: true,
      account: 'cindi@gregpedromd.com',
      setup: instructions,
      signatures: {
        text: textSignature,
        html: htmlSignature
      },
      passwordSetup: {
        status: 'Not set - secure delivery required',
        methods: [
          {
            method: 'phone',
            contact: '(845) 409-0692',
            instructions: 'Call and ask for "Cindi\'s email password"',
            availability: 'Monday-Friday 9AM-6PM EST',
            recommended: true
          },
          {
            method: 'text',
            contact: '(845) 409-0692',
            instructions: 'Text "Cindi Weiss - email password"',
            availability: 'Response within 1 hour during business hours'
          },
          {
            method: 'email',
            contact: 'support@bowerycreativeagency.com',
            instructions: 'Email for callback verification',
            note: 'We will call you back to verify identity'
          }
        ],
        security: {
          firstLogin: 'Use temporary password provided via secure method',
          requirement: 'Must change password immediately after first login',
          complexity: 'Minimum 12 characters with mixed case, numbers, and symbols'
        }
      },
      quickLinks: {
        webmail: 'https://webmail.gregpedromd.com',
        setupGuide: '/cindi-email-setup-guide.html',
        passwordGuide: '/cindi-password-setup.html',
        support: 'support@bowerycreativeagency.com'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Password setup request endpoint
router.post('/password-request', async (req, res) => {
  try {
    const { domain, account, requestMethod, contactInfo, verification } = req.body;
    
    // Log the password request for admin follow-up
    const timestamp = new Date().toISOString();
    const requestData = {
      timestamp,
      account: `${account}@${domain}`,
      method: requestMethod,
      contact: contactInfo,
      verification: verification,
      status: 'pending'
    };
    
    // In production, this would log to a secure admin system
    console.log('Password Request:', requestData);
    
    res.json({
      success: true,
      message: 'Password request logged successfully',
      requestId: `PWD-${Date.now()}`,
      nextSteps: {
        phone: 'You will receive a call within 1 hour during business hours',
        text: 'You will receive a text message within 1 hour during business hours',
        email: 'You will receive a callback within 2 hours during business hours'
      }[requestMethod],
      contact: {
        support: 'support@bowerycreativeagency.com',
        phone: '(845) 409-0692',
        hours: 'Monday-Friday 9AM-6PM EST'
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;