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
  Sparkles,
  MoreVertical,
  X,
  Edit2,
  Save,
  XCircle,
  Trash2
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
  subscriptionPlan?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<ClientAccount | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<ClientAccount>>({
    status: 'pending',
    monthlyAmount: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // Load from real clients table
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (clientsData) {
        const mappedClients = clientsData.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone || '',
          company: client.company,
          industry: client.industry || 'Not specified',
          status: client.status as 'active' | 'pending' | 'inactive',
          joinDate: client.join_date || client.created_at,
          totalSpent: parseFloat(client.total_spent || '0'),
          monthlyAmount: parseFloat(client.monthly_amount || '0'),
          accessCode: client.access_code || '',
          codeUsed: client.code_used || false,
          onboardingCompleted: client.onboarding_completed || false,
          paymentCompleted: client.payment_completed || false,
          subscriptionPlan: client.subscription_plan || '',
          customPackage: client.custom_package || null
        }));
        
        setClients(mappedClients);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedClient(selectedClient);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedClient(null);
  };

  const handleSave = async () => {
    if (!editedClient) return;
    
    setIsSaving(true);
    try {
      // Update in the real clients table
      const { error } = await supabase
        .from('clients')
        .update({
          name: editedClient.name,
          email: editedClient.email,
          phone: editedClient.phone,
          company: editedClient.company,
          industry: editedClient.industry,
          status: editedClient.status,
          monthly_amount: editedClient.monthlyAmount,
          total_spent: editedClient.totalSpent,
          subscription_plan: editedClient.subscriptionPlan,
          custom_package: editedClient.customPackage,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedClient.id);

      if (error) throw error;

      // Update local state
      const updatedClients = clients.map(client => 
        client.id === editedClient.id ? editedClient : client
      );
      setClients(updatedClients);
      setSelectedClient(editedClient);
      setIsEditing(false);
      setEditedClient(null);
      
      // Show success message
      alert('Client updated successfully!');
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedClient.name}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsSaving(true);
    try {
      // Delete from the real clients table
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', selectedClient.id);

      if (error) throw error;
      
      // Remove from local state
      setClients(clients.filter(c => c.id !== selectedClient.id));
      
      // Close modal and show success
      setSelectedClient(null);
      alert('Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof ClientAccount, value: any) => {
    if (!editedClient) return;
    
    setEditedClient({
      ...editedClient,
      [field]: value
    });
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email || !newClient.company) {
      alert('Please fill in all required fields: Name, Email, and Company');
      return;
    }

    setIsSaving(true);
    try {
      // Generate a unique access code
      const accessCode = newClient.company?.toUpperCase().slice(0, 5) + Math.random().toString(36).substring(2, 7).toUpperCase();
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone || '',
          company: newClient.company,
          industry: newClient.industry || 'Not specified',
          business_type: newClient.industry || 'Not specified',
          status: newClient.status || 'pending',
          monthly_amount: newClient.monthlyAmount || 0,
          total_spent: 0,
          access_code: accessCode,
          code_used: false,
          onboarding_completed: false,
          payment_completed: false,
          subscription_plan: newClient.subscriptionPlan || '',
          join_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Map the returned data to ClientAccount format
        const newClientAccount: ClientAccount = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          company: data.company,
          industry: data.industry || 'Not specified',
          status: data.status as 'active' | 'pending' | 'inactive',
          joinDate: data.join_date || data.created_at,
          totalSpent: parseFloat(data.total_spent || '0'),
          monthlyAmount: parseFloat(data.monthly_amount || '0'),
          accessCode: data.access_code || '',
          codeUsed: data.code_used || false,
          onboardingCompleted: data.onboarding_completed || false,
          paymentCompleted: data.payment_completed || false,
          subscriptionPlan: data.subscription_plan || '',
          customPackage: data.custom_package || null
        };

        // Add to local state
        setClients([newClientAccount, ...clients]);
        
        // Reset form and close modal
        setNewClient({ status: 'pending', monthlyAmount: 0, totalSpent: 0 });
        setIsAddModalOpen(false);
        
        alert(`Client ${data.name} added successfully! Access code: ${accessCode}`);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewClientFieldChange = (field: keyof ClientAccount, value: any) => {
    setNewClient({
      ...newClient,
      [field]: value
    });
  };

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
              onClick={() => setIsAddModalOpen(true)}
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
              {filteredClients.slice(0, 6).map((client, index) => (
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
            onClick={() => {
              setSelectedClient(null);
              setIsEditing(false);
              setEditedClient(null);
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full cosmic-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                      title="Edit client"
                    >
                      <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                      title="Delete client"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(null);
                        setIsEditing(false);
                        setEditedClient(null);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 rounded-lg hover:bg-green-400/20 transition-colors group disabled:opacity-50"
                      title="Save changes"
                    >
                      <Save className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="p-2 rounded-lg hover:bg-red-400/20 transition-colors group disabled:opacity-50"
                      title="Cancel editing"
                    >
                      <XCircle className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                    </button>
                  </>
                )}
              </div>

              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full cosmic-border mx-auto mb-4 flex items-center justify-center ${
                  selectedClient.status === 'active' ? 'bg-green-400/20' : 'bg-orange-400/20'
                }`}>
                  <Building className={`w-10 h-10 ${
                    selectedClient.status === 'active' ? 'text-green-400' : 'text-orange-400'
                  }`} />
                </div>
                <h2 className="text-3xl font-bold cosmic-text-gradient mb-2">
                  {isEditing && editedClient ? (
                    <input
                      type="text"
                      value={editedClient.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="bg-transparent text-center border-b border-yellow-400/50 focus:border-yellow-400 outline-none"
                    />
                  ) : (
                    selectedClient.name
                  )}
                </h2>
                <p className="text-gray-400">
                  {isEditing && editedClient ? (
                    <input
                      type="text"
                      value={editedClient.company}
                      onChange={(e) => handleFieldChange('company', e.target.value)}
                      className="bg-transparent text-center border-b border-gray-600 focus:border-yellow-400 outline-none"
                    />
                  ) : (
                    selectedClient.company
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    {isEditing && editedClient ? (
                      <input
                        type="email"
                        value={editedClient.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                      />
                    ) : (
                      <p className="text-white">{selectedClient.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    {isEditing && editedClient ? (
                      <input
                        type="tel"
                        value={editedClient.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                      />
                    ) : (
                      <p className="text-white">{selectedClient.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Industry</p>
                    {isEditing && editedClient ? (
                      <input
                        type="text"
                        value={editedClient.industry}
                        onChange={(e) => handleFieldChange('industry', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                      />
                    ) : (
                      <p className="text-white">{selectedClient.industry}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monthly Amount</p>
                    {isEditing && editedClient ? (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-400 mr-1">$</span>
                        <input
                          type="number"
                          value={editedClient.monthlyAmount}
                          onChange={(e) => handleFieldChange('monthlyAmount', parseFloat(e.target.value) || 0)}
                          className="text-2xl font-bold bg-transparent border-b-2 border-yellow-400/50 focus:border-yellow-400 outline-none cosmic-text-gradient"
                          style={{ width: `${editedClient.monthlyAmount.toString().length + 2}ch` }}
                        />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold cosmic-text-gradient">
                        ${selectedClient.monthlyAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                    {isEditing && editedClient ? (
                      <div className="flex items-center">
                        <span className="text-white mr-1">$</span>
                        <input
                          type="number"
                          value={editedClient.totalSpent}
                          onChange={(e) => handleFieldChange('totalSpent', parseFloat(e.target.value) || 0)}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        />
                      </div>
                    ) : (
                      <p className="text-white">${selectedClient.totalSpent.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {isEditing && editedClient ? (
                      <select
                        value={editedClient.status}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                      >
                        <option value="active" className="bg-gray-900">Active</option>
                        <option value="pending" className="bg-gray-900">Pending</option>
                        <option value="inactive" className="bg-gray-900">Inactive</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedClient.status === 'active' 
                          ? 'bg-green-400/20 text-green-400' 
                          : 'bg-orange-400/20 text-orange-400'
                      }`}>
                        {selectedClient.status}
                      </span>
                    )}
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

              {isEditing && (
                <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                  <p className="text-sm text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Editing client information. Click save to apply changes or cancel to discard.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddModalOpen(false);
              setNewClient({ status: 'pending', monthlyAmount: 0, totalSpent: 0 });
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full cosmic-card rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewClient({ status: 'pending', monthlyAmount: 0, totalSpent: 0 });
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-3xl font-bold cosmic-text-gradient mb-6">Add New Client</h2>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newClient.name || ''}
                        onChange={(e) => handleNewClientFieldChange('name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="Client Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email *</label>
                      <input
                        type="email"
                        value={newClient.email || ''}
                        onChange={(e) => handleNewClientFieldChange('email', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newClient.phone || ''}
                        onChange={(e) => handleNewClientFieldChange('phone', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Company *</label>
                      <input
                        type="text"
                        value={newClient.company || ''}
                        onChange={(e) => handleNewClientFieldChange('company', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Industry</label>
                      <input
                        type="text"
                        value={newClient.industry || ''}
                        onChange={(e) => handleNewClientFieldChange('industry', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="e.g., Technology, Healthcare, Retail"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Amount ($)</label>
                      <input
                        type="number"
                        value={newClient.monthlyAmount || 0}
                        onChange={(e) => handleNewClientFieldChange('monthlyAmount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Status</label>
                      <select
                        value={newClient.status || 'pending'}
                        onChange={(e) => handleNewClientFieldChange('status', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                      >
                        <option value="pending" className="bg-gray-900">Pending</option>
                        <option value="active" className="bg-gray-900">Active</option>
                        <option value="inactive" className="bg-gray-900">Inactive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Subscription Plan</label>
                      <input
                        type="text"
                        value={newClient.subscriptionPlan || ''}
                        onChange={(e) => handleNewClientFieldChange('subscriptionPlan', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-yellow-400/50 outline-none"
                        placeholder="e.g., Premium AI Infrastructure"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setNewClient({ status: 'pending', monthlyAmount: 0, totalSpent: 0 });
                    }}
                    className="px-6 py-2 rounded-full border border-white/20 text-gray-400 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddClient}
                    disabled={isSaving}
                    className="cosmic-glow px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Adding...' : 'Add Client'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};