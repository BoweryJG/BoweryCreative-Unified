import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { Calendar, CreditCard, Shield, X, Check } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface SubscriptionFormProps {
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe not loaded properly');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      // Create subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: 'greg.pedro@example.com',
          customer_name: 'Dr. Greg Pedro',
          price_id: 'price_pedro_monthly_2000', // Create this in Stripe
          description: 'Monthly AI Infrastructure Management',
        }),
      });

      const { client_secret, subscription_id } = await response.json();

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Dr. Greg Pedro',
            email: 'greg.pedro@example.com',
          },
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscription Setup Complete! 🎉</h3>
        <p className="text-gray-600 mb-6">
          Your monthly AI infrastructure management service is now active.
          You'll be charged $2,000 on the same date each month.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Immediate access to all AI systems continues</li>
            <li>• Monthly optimization reports will be sent</li>
            <li>• Priority support team will be notified</li>
            <li>• Cancel anytime with 30 days notice</li>
          </ul>
        </div>
        <button
          onClick={onCancel}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Setup Monthly Auto-Pay</h3>
        <p className="text-gray-600">$2,000/month • Cancel anytime with 30 days notice</p>
      </div>

      {/* Service Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-blue-50 p-6 rounded-xl border border-yellow-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-yellow-600" />
          AI Infrastructure Services Included
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Custom CRM System ($45K value)
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            AI Phone + Linguistics ($40K value)
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Dental Simulators ($20K value)
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Custom Website ($12K value)
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            AI Chatbot ($8K value)
          </div>
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            24/7 Monitoring & Support
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <div className="flex items-center mb-4">
          <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
          <h4 className="font-semibold text-gray-900">Payment Information</h4>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Billing Schedule</span>
          </div>
          <p className="text-sm text-gray-600">
            First charge: Today ($2,000)<br />
            Next charge: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}<br />
            Recurring: Monthly on the same date
          </p>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Flexible Cancellation</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Cancel anytime with 30 days written notice</li>
          <li>• Email: cancel@bowerycreativeagency.com</li>
          <li>• No early termination fees or penalties</li>
          <li>• Services continue through your final billing period</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Setting up...' : 'Setup Auto-Pay ($2,000/mo)'}
        </button>
      </div>
    </form>
  );
};

export const PedroSubscription: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Monthly AI Infrastructure Service</h2>
          <p className="text-gray-600 text-lg">Dr. Greg Pedro Practice</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 via-blue-500 to-purple-600 p-1 rounded-2xl mb-8">
          <div className="bg-white rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600 mb-2">
                $2,000
              </div>
              <div className="text-gray-600">per month</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Enterprise Infrastructure Value:</span>
                <span className="font-semibold">$125,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Management Fee:</span>
                <span className="font-semibold text-green-600">$2,000</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cancellation:</span>
                  <span className="font-semibold text-blue-600">Anytime (30 days notice)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Setup Monthly Auto-Pay
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Secure payment processing by Stripe</p>
          <p>🔒 256-bit SSL encryption • PCI DSS compliant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <Elements stripe={stripePromise}>
          <SubscriptionForm onCancel={() => setShowForm(false)} />
        </Elements>
      </div>
    </div>
  );
};