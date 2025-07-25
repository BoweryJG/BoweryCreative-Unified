"use strict";
// Bowery Creative Email Aliases Configuration
// All emails forward to jgolden@bowerycreativeagency.com
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.press = exports.careers = exports.team = exports.notifications = exports.noreply = exports.newbusiness = exports.projects = exports.marketing = exports.development = exports.design = exports.billing = exports.support = exports.info = exports.hello = exports.emily = exports.jason = exports.jgolden = exports.boweryEmails = void 0;
exports.boweryEmails = {
    // Primary domain
    domain: 'bowerycreativeagency.com',
    // All emails forward to
    forwardTo: 'jgolden@bowerycreativeagency.com',
    // Email addresses/aliases
    addresses: {
        // Leadership
        jgolden: {
            email: 'jgolden@bowerycreativeagency.com',
            name: 'Jason Golden',
            title: 'Founder & CEO',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        jason: {
            email: 'jason@bowerycreativeagency.com',
            name: 'Jason Golden',
            title: 'Founder & CEO',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        emily: {
            email: 'emily@bowerycreativeagency.com',
            name: 'Emily Carter',
            title: 'Creative Director',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        // Departments
        hello: {
            email: 'hello@bowerycreativeagency.com',
            name: 'Bowery Creative',
            title: 'Creative Agency',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        info: {
            email: 'info@bowerycreativeagency.com',
            name: 'Bowery Creative',
            title: 'Information',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        support: {
            email: 'support@bowerycreativeagency.com',
            name: 'Bowery Support',
            title: 'Client Support',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        billing: {
            email: 'billing@bowerycreativeagency.com',
            name: 'Bowery Billing',
            title: 'Billing Department',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        // Services
        design: {
            email: 'design@bowerycreativeagency.com',
            name: 'Bowery Design',
            title: 'Design Services',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        development: {
            email: 'development@bowerycreativeagency.com',
            name: 'Bowery Development',
            title: 'Development Team',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        marketing: {
            email: 'marketing@bowerycreativeagency.com',
            name: 'Bowery Marketing',
            title: 'Marketing Team',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        // Projects
        projects: {
            email: 'projects@bowerycreativeagency.com',
            name: 'Bowery Projects',
            title: 'Project Management',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        newbusiness: {
            email: 'newbusiness@bowerycreativeagency.com',
            name: 'Bowery New Business',
            title: 'Business Development',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        // Automated
        noreply: {
            email: 'noreply@bowerycreativeagency.com',
            name: 'Bowery Creative',
            title: 'Automated Message',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        notifications: {
            email: 'notifications@bowerycreativeagency.com',
            name: 'Bowery Notifications',
            title: 'System Notifications',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        // Team Members
        team: {
            email: 'team@bowerycreativeagency.com',
            name: 'Bowery Team',
            title: 'The Team',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        careers: {
            email: 'careers@bowerycreativeagency.com',
            name: 'Bowery Careers',
            title: 'Career Opportunities',
            actualSender: 'jgolden@bowerycreativeagency.com'
        },
        press: {
            email: 'press@bowerycreativeagency.com',
            name: 'Bowery Press',
            title: 'Press Inquiries',
            actualSender: 'jgolden@bowerycreativeagency.com'
        }
    },
    // Helper function to get formatted from address
    getFromAddress(alias) {
        const addr = this.addresses[alias];
        if (!addr) {
            throw new Error(`Unknown alias: ${alias}. Available: ${Object.keys(this.addresses).join(', ')}`);
        }
        return `"${addr.name}" <${addr.email}>`;
    },
    // Get email signature
    getSignature(alias) {
        const addr = this.addresses[alias];
        if (!addr)
            return '';
        return `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0; font-weight: bold; color: #333;">${addr.name}</p>
        <p style="margin: 0; color: #666;">${addr.title}</p>
        <p style="margin: 10px 0 0 0;">
          <strong>Bowery Creative Agency</strong><br>
          <a href="https://bowerycreativeagency.com" style="color: #007bff;">bowerycreativeagency.com</a>
        </p>
      </div>
    `;
    }
};
// Export all aliases for easy access
_a = exports.boweryEmails.addresses, exports.jgolden = _a.jgolden, exports.jason = _a.jason, exports.emily = _a.emily, exports.hello = _a.hello, exports.info = _a.info, exports.support = _a.support, exports.billing = _a.billing, exports.design = _a.design, exports.development = _a.development, exports.marketing = _a.marketing, exports.projects = _a.projects, exports.newbusiness = _a.newbusiness, exports.noreply = _a.noreply, exports.notifications = _a.notifications, exports.team = _a.team, exports.careers = _a.careers, exports.press = _a.press;
