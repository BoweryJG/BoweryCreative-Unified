import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Activity,
  Package,
  Rocket,
  Star,
  ChevronRight,
  FileText,
  CreditCard,
  Sparkles,
  Zap,
  BarChart,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/cosmic.css';

interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  pendingPayments: number;
  monthlyRevenue: number;
  totalRevenue: number;
  recentSignups: any[];
  clientsByPackage: { [key: string]: number };
}

export const DashboardCosmic: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    activeClients: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    recentSignups: [],
    clientsByPackage: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load paid onboarding submissions
      const { data: submissions } = await supabase
        .from('onboarding_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissions) {
        // Calculate metrics
        const paidSubmissions = submissions.filter(s => s.status === 'paid');
        const pendingSubmissions = submissions.filter(s => s.status === 'pending_payment');
        
        // Calculate revenue
        let monthlyRev = 2000; // Dr. Pedro's hardcoded amount
        let totalRev = 24000; // Dr. Pedro's total
        
        paidSubmissions.forEach(submission => {
          const formData = submission.form_data || {};
          const amount = parseFloat(formData.monthlyBudget) || 
                        formData.selectedPackage?.price || 0;
          monthlyRev += amount;
          totalRev += amount;
        });

        // Count by package
        const packageCounts: { [key: string]: number } = {
          'Access Code': 1, // Dr. Pedro
          'Foundation Elite': 0,
          'Visionary Transformation': 0,
          'Market Dominance': 0
        };

        paidSubmissions.forEach(submission => {
          const packageName = submission.form_data?.selectedPackage?.name;
          if (packageName && packageCounts[packageName] !== undefined) {
            packageCounts[packageName]++;
          } else if (submission.form_data?.promoCode) {
            packageCounts['Access Code']++;
          }
        });

        setMetrics({
          totalClients: paidSubmissions.length + 2, // +2 for Dr. Pedro and Sarah
          activeClients: paidSubmissions.length + 1, // +1 for Dr. Pedro
          pendingPayments: pendingSubmissions.length + 1, // +1 for Sarah
          monthlyRevenue: monthlyRev,
          totalRevenue: totalRev,
          recentSignups: submissions.slice(0, 5),
          clientsByPackage: packageCounts
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CosmicStatCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="cosmic-card cosmic-card-hover rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
          </p>
          <p className="text-3xl font-bold cosmic-text-gradient">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`p-3 rounded-full bg-gradient-to-br from-${color}/20 to-${color}/10`}
        >
          <Icon className={`w-6 h-6 text-${color}`} />
        </motion.div>
      </div>
    </motion.div>
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
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 15}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="cosmic-text-gradient neon-text">Admin Dashboard</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Welcome to your cosmic command center
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/clients')}
            className="cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            View All Clients
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <CosmicStatCard
            title="Total Clients"
            value={metrics.totalClients}
            icon={Users}
            color="yellow-400"
            subtitle={`${metrics.activeClients} active`}
            delay={0}
          />
          <CosmicStatCard
            title="Monthly Revenue"
            value={`$${metrics.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green-400"
            subtitle="Recurring"
            delay={0.1}
          />
          <CosmicStatCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="blue-400"
            subtitle="All time"
            delay={0.2}
          />
          <CosmicStatCard
            title="Pending Payments"
            value={metrics.pendingPayments}
            icon={Clock}
            color="orange-400"
            subtitle="Awaiting payment"
            delay={0.3}
          />
        </div>

        {/* Package Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cosmic-card rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Package className="w-6 h-6 text-yellow-400" />
            <span className="cosmic-text-gradient">Clients by Package</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics.clientsByPackage).map(([packageName, count], index) => (
              <motion.div
                key={packageName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="cosmic-card cosmic-card-hover rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold cosmic-text-gradient mb-2">{count}</div>
                <p className="text-sm text-gray-400">{packageName}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Signups */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="cosmic-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-yellow-400" />
              <span className="cosmic-text-gradient">Recent Activity</span>
            </h2>
            <div className="space-y-4">
              {metrics.recentSignups.length > 0 ? (
                metrics.recentSignups.map((signup, index) => (
                  <motion.div
                    key={signup.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 cosmic-card rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        signup.status === 'paid' ? 'bg-green-400' : 'bg-orange-400'
                      } animate-pulse`} />
                      <div>
                        <p className="font-medium text-white">
                          {signup.practice_name || 'Unknown Practice'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(signup.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      signup.status === 'paid' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-orange-400/20 text-orange-400'
                    }`}>
                      {signup.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent signups</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="cosmic-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Rocket className="w-6 h-6 text-yellow-400" />
              <span className="cosmic-text-gradient">Quick Actions</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: Users, label: 'Manage Clients', desc: 'View and edit accounts', path: '/clients' },
                { icon: FileText, label: 'Create Invoice', desc: 'Generate new invoices', path: '/invoices' },
                { icon: CreditCard, label: 'Billing Overview', desc: 'Manage subscriptions', path: '/billing' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className="w-full p-4 cosmic-card cosmic-card-hover rounded-xl text-left group flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-500/20 group-hover:from-yellow-400/30 group-hover:to-orange-500/30 transition-colors">
                      <action.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 cosmic-card animated-border rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Star className="w-10 h-10 text-yellow-400" />
            <Globe className="w-10 h-10 text-orange-400" />
            <Zap className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold cosmic-text-gradient mb-2">Your Agency is Stellar!</h3>
          <p className="text-gray-400">
            Keep reaching for the stars. Your clients are experiencing cosmic growth.
          </p>
        </motion.div>
      </div>
    </div>
  );
};