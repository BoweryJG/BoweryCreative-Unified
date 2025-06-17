# Bowery Creative - Client Onboarding System Deployment Guide

## Overview
This deployment guide covers the complete setup of the Supabase-powered client onboarding system, including database schema, Edge Functions, and integrations.

## Prerequisites
- Supabase account and project
- Netlify account (for hosting)
- Resend account (for email automation)
- Stripe account (for payment processing, optional)
- DocuSign account (for contract signing, optional)

## 1. Supabase Setup

### Database Schema
1. Open your Supabase SQL Editor
2. Run the complete schema from `supabase-schema.sql`
3. Verify all tables are created successfully

### Environment Variables
Add these to your Supabase project settings:
```bash
RESEND_API_KEY=your_resend_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Row Level Security (RLS)
The schema includes basic RLS policies. Review and customize based on your security requirements:

- `contacts` table: Public insert, authenticated read
- All other tables: Service role access only
- `service_packages`: Public read for active packages

### Edge Functions Setup
1. Install Supabase CLI if not already installed:
```bash
npm install -g supabase
```

2. Initialize Supabase locally:
```bash
supabase init
```

3. Deploy the email automation function:
```bash
supabase functions deploy email-automation
```

4. Set environment variables for the function:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## 2. Frontend Configuration

### Environment Variables
Create a `.env.local` file in your project root:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key # Optional
```

### Update Supabase Configuration
Update `src/lib/supabase.ts` with your actual Supabase credentials:
```typescript
const supabaseUrl = 'your_supabase_url';
const supabaseAnonKey = 'your_anon_key';
```

## 3. Email Integration (Resend)

### Setup Resend
1. Create account at https://resend.com
2. Verify your domain
3. Get your API key
4. Update the email automation function with your domain

### Email Templates
The system includes default email templates, but you can customize them in the Supabase dashboard under the `email_templates` table.

### Automated Emails
The system automatically sends emails for:
- New contact welcome
- Proposal sent
- Contract ready
- Payment reminders
- Project kickoff

## 4. Payment Integration (Optional)

### Stripe Setup
1. Create Stripe account
2. Get publishable and secret keys
3. Set up webhooks for payment events
4. Configure payment methods in the onboarding flow

### Payment Flow
- Deposit collection during contract signing
- Milestone-based payments
- Subscription billing for ongoing services
- Automatic invoice generation

## 5. Contract Management (Optional)

### DocuSign Integration
1. Create DocuSign developer account
2. Get API credentials
3. Create contract templates
4. Set up webhook endpoints for signature events

## 6. Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Build Configuration
Ensure your `netlify.toml` is properly configured:
```toml
[build]
  base = "bowery-luxury"
  command = "npm ci && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

## 7. Testing the System

### Contact Form Testing
1. Submit a test contact form
2. Verify contact is created in Supabase
3. Check that onboarding steps are initialized
4. Confirm welcome email is sent

### Onboarding Flow Testing
1. Access the onboarding flow with a test contact ID
2. Complete each step of the process
3. Verify data is saved correctly
4. Test email automation at each stage

### Admin Dashboard Testing
1. Access the admin dashboard
2. Verify contact data is displayed correctly
3. Test filtering and search functionality
4. Check analytics and metrics

## 8. Monitoring and Maintenance

### Supabase Monitoring
- Monitor database usage and performance
- Check Edge Function logs for errors
- Review email delivery rates

### Error Handling
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor failed email deliveries
- Track conversion rates through the onboarding funnel

### Data Backup
- Enable Supabase point-in-time recovery
- Set up regular database backups
- Export important data periodically

## 9. Customization Options

### Branding
- Update email templates with your branding
- Customize the onboarding flow styling
- Add your logo and colors throughout

### Service Packages
- Update the `service_packages` table with your actual offerings
- Modify pricing and features as needed
- Add new package categories

### Workflow Customization
- Modify onboarding steps in the database
- Add custom fields to the contact form
- Create additional email automation triggers

## 10. Security Considerations

### Data Protection
- Review RLS policies regularly
- Limit API key access
- Use environment variables for all secrets

### Email Security
- Set up SPF, DKIM, and DMARC records
- Monitor bounce and spam rates
- Implement email verification

### Payment Security
- Use Stripe's secure payment forms
- Never store credit card information
- Implement proper webhook signature verification

## 11. Scaling Considerations

### Database Optimization
- Add indexes for frequently queried fields
- Monitor query performance
- Consider database connection pooling

### Performance Monitoring
- Monitor Core Web Vitals
- Optimize image loading
- Implement proper caching strategies

### Infrastructure Scaling
- Consider upgrading Supabase plan as needed
- Monitor Edge Function usage
- Plan for increased email volume

## 12. Support and Maintenance

### Regular Tasks
- Review and update email templates
- Monitor conversion rates and optimize
- Update service packages and pricing
- Clean up old/inactive contacts

### Performance Reviews
- Monthly analytics review
- Quarterly process optimization
- Annual security audit

## Troubleshooting Common Issues

### Email Not Sending
1. Check Resend API key
2. Verify domain is properly configured
3. Check Edge Function logs
4. Review email template syntax

### Database Connection Issues
1. Verify Supabase URL and keys
2. Check RLS policies
3. Monitor connection limits
4. Review error logs

### Payment Processing Issues
1. Check Stripe configuration
2. Verify webhook endpoints
3. Monitor payment logs
4. Test in Stripe's test mode

## Support
For technical issues or questions about this implementation, refer to:
- Supabase documentation: https://supabase.com/docs
- Resend documentation: https://resend.com/docs
- Stripe documentation: https://stripe.com/docs

## Version History
- v1.0: Initial implementation with basic onboarding flow
- v1.1: Added email automation and admin dashboard
- v1.2: Enhanced lead scoring and analytics

---

*This system represents a comprehensive client onboarding solution designed to streamline the process from initial contact to project kickoff while maintaining professional presentation and data security.*