import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Send,
  Package,
  Sparkles,
  Rocket,
  Star,
  Zap,
  Edit,
  MoreVertical,
  Globe,
  Code,
  Shield,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/cosmic.css';

interface ClientAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  totalSpent: number;
  monthlyAmount: number;
  accessCode?: string;
  codeUsed?: boolean;
  onboardingCompleted?: boolean;
  paymentCompleted?: boolean;
  customPackage?: {
    name: string;
    description: string;
    features: string[];
  };
}

export const ClientManagementCosmic: React.FC = () => {
  const [clients, setClients] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'all' | 'pending' | 'active'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Hardcoded clients
  const drPedroClient: ClientAccount = {
    id: 'dr-pedro-001',
    name: 'Dr. Greg Pedro',
    email: 'greg@gregpedromd.com',
    phone: '+1234567890',
    company: 'Greg Pedro MD',
    industry: 'Medical Spa',
    status: 'active',
    joinDate: '2024-01-01T00:00:00Z',
    totalSpent: 24000,
    monthlyAmount: 2000,
    accessCode: 'PEDRO',
    codeUsed: true,
    onboardingCompleted: true,
    paymentCompleted: true,
    customPackage: {
      name: 'Premium AI Infrastructure',
      description: 'Complete marketing automation with AI-powered insights',
      features: ['AI Marketing', 'Automated Campaigns', 'Real-time Analytics', 'Custom Integrations'],
    }
  };

  const sarahJonesClient: ClientAccount = {
    id: 'sarah-jones-001',
    name: 'Sarah Jones',
    email: 'sarah@example.com',
    phone: '+1234567890',
    company: 'Sarah Jones Test',
    industry: 'Medical Spa',
    status: 'pending',
    joinDate: new Date().toISOString(),
    totalSpent: 0,
    monthlyAmount: 5,
    accessCode: 'SARAH',
    codeUsed: false,
    onboardingCompleted: false,
    paymentCompleted: false,
    customPackage: {
      name: 'Test Package',
      description: 'Test flow for $5/month',
      features: ['Basic Features'],
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // Load from onboarding_submissions table
      const { data: submissionsData } = await supabase
        .from('onboarding_submissions')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      const allClients = [drPedroClient, sarahJonesClient];
      
      if (submissionsData) {
        const submissionClients = submissionsData.map(submission => {
          const formData = submission.form_data || {};
          return {
            id: submission.id,
            name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || submission.practice_name,
            email: submission.email,
            phone: formData.phone || '',
            company: submission.practice_name || formData.practiceName || '',
            industry: formData.practiceType || 'Medical Spa',
            status: 'active' as const,
            joinDate: submission.created_at,
            totalSpent: formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : 0,
            monthlyAmount: formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : 0,
            accessCode: formData.promoCode || '',
            codeUsed: true,
            onboardingCompleted: true,
            paymentCompleted: true,
            customPackage: {
              name: formData.selectedPackage?.name || 'Onboarded via Portal',
              description: formData.selectedPackage?.description || 'Self-service onboarding',
              features: formData.selectedPackage?.features || formData.marketingGoals || [],
            }
          };
        });
        allClients.push(...submissionClients);
      }
      
      setClients(allClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([drPedroClient, sarahJonesClient]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return matchesSearch && client.status === 'active';
    if (selectedTab === 'pending') return matchesSearch && client.status === 'pending';
    return matchesSearch;
  });

  const ClientCard = ({ client, delay = 0 }: { client: ClientAccount; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      onClick={() => setSelectedClient(client)}
      className="cosmic-card cosmic-card-hover rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full cosmic-border flex items-center justify-center ${
              client.status === 'active' ? 'bg-green-400/20' : 'bg-orange-400/20'
            }`}>
              <Building className={`w-6 h-6 ${
                client.status === 'active' ? 'text-green-400' : 'text-orange-400'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{client.name}</h3>
              <p className="text-sm text-gray-400">{client.company}</p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="w-4 h-4" />
            {client.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Phone className="w-4 h-4" />
            {client.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            Joined {new Date(client.joinDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="text-lg font-bold cosmic-text-gradient">
              ${client.monthlyAmount.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {client.customPackage && (
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                <p className="text-xs text-yellow-400">{client.customPackage.name}</p>
              </div>
            )}
            <div className={`px-3 py-1 rounded-full ${
              client.status === 'active' 
                ? 'bg-green-400/20 text-green-400' 
                : client.status === 'pending'
                ? 'bg-orange-400/20 text-orange-400'
                : 'bg-gray-400/20 text-gray-400'
            }`}>
              <p className="text-xs capitalize">{client.status}</p>
            </div>
          </div>
        </div>
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

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-2">
            <span className="cosmic-text-gradient neon-text">Client Management</span>
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Create client accounts, manage access codes, and track onboarding
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Clients</p>
                <p className="text-3xl font-bold cosmic-text-gradient">{clients.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {clients.filter(c => c.status === 'active').length} active, 
                  {' '}{clients.filter(c => c.status === 'pending').length} pending
                </p>
              </div>
              <Users className="w-10 h-10 text-yellow-400 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Awaiting Action</p>
                <p className="text-3xl font-bold cosmic-text-gradient">
                  {clients.filter(c => c.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Clients who need to complete payment</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Monthly Recurring</p>
                <p className="text-3xl font-bold cosmic-text-gradient">
                  ${clients.reduce((sum, c) => sum + (c.status === 'active' ? c.monthlyAmount : 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From {clients.filter(c => c.status === 'active').length} active clients</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Tabs and Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2 p-1 cosmic-card rounded-full">
            {['overview', 'all', 'pending', 'active'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="cosmic-glow px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </motion.button>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTab === 'overview' ? (
            // Show featured clients in overview
            <>
              {[drPedroClient, ...filteredClients.filter(c => c.id !== drPedroClient.id).slice(0, 5)]
                .map((client, index) => (
                  <ClientCard key={client.id} client={client} delay={0.5 + index * 0.1} />
                ))}
              {filteredClients.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="cosmic-card rounded-2xl p-6 flex items-center justify-center"
                >
                  <button
                    onClick={() => setSelectedTab('all')}
                    className="text-center group"
                  >
                    <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 group-hover:from-yellow-400/30 group-hover:to-orange-500/30 transition-colors">
                      <Users className="w-8 h-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-400">View All</p>
                    <p className="text-2xl font-bold cosmic-text-gradient">
                      {filteredClients.length - 6}+ More
                    </p>
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            // Show all filtered clients
            filteredClients.map((client, index) => (
              <ClientCard key={client.id} client={client} delay={0.5 + (index % 9) * 0.1} />
            ))
          )}
        </div>
      </div>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClient(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full cosmic-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full cosmic-border mx-auto mb-4 flex items-center justify-center ${
                  selectedClient.status === 'active' ? 'bg-green-400/20' : 'bg-orange-400/20'
                }`}>
                  <Building className={`w-10 h-10 ${
                    selectedClient.status === 'active' ? 'text-green-400' : 'text-orange-400'
                  }`} />
                </div>
                <h2 className="text-3xl font-bold cosmic-text-gradient mb-2">{selectedClient.name}</h2>
                <p className="text-gray-400">{selectedClient.company}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-white">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-white">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Industry</p>
                    <p className="text-white">{selectedClient.industry}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monthly Amount</p>
                    <p className="text-2xl font-bold cosmic-text-gradient">
                      ${selectedClient.monthlyAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                    <p className="text-white">${selectedClient.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedClient.status === 'active' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-orange-400/20 text-orange-400'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedClient.customPackage && (
                <div className="mt-8 p-6 cosmic-card rounded-xl">
                  <h3 className="text-lg font-semibold cosmic-text-gradient mb-4">
                    {selectedClient.customPackage.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{selectedClient.customPackage.description}</p>
                  <div className="space-y-2">
                    {selectedClient.customPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};