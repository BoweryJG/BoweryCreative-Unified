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
  BarChart,
  Sparkles,
  Star,
  Globe,
  Rocket,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/cosmic.css';

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

export const BillingCosmic: React.FC = () => {
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
      current: false,
      icon: Rocket
    },
    {
      name: 'Professional',
      price: 2000,
      features: ['Unlimited Campaigns', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Branding'],
      current: true,
      popular: true,
      icon: Star
    },
    {
      name: 'Enterprise',
      price: 5000,
      features: ['Everything in Pro', 'Unlimited Storage', 'Dedicated Account Manager', 'Custom Integrations', 'SLA'],
      current: false,
      icon: Globe
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cosmic-card cosmic-card-hover rounded-2xl p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              <span className="cosmic-text-gradient neon-text">Current Plan</span>
            </h3>
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {subscription?.plan || 'No Active Plan'}
            </p>
            <p className="text-gray-400">
              ${subscription ? (subscription.amount / 100).toFixed(2) : '0.00'} / {subscription?.interval || 'month'}
            </p>
            {subscription && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
          >
            <Zap className="w-12 h-12 text-yellow-400" />
          </motion.div>
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
            className="cosmic-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              {key === 'storage' && <Shield className="w-5 h-5 text-blue-400" />}
              {key === 'bandwidth' && <BarChart className="w-5 h-5 text-green-400" />}
              {key === 'apiCalls' && <Zap className="w-5 h-5 text-yellow-400" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Used</span>
                <span className="text-white">
                  {data.used.toLocaleString()} / {data.limit.toLocaleString()} {data.unit}
                </span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.used / data.limit) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500">
                {((data.used / data.limit) * 100).toFixed(1)}% used
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span className="cosmic-text-gradient">Available Plans</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative cosmic-card cosmic-card-hover rounded-2xl p-6 ${
                plan.current ? 'animated-border' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="cosmic-glow bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="inline-block p-3 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 mb-4"
                >
                  <plan.icon className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <p className="text-3xl md:text-4xl font-bold cosmic-text-gradient mb-1">
                  ${plan.price / 100}
                </p>
                <p className="text-sm text-gray-400">per month</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: plan.current ? 1 : 1.05 }}
                whileTap={{ scale: plan.current ? 1 : 0.95 }}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.current
                    ? 'bg-white/10 text-gray-400 cursor-default'
                    : 'cosmic-glow bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade Now'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl md:text-2xl font-semibold">
          <span className="cosmic-text-gradient">Payment Methods</span>
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cosmic-glow px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Payment Method
        </motion.button>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="cosmic-card cosmic-card-hover rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                  <CreditCard className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {method.brand} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {method.isDefault && (
                  <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-400 text-sm">
                    Default
                  </span>
                )}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cosmic-card rounded-2xl p-12 text-center"
        >
          <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">No payment methods on file</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
          >
            Add Your First Payment Method
          </motion.button>
        </motion.div>
      )}

      {/* Billing Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-yellow-400" />
          Billing Address
        </h4>
        <div className="cosmic-card rounded-xl p-6">
          <p className="text-white font-medium">Dr. Greg Pedro</p>
          <p className="text-gray-400">123 Medical Center Drive</p>
          <p className="text-gray-400">Suite 100</p>
          <p className="text-gray-400">New York, NY 10001</p>
          <button className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
            Edit Address
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderRecentInvoices = () => (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl md:text-2xl font-semibold">
          <span className="cosmic-text-gradient">Recent Invoices</span>
        </h3>
        <a href="/invoices" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm flex items-center gap-1">
          View All Invoices
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="space-y-3">
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
            className="cosmic-card cosmic-card-hover rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">Professional Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">${(invoice.amount / 100).toFixed(2)}</span>
              <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-400 text-xs">
                {invoice.status}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4 text-yellow-400" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-gradient relative overflow-hidden">
      {/* Animated Galaxy Orb */}
      <div className="galaxy-orb" />
      
      {/* Stars Background */}
      <div className="stars" />
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span className="cosmic-text-gradient neon-text">Billing & Subscription</span>
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Manage your cosmic journey
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 md:gap-6 mb-8 border-b border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: DollarSign },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'invoices', label: 'Invoices', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-3 md:px-4 flex items-center gap-2 transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
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
      </div>
    </div>
  );
};