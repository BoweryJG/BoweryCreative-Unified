# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoweryCreative-Unified is a monorepo containing a comprehensive agency management platform with multiple microservices. The system provides client management, email marketing, social media management, billing, and analytics features.

## Architecture

```
BoweryCreative-Unified/
├── frontend/bowerycreativefrontend/  → Main website (React + TypeScript + Vite)
├── backend/                          → API & backend services (Express + TypeScript)
├── payments/                         → Payment portal (React + Stripe)
├── dashboard/                        → Admin dashboard (React + Material-UI)
├── social-manager/                   → AI-powered social media manager
└── docs/                            → Shared documentation
```

### Tech Stack
- **Frontend**: React 18.3 + TypeScript + Vite + Tailwind CSS + Material-UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend API
- **SMS**: Twilio
- **AI**: Anthropic SDK

## Common Development Commands

### Backend (`cd backend`)
```bash
npm run dev       # Start development server with hot reload
npm run build     # Compile TypeScript to dist/
npm run lint      # Run ESLint
npm run test      # Run Jest tests
```

### Frontend - Main Site (`cd frontend/bowerycreativefrontend`)
```bash
npm run dev         # Start Vite dev server
npm run build       # Production build
npm run build:fast  # Production build without minification
npm run lint        # Run ESLint
npm run preview     # Preview production build
```

### Dashboard (`cd dashboard`)
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Payments Portal (`cd payments`)
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Running Tests
```bash
# Backend tests
cd backend && npm run test

# No frontend tests configured yet
```

## Key Architecture Patterns

### API Structure
The backend provides RESTful APIs with the following pattern:
- `/api/v1/analytics` - Analytics tracking
- `/api/v1/contacts` - Contact form submissions
- `/api/v1/campaigns` - Campaign management
- `/api/v1/invoices` - Invoice operations
- `/api/v1/email` - Email automation
- `/api/v1/sms` - SMS notifications

### Database Schema
Key tables in Supabase:
- `profiles` - User profiles with authentication
- `clients` - Client management
- `invoices` - Invoice tracking
- `campaigns` - Marketing campaigns
- `analytics` - Site analytics data
- `contacts` - Contact submissions
- `onboarding_submissions` - Client onboarding data

### Frontend Architecture
- Component-based React with TypeScript
- Shared UI components using Material-UI
- State management through React hooks and context
- API calls through custom hooks and services
- Responsive design with Tailwind CSS

### Authentication Flow
1. Supabase Auth handles user authentication
2. JWT tokens stored in local storage
3. Protected routes check authentication status
4. API endpoints verify Supabase session

## Environment Variables

Each service requires specific environment variables:

### Backend
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `TWILIO_*` credentials
- `ANTHROPIC_API_KEY`

### Frontend Applications
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## Deployment

- **Frontend**: Deployed to Netlify (automatic builds from git)
- **Backend**: Deployed to Render.com
- **Database**: Hosted on Supabase cloud

## Development Workflow

1. Always run `npm install` in the specific project directory before starting
2. Use the development commands above to start local servers
3. Frontend apps typically run on ports 5173, 5174, etc.
4. Backend runs on port 3001 by default
5. Check `.env.example` files for required environment variables

## Important Notes

- The codebase uses TypeScript throughout - ensure type safety
- Follow existing patterns for API calls and component structure
- Database migrations are in `supabase/migrations/` directories
- Email templates are managed through the backend
- All monetary values are stored in cents (Stripe convention)
- Use existing UI components before creating new ones
- Check Material-UI documentation for component APIs