# BoweryCreative Project Separation Plan

## 🎯 Clear Project Purposes

### 1. **Payment Portal** (`payments/` → pay.bowerycreative.com)
**Purpose**: Client-facing payment processing only
**Users**: Your clients

**Features to KEEP**:
- ✅ Invoice payment page (clients pay specific invoices)
- ✅ Subscription selection & checkout
- ✅ Credit package purchase
- ✅ Payment success/cancel pages
- ✅ Stripe checkout integration
- ✅ Simple auth (just for payment security)

**Features to REMOVE**:
- ❌ Client management
- ❌ Admin dashboard
- ❌ Invoice creation/editing
- ❌ Chatbot
- ❌ Any internal tools

### 2. **Mission Control** (`dashboard/` → app.bowerycreative.com) 
**Purpose**: Internal agency management system
**Users**: You and your team

**Features to KEEP/ADD**:
- ✅ Client management (full CRUD)
- ✅ Invoice creation & management
- ✅ Email campaign tools
- ✅ SMS campaign tools
- ✅ Social media management
- ✅ Analytics dashboard
- ✅ AI chatbot for internal use
- ✅ Billing overview (see all payments)
- ✅ Admin authentication

**Features to REMOVE**:
- ❌ Public payment processing
- ❌ Stripe checkout (just view payment data)

### 3. **Marketing Website** (`frontend/` → bowerycreative.com)
**Purpose**: Public marketing site
**Users**: Potential clients

**Features**:
- ✅ Service information
- ✅ Portfolio
- ✅ Contact forms
- ✅ Blog/content
- ✅ Links to payment portal

## 🔄 Data Flow

```
Client Journey:
1. Visit bowerycreative.com → Learn about services
2. Get invoice email → Click "Pay Invoice" 
3. Redirected to pay.bowerycreative.com → Make payment
4. Payment recorded in database

Your Journey:
1. Login to app.bowerycreative.com
2. Create client & invoice
3. Send invoice (with payment link)
4. Monitor payments & campaigns
5. Manage all agency operations
```

## 📁 Recommended Folder Structure

```
BoweryCreative-Unified/
├── frontend/          → bowerycreative.com (Marketing)
├── payment-portal/    → pay.bowerycreative.com (Client payments)
├── mission-control/   → app.bowerycreative.com (Agency management)
├── backend/           → API for all services
├── shared/            → Shared components & utilities
└── ai-intelligence-dashboard/ → AI industry tracking
```

## 🛠️ Implementation Steps

### Phase 1: Clean up Payment Portal
1. Remove all admin/management components
2. Keep only payment-related pages
3. Simplify to just:
   - `/pay/:invoiceId` - Pay specific invoice
   - `/subscribe` - Choose subscription
   - `/credits` - Buy credit packages
   - `/success` and `/cancel` - Payment status

### Phase 2: Consolidate Mission Control  
1. Move all management features here
2. Add missing features from payments
3. Create unified admin dashboard
4. Implement role-based access

### Phase 3: Create Shared Library
1. Move common components to `shared/`
2. Include:
   - UI components
   - Supabase client config
   - Type definitions
   - Utility functions

### Phase 4: Update URLs & Routing
1. Payment links: `https://pay.bowerycreative.com/pay/{invoiceId}`
2. Admin login: `https://app.bowerycreative.com`
3. Update email templates with new URLs

## 🎨 Visual Distinction

### Payment Portal Design
- Clean, minimal, trustworthy
- Focus on security badges
- Simple 3-step checkout flow
- Mobile-first design

### Mission Control Design  
- Data-rich dashboard
- Multiple navigation options
- Power-user features
- Desktop-optimized

## 🔐 Security Benefits

1. **Separation of concerns** - Client data isolated from payment processing
2. **Reduced attack surface** - Payment portal has minimal features
3. **Clear authentication** - Different auth systems for clients vs team
4. **Audit trails** - Easier to track payment vs management actions

## ✅ Success Metrics

- Clients can pay in < 3 clicks
- No confusion about where to login
- Clear separation of public vs private tools
- Easier to maintain and update
- Better security and compliance