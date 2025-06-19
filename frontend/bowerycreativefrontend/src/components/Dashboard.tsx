import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  pendingPayments: number;
  monthlyRevenue: number;
  totalRevenue: number;
  recentSignups: any[];
  clientsByPackage: { [key: string]: number };
}

export const Dashboard: React.FC = () => {
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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-graphite rounded-lg p-6 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-racing-silver text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-arctic">{value}</p>
          {subtitle && (
            <p className="text-xs text-racing-silver mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-${color}/5 rounded-full`} />
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-racing-silver">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-arctic mb-2">Dashboard</h1>
          <p className="text-racing-silver">Welcome back! Here's your agency overview.</p>
        </div>
        <button
          onClick={() => navigate('/clients')}
          className="btn-primary"
        >
          View All Clients
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={metrics.totalClients}
          icon={Users}
          color="champagne"
          subtitle={`${metrics.activeClients} active`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green-400"
          subtitle="Recurring"
        />
        <StatCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="blue-400"
          subtitle="All time"
        />
        <StatCard
          title="Pending Payments"
          value={metrics.pendingPayments}
          icon={Clock}
          color="orange-400"
          subtitle="Awaiting payment"
        />
      </div>

      {/* Package Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-graphite rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-arctic mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-champagne" />
          Clients by Package
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics.clientsByPackage).map(([packageName, count]) => (
            <div key={packageName} className="bg-obsidian rounded-lg p-4">
              <p className="text-sm text-racing-silver mb-1">{packageName}</p>
              <p className="text-2xl font-bold text-arctic">{count}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-graphite rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-arctic mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-champagne" />
            Recent Signups
          </h2>
          <div className="space-y-3">
            {metrics.recentSignups.length > 0 ? (
              metrics.recentSignups.map((signup, index) => (
                <div key={signup.id} className="flex items-center justify-between p-3 bg-obsidian rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      signup.status === 'paid' ? 'bg-green-400' : 'bg-orange-400'
                    }`} />
                    <div>
                      <p className="text-arctic font-medium">
                        {signup.practice_name || 'Unknown Practice'}
                      </p>
                      <p className="text-xs text-racing-silver">
                        {new Date(signup.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    signup.status === 'paid' 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-orange-400/20 text-orange-400'
                  }`}>
                    {signup.status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-racing-silver text-center py-4">No recent signups</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-graphite rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-arctic mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-champagne" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/clients')}
              className="w-full p-4 bg-obsidian rounded-lg hover:bg-obsidian/80 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-arctic font-medium">Manage Clients</p>
                    <p className="text-xs text-racing-silver">View and edit client accounts</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-racing-silver group-hover:text-champagne transition-colors" />
              </div>
            </button>

            <button
              onClick={() => navigate('/invoices')}
              className="w-full p-4 bg-obsidian rounded-lg hover:bg-obsidian/80 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-arctic font-medium">Create Invoice</p>
                    <p className="text-xs text-racing-silver">Generate new invoices</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-racing-silver group-hover:text-champagne transition-colors" />
              </div>
            </button>

            <button
              onClick={() => navigate('/billing')}
              className="w-full p-4 bg-obsidian rounded-lg hover:bg-obsidian/80 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-arctic font-medium">Billing Overview</p>
                    <p className="text-xs text-racing-silver">Manage subscriptions</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-racing-silver group-hover:text-champagne transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-champagne/10 to-champagne/5 border border-champagne/20 rounded-lg p-6"
      >
        <div className="flex items-center gap-4">
          <Star className="w-8 h-8 text-champagne" />
          <div>
            <h3 className="text-lg font-semibold text-arctic">Your agency is growing!</h3>
            <p className="text-racing-silver">
              Keep up the great work. Your clients are seeing amazing results.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};