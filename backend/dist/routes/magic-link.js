"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.magicLinkRouter = void 0;
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const supabase_1 = require("../lib/supabase");
const email_1 = require("../lib/email");
exports.magicLinkRouter = (0, express_1.Router)();
// Generate magic link
exports.magicLinkRouter.post('/generate', async (req, res) => {
    try {
        const { email, practiceName } = req.body;
        if (!email || !practiceName) {
            return res.status(400).json({ error: 'Email and practice name required' });
        }
        // Generate secure token
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Store in database
        const { error } = await supabase_1.supabase
            .from('magic_links')
            .insert({
            token,
            email,
            practice_name: practiceName,
            expires_at: expiresAt.toISOString(),
            used: false
        });
        if (error)
            throw error;
        // Generate magic URL
        const magicUrl = `${process.env.APP_URL}/magic/connect/${token}`;
        // Send email
        await (0, email_1.sendMagicLink)(email, practiceName, magicUrl);
        res.json({
            success: true,
            message: 'Magic link sent to ' + email
        });
    }
    catch (error) {
        console.error('Magic link error:', error);
        res.status(500).json({ error: 'Failed to send magic link' });
    }
});
// Handle magic link click
exports.magicLinkRouter.get('/connect/:token', async (req, res) => {
    try {
        const { token } = req.params;
        // Validate token
        const { data: link, error } = await supabase_1.supabase
            .from('magic_links')
            .select('*')
            .eq('token', token)
            .single();
        if (error || !link) {
            return res.status(404).send('Invalid link');
        }
        if (link.used) {
            return res.status(400).send('This link has already been used');
        }
        if (new Date(link.expires_at) < new Date()) {
            return res.status(400).send('This link has expired');
        }
        // Store in session for Facebook OAuth
        req.session.magicToken = token;
        req.session.practiceName = link.practice_name;
        req.session.email = link.email;
        // Redirect to Facebook OAuth
        const fbAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
            `client_id=${process.env.FB_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(process.env.FB_REDIRECT_URI)}` +
            `&scope=pages_show_list,pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish` +
            `&state=${token}`;
        res.redirect(fbAuthUrl);
    }
    catch (error) {
        console.error('Connect error:', error);
        res.status(500).send('Connection failed');
    }
});
