# Project Separation Recommendation for BoweryCreative

## Current State Analysis

### Payments Project (bowerycreativepayments)
**Purpose**: Focused on payment processing, billing, and financial management

**Key Components**:
- Payment processing (PaymentPage, PaymentSuccess, PaymentCancel)
- Subscription management (SubscriptionPlans, PedroSubscription)
- Credit packages system (CreditPackages)
- Invoice management (InvoiceManagement)
- Admin dashboard for billing (SimpleAdminDashboard, AdminDashboard)
- Customer management (CreateCustomerModal, CustomerDetailsModal)
- Invoice generation (InvoiceGenerator)
- Basic client management (ClientManagementEnhanced)
- Cosmic onboarding flow
- Authentication system (AuthContextPayments)

**Dependencies**:
- Stripe integration (@stripe/react-stripe-js, @stripe/stripe-js)
- Supabase for database
- Material UI for UI components
- React Router for navigation

### Dashboard Project (mission-control)
**Purpose**: Comprehensive marketing and campaign management platform

**Key Components**:
- Content creation tools (ContentStudio)
- Email marketing (EmailMarketing)
- SEO analysis (SEOAnalyzer)
- Social media management (SocialMedia)
- Analytics dashboard (Analytics, CampaignAnalytics)
- Campaign marketplace (CampaignMarketplace)
- Campaign management (CampaignManager)
- Client management (ClientManagementEnhanced, ClientMissionControl, ClientDashboard)
- Billing administration (BillingAdmin)
- Call analysis (CallAnalysis)
- Business practices (Practices)
- Research tools (Research)
- Authentication system (AuthContext)

**Dependencies**:
- Similar tech stack but includes additional tools:
  - Recharts for data visualization
  - Tailwind CSS (in addition to MUI)
  - Different Stripe versions
  - MUI X Data Grid for advanced tables

## Issues Identified

### 1. Component Duplication
- **ClientManagementEnhanced.tsx** exists in both projects
- **InvoiceManagement.tsx** exists in both projects
- **BoweryCreativeChatbot.tsx** exists in both projects
- **Dashboard.tsx** exists in both (with identical code)
- **Auth components** are duplicated with slight variations
- **CreditPackages.tsx** and **SubscriptionPlans.tsx** exist in both

### 2. Naming Confusion
- Dashboard project is named "mission-control" in package.json but directory is "dashboard"
- Payments project has a "dashboard" subdirectory in components
- Both projects have overlapping responsibilities

### 3. Feature Overlap
- Both handle client management
- Both have billing/payment features
- Both have authentication systems
- Both have dashboard components

### 4. Dependency Conflicts
- Different React versions (19.1.0 in payments, 18.3.1 in dashboard)
- Different Stripe library versions
- Inconsistent styling approaches (MUI only vs MUI + Tailwind)

## Recommended Separation Strategy

### 1. Rename and Clarify Projects

**Project 1: Payment Portal** (current payments directory)
- Rename to `payment-portal` or `billing-portal`
- Focus: Customer-facing payment processing and billing
- Target users: Clients making payments

**Project 2: Mission Control** (current dashboard directory)
- Keep as `mission-control`
- Focus: Internal marketing and campaign management tools
- Target users: Bowery Creative team and admin users

### 2. Move Components to Appropriate Projects

**Payment Portal should contain**:
- Payment processing components (PaymentPage, PaymentSuccess, PaymentCancel)
- Public-facing subscription selection (SubscriptionPlans)
- Public-facing credit package selection (CreditPackages)
- Invoice payment interface
- Cosmic onboarding for new customers
- Simple authentication for payment verification

**Mission Control should contain**:
- All marketing tools (ContentStudio, EmailMarketing, SEOAnalyzer, etc.)
- Campaign management (CampaignManager, CampaignMarketplace)
- Internal client management (ClientManagementEnhanced, ClientMissionControl)
- Admin billing tools (BillingAdmin, InvoiceGenerator)
- Analytics and reporting
- Call analysis and research tools
- Full authentication system for team members

### 3. Create Shared Libraries

Create a `shared` directory at the project root for:
```
/shared
  /components
    - BoweryCreativeChatbot.tsx
    - Common UI components
  /lib
    - supabase configuration
    - stripe configuration
    - authentication utilities
  /types
    - TypeScript interfaces and types
  /hooks
    - Shared React hooks
```

### 4. Database Schema Separation

**Payment Portal tables**:
- payment_intents
- invoices (read-only for payment status)
- credit_transactions
- subscription_events

**Mission Control tables**:
- clients (full CRUD)
- campaigns
- campaign_analytics
- invoices (full CRUD for generation)
- team_members
- All marketing-related tables

### 5. Implementation Steps

1. **Create shared library structure**
   ```bash
   mkdir -p shared/{components,lib,types,hooks}
   ```

2. **Move shared components**
   - Extract common components to shared directory
   - Update import paths in both projects

3. **Separate authentication contexts**
   - Payment Portal: Simple auth for payment verification
   - Mission Control: Full auth with role-based access

4. **Clean up duplicates**
   - Remove ClientManagementEnhanced from Payment Portal
   - Remove payment processing components from Mission Control
   - Keep billing admin tools only in Mission Control

5. **Update routing**
   - Payment Portal: Focus on /pay, /subscribe, /credits routes
   - Mission Control: All other business operation routes

6. **Align dependencies**
   - Standardize React versions
   - Standardize Stripe library versions
   - Document styling approach per project

### 6. Environment Configuration

**Payment Portal (.env)**:
```
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_STRIPE_PUBLISHABLE_KEY=xxx
VITE_APP_URL=https://pay.bowerycreative.com
```

**Mission Control (.env)**:
```
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_STRIPE_PUBLISHABLE_KEY=xxx
VITE_APP_URL=https://app.bowerycreative.com
```

### 7. Deployment Strategy

- Deploy Payment Portal to: `pay.bowerycreative.com`
- Deploy Mission Control to: `app.bowerycreative.com`
- Use environment variables to configure cross-app navigation

## Benefits of This Separation

1. **Clear boundaries**: Each project has a specific purpose and audience
2. **Reduced confusion**: No more duplicate components or overlapping features
3. **Better security**: Payment processing isolated from internal tools
4. **Easier maintenance**: Teams can work on projects independently
5. **Improved performance**: Smaller bundle sizes for each application
6. **Scalability**: Each project can evolve based on its specific needs

## Next Steps

1. Review and approve this separation strategy
2. Create a migration plan with specific timelines
3. Set up the shared library structure
4. Begin moving components systematically
5. Update documentation for both projects
6. Test thoroughly before deploying changes