# Mission Control Payment Components

This directory contains React components for integrating Stripe payments into the Mission Control application.

## Components

### 1. PaymentModal
A comprehensive modal dialog for processing different types of payments:
- **Subscriptions**: Monthly/annual plans (Starter, Professional, Agency)
- **Credits**: Campaign credit packages (10, 50, 100, 500 credits)
- **Services**: One-time professional services (Website Redesign, Branding, Marketing Setup)
- **Custom**: Custom payment amounts for specific projects

### 2. PaymentHistory
A table component that displays:
- Past payment transactions
- Payment status (succeeded, pending, failed, refunded)
- Filtering by payment type
- Download receipts and invoices
- Pagination support

### 3. ClientPaymentSection
An integrated dashboard section that shows:
- Total spent by client
- Active subscription status
- Credit balance
- Quick action buttons
- Embedded payment history

## Installation

1. Install required dependencies in your Mission Control frontend:

```bash
npm install @stripe/stripe-js @mui/material @mui/icons-material date-fns
```

2. Add Stripe environment variables to your `.env` file:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_API_URL=http://localhost:3000
```

## Usage

### Basic Implementation

```tsx
import { ClientPaymentSection } from './payment';

function ClientDashboard({ client }) {
  return (
    <div>
      <h1>{client.name} Dashboard</h1>
      
      <ClientPaymentSection
        clientId={client.id}
        clientEmail={client.email}
        clientName={client.name}
      />
    </div>
  );
}
```

### Using PaymentModal Directly

```tsx
import { PaymentModal } from './payment';

function MyComponent() {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePaymentSuccess = (sessionId) => {
    console.log('Payment successful:', sessionId);
    // Handle success (e.g., show success message, refresh data)
  };

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        Make Payment
      </Button>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clientId="client123"
        clientEmail="client@example.com"
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
```

### Using PaymentHistory Separately

```tsx
import { PaymentHistory } from './payment';

function PaymentPage({ clientId }) {
  return (
    <div>
      <h2>Payment History</h2>
      <PaymentHistory 
        clientId={clientId}
        limit={25}
        showLoadMore={true}
      />
    </div>
  );
}
```

## Backend API Requirements

The components expect the following API endpoints to be available:

1. **POST /api/payments/create-checkout**
   - Creates a Stripe checkout session
   - Required body: `{ clientId, clientEmail, productType, productId, successUrl, cancelUrl }`

2. **GET /api/payments/history**
   - Fetches payment history for a client
   - Query params: `clientId, offset, limit, type`

3. **GET /api/payments/client-stats/:clientId**
   - Fetches payment statistics for a client
   - Returns: `{ totalSpent, activeSubscription, creditBalance, lastPaymentDate }`

4. **POST /api/payments/create-portal-session**
   - Creates a Stripe customer portal session for subscription management
   - Required body: `{ clientId }`

## TypeScript Types

All components are fully typed. Import types from the types file:

```tsx
import { 
  PaymentOption, 
  SubscriptionPlan, 
  CreditPackage,
  ServicePackage,
  PaymentHistory 
} from './payment/types';
```

## Customization

### Theme Integration
The components use Material-UI and will automatically inherit your application's theme. Ensure your theme provider wraps these components.

### Custom Payment Options
You can modify the payment options by editing the arrays in `PaymentModal.tsx`:
- `subscriptionPlans`
- `creditPackages`
- `servicePackages`

### Styling
All components use Material-UI's `sx` prop for styling. You can override styles by passing custom sx props or wrapping components in styled components.

## Security Considerations

1. Never expose your Stripe secret key in the frontend
2. Always validate payment amounts on the backend
3. Use Stripe webhooks to verify payment completion
4. Implement proper authentication for all payment endpoints
5. Store sensitive payment data only in Stripe, not in your database

## Error Handling

The components include built-in error handling for:
- Network failures
- Invalid payment data
- Stripe loading failures
- API errors

Errors are displayed using Material-UI Alert components with retry options where appropriate.