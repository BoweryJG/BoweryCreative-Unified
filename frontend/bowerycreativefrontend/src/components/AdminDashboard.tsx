import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  Search,
  MoreHorizontal,
  Eye,
  Edit
} from 'lucide-react';
import type { Contact, Project, ProjectStatus } from '../lib/supabase';
import { contactsAPI, analyticsAPI } from '../services/api';

interface DashboardStats {
  totalContacts: number;
  activeProjects: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgProjectValue: number;
  pendingPayments: number;
}

interface ContactWithProject extends Contact {
  projects?: Project[];
  latest_project?: Project;
}

export const AdminDashboard: React.FC = () => {
  const [contacts, setContacts] = useState<ContactWithProject[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgProjectValue: 0,
    pendingPayments: 0
  });
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadContacts(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      // Get all contacts via API
      const allContacts = await contactsAPI.getAll();
      
      // For now, we'll simulate the project relationship
      // In a real implementation, the API would include project data
      const processedContacts = allContacts.map(contact => ({
        ...contact,
        projects: [],
        latest_project: undefined
      }));

      setContacts(processedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Get dashboard metrics from API
      const metrics = await analyticsAPI.getDashboardMetrics();
      
      setStats({
        totalContacts: metrics.totalContacts,
        activeProjects: metrics.activeProjects,
        monthlyRevenue: metrics.revenue.monthly,
        conversionRate: metrics.conversionRate,
        avgProjectValue: metrics.averageProjectValue,
        pendingPayments: 3 // This would come from the API
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default values if API fails
      setStats({
        totalContacts: 0,
        activeProjects: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        avgProjectValue: 0,
        pendingPayments: 0
      });
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });


  const getStatusBadge = (status: ProjectStatus) => {
    const badges = {
      lead: 'bg-blue-500/20 text-blue-300',
      qualified: 'bg-yellow-500/20 text-yellow-300',
      proposal_sent: 'bg-purple-500/20 text-purple-300',
      contract_signed: 'bg-green-500/20 text-green-300',
      in_progress: 'bg-electric/20 text-electric',
      completed: 'bg-champagne/20 text-champagne',
      cancelled: 'bg-red-500/20 text-red-300'
    };
    return badges[status] || 'bg-racing-silver/20 text-racing-silver';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ComponentType<any>;
    color?: string;
  }> = ({ title, value, change, icon: Icon, color = 'text-champagne' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${color.replace('text-', '')}/20 to-${color.replace('text-', '')}/5 flex items-center justify-center`}>
          <Icon size={24} className={color} />
        </div>
        {change && (
          <span className="text-sm text-electric">
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-arctic mb-1">{value}</div>
      <div className="text-sm text-racing-silver">{title}</div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-arctic">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-arctic">
      {/* Header */}
      <div className="border-b border-graphite">
        <div className="container-luxury py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display text-arctic mb-2">Admin Dashboard</h1>
              <p className="text-racing-silver">Manage your client pipeline and projects</p>
            </div>
            <div className="flex gap-4">
              <button className="btn-ghost">
                <FileText size={20} className="mr-2" />
                Export Data
              </button>
              <button className="btn-performance">
                <Users size={20} className="mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxury py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            change="+12%"
            icon={Users}
            color="text-electric"
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            change="+5%"
            icon={TrendingUp}
            color="text-champagne"
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            change="+23%"
            icon={DollarSign}
            color="text-green-400"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change="+2.1%"
            icon={TrendingUp}
            color="text-purple-400"
          />
          <StatCard
            title="Avg Project Value"
            value={formatCurrency(stats.avgProjectValue)}
            change="+8%"
            icon={DollarSign}
            color="text-blue-400"
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={AlertCircle}
            color="text-yellow-400"
          />
        </div>

        {/* Filters and Search */}
        <div className="glass-morphism p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-racing-silver" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-carbon border border-racing-silver rounded-lg text-arctic placeholder-racing-silver focus:border-champagne outline-none"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | 'all')}
                className="px-4 py-2 bg-carbon border border-racing-silver rounded-lg text-arctic focus:border-champagne outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="lead">Leads</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="contract_signed">Contract Signed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-2 text-sm text-racing-silver">
              <span>Showing {filteredContacts.length} of {contacts.length} contacts</span>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="glass-morphism overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-graphite">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Contact</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Project</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Status</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Budget</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Timeline</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Last Contact</th>
                  <th className="text-left p-4 text-xs uppercase tracking-wide text-champagne">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-graphite/50 hover:bg-carbon/20 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-arctic">{contact.name}</div>
                        <div className="text-sm text-racing-silver">{contact.email}</div>
                        {contact.company && (
                          <div className="text-xs text-racing-silver">{contact.company}</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div>
                        <div className="text-arctic">{contact.project_type || 'Not specified'}</div>
                        {contact.latest_project && (
                          <div className="text-sm text-racing-silver">
                            {contact.latest_project.name}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status || 'lead')}`}>
                        {contact.status?.replace('_', ' ').toUpperCase() || 'LEAD'}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-arctic">
                        {contact.budget_range || 'Not specified'}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-arctic">
                        {contact.timeline || 'Flexible'}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm text-racing-silver">
                        {contact.last_contacted 
                          ? new Date(contact.last_contacted).toLocaleDateString()
                          : new Date(contact.created_at!).toLocaleDateString()
                        }
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-carbon rounded-lg transition-colors">
                          <Eye size={16} className="text-racing-silver hover:text-champagne" />
                        </button>
                        <button className="p-2 hover:bg-carbon rounded-lg transition-colors">
                          <Edit size={16} className="text-racing-silver hover:text-champagne" />
                        </button>
                        <button className="p-2 hover:bg-carbon rounded-lg transition-colors">
                          <Edit size={16} className="text-racing-silver hover:text-champagne" />
                        </button>
                        <button className="p-2 hover:bg-carbon rounded-lg transition-colors">
                          <MoreHorizontal size={16} className="text-racing-silver hover:text-champagne" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-racing-silver mb-4" />
            <h3 className="text-xl text-arctic mb-2">No contacts found</h3>
            <p className="text-racing-silver">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first contact'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};