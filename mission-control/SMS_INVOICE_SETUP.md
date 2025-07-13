# SMS Invoice Functionality Setup

## Overview
This document outlines the SMS functionality for sending invoices with payment links to customers via text message.

## Features Implemented

### 1. Invoice Management Component
- Created `/dashboard/src/components/InvoiceManagement.tsx`
- Displays all invoices with status indicators
- Shows invoice statistics (total, paid, pending, overdue)
- Search and filter capabilities
- Actions for each invoice: View, Send Email, Send SMS, Download PDF

### 2. SMS Sending Capability
- Created Supabase Edge Function: `/dashboard/supabase/functions/send-invoice-sms/`
- Supports Twilio integration for real SMS sending
- Falls back to mock mode if Twilio not configured
- Formats phone numbers to E.164 format
- Logs all SMS attempts in database

### 3. Database Updates
- Created `sms_logs` table to track SMS messages
- Added `phone` column to profiles table
- Proper RLS policies for admin access

### 4. Enhanced Billing Admin
- Updated `/dashboard/src/components/BillingAdmin.tsx`
- Added tabs for Customers and Invoices
- Ensures Dr. Greg Pedro exists with $2,000/month billing
- Integrated invoice management view

## Setup Instructions

### 1. Environment Variables
Add these to your Supabase Edge Functions environment:

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 2. Database Migration
Run the migration file to create SMS logs table:

```bash
supabase db push --db-url your-database-url < /dashboard/20250117_sms_logs.sql
```

### 3. Deploy Edge Function
Deploy the SMS sending function:

```bash
cd dashboard
supabase functions deploy send-invoice-sms
```

## Usage

### Admin View
1. Navigate to "Billing" in the Mission Control dashboard
2. Click on the "Invoices" tab
3. Find the invoice you want to send
4. Click the SMS icon
5. Verify/edit phone number and message
6. Click "Send SMS"

### Customer Experience
Customers receive an SMS like:
```
Hi Dr. Greg Pedro, your invoice INV-2025-00001 for $2,000.00 is ready. Pay securely here: [payment link]
```

## Dr. Greg Pedro Setup
The system automatically ensures Dr. Greg Pedro exists with:
- Name: Dr. Greg Pedro
- Email: greg@gregpedromd.com
- Company: Greg Pedro MD
- Monthly Billing: $2,000

## SMS Features
- Character count (160 char limit per SMS)
- Phone number validation
- Payment link included automatically
- SMS logs for tracking
- Admin-only access

## Security
- Only admins can send SMS (jasonwilliamgolden@gmail.com, jgolden@bowerycreativeagency.com)
- All SMS attempts are logged
- RLS policies protect data access
- Twilio credentials stored securely in environment

## Testing
Without Twilio configured:
- SMS will be mocked and logged
- Console will show the message that would be sent
- Database will record with status 'mock_sent'

With Twilio configured:
- Real SMS will be sent
- Twilio SID will be recorded
- Status will be 'sent' or 'failed'

## Future Enhancements
- Bulk SMS sending
- SMS templates
- Automated reminders for overdue invoices
- Two-way SMS communication
- SMS delivery tracking