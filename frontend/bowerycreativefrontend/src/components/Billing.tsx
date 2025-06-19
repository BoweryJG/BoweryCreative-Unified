import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Check, 
  Download,
  Settings,
  Shield,
  Zap,
  BarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  currentPeriodEnd: Date;
  amount: number;
  interval: 'month' | 'year';
}

export const Billing: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'invoices'>('overview');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage] = useState({
    storage: { used: 2.3, limit: 10, unit: 'GB' },
    bandwidth: { used: 45, limit: 100, unit: 'GB' },
    apiCalls: { used: 12500, limit: 50000, unit: 'calls' }
  });

  useEffect(() => {
    loadBillingData();
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Mock data for now - would normally fetch from payment provider
      setPaymentMethods([
        {
          id: '1',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        }
      ]);
      
      setSubscription({
        id: 'sub_1',
        plan: 'Professional',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 2000,
        interval: 'month'
      });
      
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 500,
      features: ['5 Active Campaigns', '10GB Storage', 'Email Support', 'Basic Analytics'],
      current: false
    },
    {
      name: 'Professional',
      price: 2000,
      features: ['Unlimited Campaigns', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Branding'],
      current: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 5000,
      features: ['Everything in Pro', 'Unlimited Storage', 'Dedicated Account Manager', 'Custom Integrations', 'SLA'],
      current: false
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-champagne/10 to-champagne/5 border border-champagne/20 rounded-lg p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-arctic mb-2">Current Plan</h3>
            <p className="text-3xl font-bold text-champagne mb-1">
              {subscription?.plan || 'No Active Plan'}
            </p>
            <p className="text-racing-silver">
              ${subscription ? (subscription.amount / 100).toFixed(2) : '0.00'} / {subscription?.interval || 'month'}
            </p>
            {subscription && (
              <p className="text-sm text-racing-silver mt-2">
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <Zap className="w-12 h-12 text-champagne opacity-50" />
        </div>
      </motion.div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(usage).map(([key, data], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-graphite rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-arctic capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              {key === 'storage' && <Shield className="w-5 h-5 text-racing-silver" />}
              {key === 'bandwidth' && <BarChart className="w-5 h-5 text-racing-silver" />}
              {key === 'apiCalls' && <Zap className="w-5 h-5 text-racing-silver" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-racing-silver">Used</span>
                <span className="text-arctic">
                  {data.used.toLocaleString()} / {data.limit.toLocaleString()} {data.unit}
                </span>
              </div>
              <div className="w-full bg-obsidian rounded-full h-2">
                <div
                  className="bg-champagne h-full rounded-full transition-all duration-500"
                  style={{ width: `${(data.used / data.limit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-racing-silver">
                {((data.used / data.limit) * 100).toFixed(1)}% used
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-xl font-semibold text-arctic mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-graphite rounded-lg p-6 ${
                plan.current ? 'ring-2 ring-champagne' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-champagne text-obsidian px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
              )}
              <h4 className="text-lg font-semibold text-arctic mb-2">{plan.name}</h4>
              <p className="text-3xl font-bold text-champagne mb-4">
                ${plan.price / 100}
                <span className="text-sm text-racing-silver font-normal">/month</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-racing-silver">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg transition-all ${
                  plan.current
                    ? 'bg-champagne/20 text-champagne cursor-default'
                    : 'bg-champagne text-obsidian hover:bg-champagne/90'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-arctic">Payment Methods</h3>
        <button className="btn-primary">
          Add Payment Method
        </button>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-graphite rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-champagne" />
                <div>
                  <p className="text-arctic font-medium">
                    {method.brand} ending in {method.last4}
                  </p>
                  <p className="text-sm text-racing-silver">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {method.isDefault && (
                  <span className="bg-champagne/20 text-champagne px-3 py-1 rounded-full text-sm">
                    Default
                  </span>
                )}
                <button className="text-racing-silver hover:text-arctic transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-graphite rounded-lg p-12 text-center">
          <CreditCard className="w-12 h-12 text-racing-silver mx-auto mb-4" />
          <p className="text-racing-silver mb-4">No payment methods on file</p>
          <button className="btn-primary">
            Add Your First Payment Method
          </button>
        </div>
      )}

      {/* Billing Address */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-arctic mb-4">Billing Address</h4>
        <div className="bg-graphite rounded-lg p-6">
          <p className="text-arctic">Dr. Greg Pedro</p>
          <p className="text-racing-silver">123 Medical Center Drive</p>
          <p className="text-racing-silver">Suite 100</p>
          <p className="text-racing-silver">New York, NY 10001</p>
          <button className="mt-4 text-champagne hover:text-champagne/80 transition-colors text-sm">
            Edit Address
          </button>
        </div>
      </div>
    </div>
  );

  const renderRecentInvoices = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-arctic">Recent Invoices</h3>
        <a href="/invoices" className="text-champagne hover:text-champagne/80 transition-colors text-sm">
          View All Invoices
        </a>
      </div>
      
      <div className="space-y-2">
        {[
          { date: '2024-01-01', amount: 2000, status: 'paid' },
          { date: '2023-12-01', amount: 2000, status: 'paid' },
          { date: '2023-11-01', amount: 2000, status: 'paid' }
        ].map((invoice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-graphite rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-racing-silver" />
              <div>
                <p className="text-arctic">{new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-sm text-racing-silver">Professional Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-arctic font-medium">${(invoice.amount / 100).toFixed(2)}</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                {invoice.status}
              </span>
              <button className="text-champagne hover:text-champagne/80 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-racing-silver">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-arctic mb-2">Billing & Subscription</h1>
        <p className="text-racing-silver">Manage your payment methods and subscription</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 mb-8 border-b border-graphite">
        {[
          { id: 'overview', label: 'Overview', icon: DollarSign },
          { id: 'payment', label: 'Payment Methods', icon: CreditCard },
          { id: 'invoices', label: 'Recent Invoices', icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 flex items-center gap-2 transition-all relative ${
              activeTab === tab.id
                ? 'text-champagne'
                : 'text-racing-silver hover:text-arctic'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-champagne"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payment' && renderPaymentMethods()}
          {activeTab === 'invoices' && renderRecentInvoices()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};