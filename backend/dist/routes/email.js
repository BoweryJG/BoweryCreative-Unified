"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailService_js_1 = require("../services/emailService.js");
const boweryEmails_js_1 = require("../services/boweryEmails.js");
const router = express_1.default.Router();
// Middleware to check auth (you can enhance this)
const requireAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.EMAIL_API_KEY && process.env.EMAIL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
// Send single email
router.post('/send', requireAuth, async (req, res) => {
    try {
        const { to, subject, html, text, from, replyTo, attachments, usePostal } = req.body;
        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                error: 'Missing required fields: to, subject, and either html or text'
            });
        }
        const result = await (0, emailService_js_1.sendEmail)({
            to,
            subject,
            html,
            text,
            from,
            replyTo,
            attachments,
            usePostal
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Send email as client
router.post('/send-as-client', requireAuth, async (req, res) => {
    try {
        const { clientEmail, clientName, recipientEmail, subject, body } = req.body;
        if (!clientEmail || !clientName || !recipientEmail || !subject || !body) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        const result = await (0, emailService_js_1.sendAsClient)(clientEmail, clientName, recipientEmail, subject, body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Send email using Bowery alias
router.post('/send-as-bowery', requireAuth, async (req, res) => {
    try {
        const { alias, to, subject, html, text, includeSignature = true } = req.body;
        if (!alias || !to || !subject || (!html && !text)) {
            return res.status(400).json({
                error: 'Missing required fields: alias, to, subject, and either html or text'
            });
        }
        // Get the from address for the alias
        const from = boweryEmails_js_1.boweryEmails.getFromAddress(alias);
        // Add signature if requested
        let finalHtml = html;
        if (includeSignature && html) {
            finalHtml = html + boweryEmails_js_1.boweryEmails.getSignature(alias);
        }
        const result = await (0, emailService_js_1.sendEmail)({
            from,
            to,
            subject,
            html: finalHtml,
            text
        });
        res.json({ ...result, sentAs: alias });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Bulk send
router.post('/bulk', requireAuth, async (req, res) => {
    try {
        const { emails, delayBetween = 5000 } = req.body;
        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({
                error: 'emails array is required'
            });
        }
        const results = await (0, emailService_js_1.sendBulk)(emails, delayBetween);
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        res.json({
            total: emails.length,
            successful,
            failed,
            results
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create campaign
router.post('/campaign', requireAuth, async (req, res) => {
    try {
        const { name, recipients, subject, htmlTemplate, schedule } = req.body;
        if (!name || !recipients || !subject || !htmlTemplate || !schedule) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        const campaign = await (0, emailService_js_1.createCampaign)(name, recipients, subject, htmlTemplate, schedule);
        res.json(campaign);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get email statistics
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const stats = await (0, emailService_js_1.getEmailStats)();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// List available Bowery aliases
router.get('/aliases', requireAuth, async (req, res) => {
    const aliases = Object.entries(boweryEmails_js_1.boweryEmails.addresses).map(([key, addr]) => ({
        alias: key,
        email: addr.email,
        name: addr.name,
        title: addr.title
    }));
    res.json({
        domain: boweryEmails_js_1.boweryEmails.domain,
        forwardTo: boweryEmails_js_1.boweryEmails.forwardTo,
        aliases
    });
});
// Test email endpoint
router.post('/test', async (req, res) => {
    try {
        const testEmail = req.body.email || process.env.TEST_EMAIL || 'jgolden@bowerycreativeagency.com';
        const result = await (0, emailService_js_1.sendEmail)({
            to: testEmail,
            subject: 'Bowery Creative Email System Test',
            html: `
        <h2>Email System Test Successful! 🎉</h2>
        <p>Your Bowery Creative email system is working perfectly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
        <ul>
          <li>Email Service: Active ✅</li>
          <li>Account Rotation: Working ✅</li>
          <li>Database Logging: Enabled ✅</li>
        </ul>
        ${boweryEmails_js_1.boweryEmails.getSignature('hello')}
      `
        });
        res.json({
            success: true,
            message: 'Test email sent successfully',
            ...result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.default = router;
