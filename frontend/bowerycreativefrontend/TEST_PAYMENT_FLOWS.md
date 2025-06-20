# Payment Flow Testing Guide

## To test the payment flow:

### 1. Quick Test Links (No login required):

**$1 Test Payment:**
```
https://bowerycreativeagency.com/pay?invoice=test-flow
```

**$5 Sarah Test:**
```
https://bowerycreativeagency.com/pay?invoice=sarah-test
```

**$2000 Dr. Pedro Monthly:**
```
https://bowerycreativeagency.com/pay?code=PEDRO
```

### 2. Using Real Invoices:

1. Go to Invoice Management
2. Create or edit an invoice
3. Click the yellow "Copy Link" button (now visible for all statuses)
4. Share the link with client (or test it yourself)

### 3. Payment Flow:

1. When you visit a payment link, it will:
   - Show the invoice details for 1.5 seconds
   - Automatically redirect to Stripe checkout
   - Process the payment
   - Return to success/cancel page

### 4. Stripe Test Cards:

Use these test card numbers in Stripe:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155

Use any future date for expiry and any 3 digits for CVC.

### 5. What's Fixed:

- ✅ Payment links now load real invoice data from database
- ✅ Auto-redirects to Stripe after showing invoice
- ✅ Copy payment link button visible for all invoice statuses
- ✅ Clear workflow instructions in invoice management

### 6. Testing Different Scenarios:

- **New Invoice:** Create invoice → Copy link → Test payment
- **Existing Invoice:** Edit status to "Sent" → Copy link → Test payment
- **Custom Amount:** Use URL like `/pay?amount=50&email=test@example.com`