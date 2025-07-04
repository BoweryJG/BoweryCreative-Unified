# Bowery Platform - Client Management System

A comprehensive client management system for Bowery Creative that handles client accounts, phone number provisioning, usage tracking, and billing.

## Features

- **Client Management**: Create and manage multiple client accounts with detailed profiles
- **Phone Number Provisioning**: Search, provision, and manage phone numbers via Twilio integration
- **Usage Tracking**: Real-time tracking of calls, SMS, and MMS usage
- **Automated Billing**: Generate invoices, track payments, and manage billing cycles
- **User Authentication**: Role-based access control (Admin, Manager, Support, Client)
- **Dashboard Analytics**: Visual representation of usage stats and financial metrics
- **Webhook Integration**: Automatic usage recording via Twilio and Stripe webhooks

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js framework
- TypeORM with PostgreSQL
- JWT authentication
- Twilio API integration
- Stripe API integration

### Frontend
- React 18 with TypeScript
- Vite build tool
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Hook Form for form handling

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Twilio account with API credentials
- Stripe account with API credentials

## Installation

1. Clone the repository:
```bash
cd /home/jgolden/bowery-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb bowery_platform

# Create database user
psql -d bowery_platform -c "CREATE USER bowery_user WITH PASSWORD 'your_secure_password';"
psql -d bowery_platform -c "GRANT ALL PRIVILEGES ON DATABASE bowery_platform TO bowery_user;"
```

4. Configure environment variables:
```bash
# Copy the example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your credentials:
# - Database connection details
# - Twilio Account SID and Auth Token
# - Stripe Secret Key
# - JWT secret
```

5. Run database migrations:
```bash
cd backend
npm run migration:run
```

6. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:3000

## Project Structure

```
bowery-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── entities/       # TypeORM entities
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Zustand stores
│   │   └── types/          # TypeScript types
│   └── package.json
└── package.json            # Root package.json with workspaces
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `GET /api/clients/code/:code` - Get client by code

### Phone Numbers
- `GET /api/phone-numbers/available` - Search available numbers
- `POST /api/phone-numbers/provision` - Provision new number
- `GET /api/phone-numbers/client/:clientId` - List client's numbers
- `PUT /api/phone-numbers/:id/configuration` - Update number config
- `DELETE /api/phone-numbers/:id` - Release number

### Billing
- `GET /api/billing/invoices` - List invoices
- `POST /api/billing/invoices/generate` - Generate invoice
- `GET /api/billing/invoices/:id` - Get invoice details
- `POST /api/billing/payments` - Record payment

### Usage
- `GET /api/usage/stats/:clientId` - Get client usage statistics
- `GET /api/usage/phone-number/:id` - Get phone number usage

### Webhooks
- `POST /api/webhooks/twilio/call-status` - Twilio call status webhook
- `POST /api/webhooks/twilio/sms-status` - Twilio SMS status webhook
- `POST /api/webhooks/stripe` - Stripe webhook

## Configuration

### Twilio Webhook Configuration

Configure these webhook URLs in your Twilio console:
- Voice Status Callback: `https://your-domain.com/api/webhooks/twilio/call-status`
- SMS Status Callback: `https://your-domain.com/api/webhooks/twilio/sms-status`

### Stripe Webhook Configuration

Configure this webhook URL in your Stripe dashboard:
- Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
- Events to listen for:
  - `payment_intent.succeeded`
  - `invoice.payment_succeeded`
  - `customer.subscription.updated`

## User Roles

- **Admin**: Full system access, can manage all clients and settings
- **Manager**: Can manage clients, phone numbers, and billing
- **Support**: Can view client information and assist with issues
- **Client**: Can only view their own account information

## Deployment

For production deployment:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Set production environment variables
4. Run database migrations in production
5. Start the server with a process manager like PM2

## Security Considerations

- All API endpoints require authentication except webhooks
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Rate limiting is implemented on all endpoints
- CORS is configured for the frontend origin only
- Webhook signatures should be verified in production

## Monitoring

The system includes:
- Activity logging for all major operations
- Usage alerts for high usage or low balance
- Automated invoice status updates
- Daily checks for overdue invoices

## Support

For issues or questions, please contact the development team at Bowery Creative.