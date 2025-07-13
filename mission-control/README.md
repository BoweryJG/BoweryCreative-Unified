# BoweryCreative Mission Control

## 🎯 Purpose
Internal agency management system for BoweryCreative. This is your command center for all agency operations.

**This is for internal use only - clients should never access this system.**

## 🚀 Features

### 📊 Dashboard
- Real-time analytics
- Revenue tracking
- Client overview
- Campaign performance

### 👥 Client Management
- Full CRUD operations
- Client profiles
- Project tracking
- Communication history

### 💰 Billing & Invoicing
- Create and manage invoices
- View payment history
- Track outstanding payments
- Generate reports

### 📧 Email Campaigns
- Create and send campaigns
- Template management
- Automation workflows
- Analytics tracking

### 📱 SMS Campaigns
- Bulk SMS sending
- Campaign scheduling
- Response tracking
- Contact management

### 📱 Social Media
- Multi-platform management
- Content scheduling
- Analytics integration
- Engagement tracking

### 🤖 AI Assistant
- Internal chatbot
- Quick actions
- Data insights
- Task automation

## 🛠️ Tech Stack
- React + TypeScript
- Material-UI
- Supabase
- Chart.js / Recharts
- Vite

## 📁 Key Components
```
mission-control/
├── src/
│   ├── components/
│   │   ├── Dashboard/        # Main dashboard
│   │   ├── Clients/          # Client management
│   │   ├── Billing/          # Invoice & payments
│   │   ├── Campaigns/        # Email/SMS campaigns
│   │   ├── Social/           # Social media tools
│   │   └── Analytics/        # Reports & insights
│   ├── services/
│   ├── hooks/
│   └── utils/
```

## 🚀 Quick Start
```bash
cd mission-control
npm install
npm run dev
```

Visit http://localhost:5175

## 🔐 Authentication
- Supabase Auth
- Role-based access control
- Admin vs team member permissions

## 🌐 Environment Variables
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_APP_URL=https://app.bowerycreative.com
VITE_RESEND_API_KEY=your_resend_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
```

## 📊 Database Access
Full access to all tables:
- `clients` - Client management
- `invoices` - Invoice creation/management
- `payments` - Payment tracking
- `campaigns` - Email/SMS campaigns
- `analytics` - Performance data
- `users` - Team management

## 🔗 Integration Points
- **Payment Portal**: View payments made through pay.bowerycreative.com
- **Main Website**: Analytics from bowerycreativeagency.com
- **Backend API**: All business logic and integrations

## ⚠️ Important Notes
- This is your main work environment
- All client management happens here
- Create invoices here, send payment links to Payment Portal
- Full admin capabilities - handle with care!