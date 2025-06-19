import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Plus,
  Sparkles,
  Receipt,
  TrendingUp,
  Mail,
  X,
  MessageSquare,
  Phone,
  Edit2,
  Save,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/cosmic.css';

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export const InvoiceManagementCosmic: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsInvoice, setSmsInvoice] = useState<Invoice | null>(null);
  const [smsSending, setSmsSending] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editForm, setEditForm] = useState<Partial<Invoice>>({});

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      
      // Mock data for Dr. Pedro
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          clientName: 'Dr. Greg Pedro',
          clientEmail: 'greg@gregpedromd.com',
          number: 'INV-2024-001',
          date: '2024-01-01',
          dueDate: '2024-01-15',
          amount: 2000,
          status: 'paid',
          items: [
            { description: 'Professional Plan - January 2024', quantity: 1, rate: 2000, amount: 2000 }
          ]
        },
        {
          id: '2',
          clientName: 'Dr. Greg Pedro',
          clientEmail: 'greg@gregpedromd.com',
          number: 'INV-2023-012',
          date: '2023-12-01',
          dueDate: '2023-12-15',
          amount: 2000,
          status: 'paid',
          items: [
            { description: 'Professional Plan - December 2023', quantity: 1, rate: 2000, amount: 2000 }
          ]
        },
        {
          id: '3',
          clientName: 'Sarah Jones',
          clientEmail: 'sarah@example.com',
          number: 'INV-2024-002',
          date: '2024-01-15',
          dueDate: '2024-01-30',
          amount: 5,
          status: 'sent',
          items: [
            { description: 'Test Package - Monthly', quantity: 1, rate: 5, amount: 5 }
          ]
        }
      ];

      // Load additional invoices from database
      const { data: submissions } = await supabase
        .from('onboarding_submissions')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (submissions) {
        submissions.forEach((submission, index) => {
          const date = new Date(submission.created_at);
          const invoice: Invoice = {
            id: `db-${submission.id}`,
            clientName: submission.practice_name || 'Unknown Client',
            clientEmail: submission.email,
            number: `INV-${date.getFullYear()}-${String(index + 3).padStart(3, '0')}`,
            date: date.toISOString().split('T')[0],
            dueDate: new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: submission.form_data?.monthlyBudget || 0,
            status: 'paid',
            items: [
              {
                description: `${submission.form_data?.selectedPackage?.name || 'Custom Package'} - ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
                quantity: 1,
                rate: submission.form_data?.monthlyBudget || 0,
                amount: submission.form_data?.monthlyBudget || 0
              }
            ]
          };
          mockInvoices.push(invoice);
        });
      }

      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-400/20';
      case 'sent': return 'text-blue-400 bg-blue-400/20';
      case 'draft': return 'text-gray-400 bg-gray-400/20';
      case 'overdue': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'sent': return Send;
      case 'draft': return FileText;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const calculateTotalRevenue = () => {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const calculatePendingRevenue = () => {
    return invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getPaymentLink = (invoice: Invoice) => {
    if (invoice.clientName === 'Sarah Jones') {
      return `${window.location.origin}/pay?code=SARAH`;
    } else if (invoice.clientName === 'Dr. Greg Pedro') {
      return `${window.location.origin}/pay?code=PEDRO`;
    } else {
      return `${window.location.origin}/pay?invoice=${invoice.id}&amount=${invoice.amount}`;
    }
  };

  const sendSms = async () => {
    if (!smsInvoice || !smsPhone) return;
    
    setSmsSending(true);
    const paymentLink = getPaymentLink(smsInvoice);
    const message = `Hi ${smsInvoice.clientName}, \n\nYour invoice ${smsInvoice.number} for $${smsInvoice.amount.toFixed(2)} is ready. \n\nPay securely here: ${paymentLink}\n\n- Bowery Creative`;
    
    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-sms', {
        body: {
          to: smsPhone,
          message: message,
          invoiceId: smsInvoice.id
        }
      });

      if (error) throw error;

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = data.status === 'mock_sent' 
        ? 'SMS mock sent (check console)' 
        : 'SMS sent successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
      setShowSmsModal(false);
      setSmsPhone('');
      setSmsInvoice(null);
    } catch (error) {
      console.error('SMS error:', error);
      alert('Failed to send SMS: ' + (error as any).message);
    } finally {
      setSmsSending(false);
    }
  };

  const startEditing = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setEditForm({
      ...invoice,
      items: [...invoice.items]
    });
  };

  const saveEdit = async () => {
    if (!editingInvoice || !editForm) return;

    try {
      // Update local state
      const updatedInvoices = invoices.map(inv => 
        inv.id === editingInvoice.id ? { ...inv, ...editForm } : inv
      );
      setInvoices(updatedInvoices);

      // If it's a database invoice, update in Supabase
      if (editingInvoice.id.startsWith('db-')) {
        const submissionId = editingInvoice.id.replace('db-', '');
        const { error } = await supabase
          .from('onboarding_submissions')
          .update({
            form_data: {
              ...((await supabase.from('onboarding_submissions').select('form_data').eq('id', submissionId).single()).data?.form_data || {}),
              monthlyBudget: editForm.amount
            }
          })
          .eq('id', submissionId);

        if (error) throw error;
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Invoice updated successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      setEditingInvoice(null);
      setEditForm({});
      if (selectedInvoice?.id === editingInvoice.id) {
        setSelectedInvoice({ ...selectedInvoice, ...editForm });
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    }
  };

  const updateEditForm = (field: keyof Invoice, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const updateEditItem = (index: number, field: keyof Invoice['items'][0], value: any) => {
    setEditForm(prev => ({
      ...prev,
      items: prev.items?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const addEditItem = () => {
    setEditForm(prev => ({
      ...prev,
      items: [...(prev.items || []), {
        description: 'New Item',
        quantity: 1,
        rate: 0,
        amount: 0
      }]
    }));
  };

  const removeEditItem = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || []
    }));
  };

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

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="cosmic-text-gradient neon-text">Invoice Management</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Track payments across the cosmos
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Create invoice clicked')}
            className="cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl md:text-3xl font-bold cosmic-text-gradient">
                  ${calculateTotalRevenue().toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">From {invoices.filter(i => i.status === 'paid').length} paid invoices</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending</p>
                <p className="text-2xl md:text-3xl font-bold cosmic-text-gradient">
                  ${calculatePendingRevenue().toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <Clock className="w-10 h-10 text-orange-400 opacity-50" />
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
                <p className="text-gray-400 text-sm mb-1">Total Invoices</p>
                <p className="text-2xl md:text-3xl font-bold cosmic-text-gradient">{invoices.length}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <Receipt className="w-10 h-10 text-yellow-400 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6"
        >
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1 cosmic-card rounded-full">
            {['all', 'paid', 'sent', 'draft', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Invoices Table - Mobile Optimized */}
        <div className="cosmic-card rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Invoice</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Client</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-medium text-white">{invoice.number}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{invoice.clientName}</p>
                        <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-white">${invoice.amount.toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(invoice);
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Download className="w-4 h-4 text-gray-400" />
                          </motion.button>
                          {invoice.status === 'sent' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const paymentLink = getPaymentLink(invoice);
                                  navigator.clipboard.writeText(paymentLink);
                                  alert(`Payment link copied to clipboard:\n${paymentLink}`);
                                }}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Copy payment link"
                              >
                                <Send className="w-4 h-4 text-yellow-400" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSmsInvoice(invoice);
                                  setSmsPhone(invoice.clientName === 'Sarah Jones' ? '+1234567890' : '');
                                  setShowSmsModal(true);
                                }}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Send SMS"
                              >
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {filteredInvoices.map((invoice, index) => {
              const StatusIcon = getStatusIcon(invoice.status);
              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="cosmic-card cosmic-card-hover rounded-xl p-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{invoice.number}</p>
                      <p className="text-sm text-gray-400">{invoice.clientName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold cosmic-text-gradient">${invoice.amount.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(invoice);
                      }}
                      className="flex-1 py-2 rounded-lg bg-gray-400/20 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </motion.button>
                    {invoice.status === 'sent' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSmsInvoice(invoice);
                            setSmsPhone(invoice.clientName === 'Sarah Jones' ? '+1234567890' : '');
                            setShowSmsModal(true);
                          }}
                          className="flex-1 py-2 rounded-lg bg-blue-400/20 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          SMS
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const paymentLink = getPaymentLink(invoice);
                            navigator.clipboard.writeText(paymentLink);
                            const notification = document.createElement('div');
                            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
                            notification.textContent = 'Link copied!';
                            document.body.appendChild(notification);
                            setTimeout(() => notification.remove(), 2000);
                          }}
                          className="flex-1 py-2 rounded-lg bg-yellow-400/20 text-yellow-400 text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Link
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-card rounded-2xl p-12 text-center mt-8"
          >
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No invoices found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log('Create invoice clicked')}
              className="cosmic-glow px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
            >
              Create Your First Invoice
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInvoice(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full cosmic-card rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    startEditing(selectedInvoice);
                    setSelectedInvoice(null);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Edit invoice"
                >
                  <Edit2 className="w-5 h-5 text-yellow-400" />
                </motion.button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold cosmic-text-gradient mb-2">
                  {selectedInvoice.number}
                </h2>
                <p className="text-gray-400">Invoice Details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bill To</p>
                  <p className="text-white font-medium">{selectedInvoice.clientName}</p>
                  <p className="text-gray-400 text-sm">{selectedInvoice.clientEmail}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs text-gray-500 mb-1">Invoice Date</p>
                  <p className="text-white">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-2 mb-1">Due Date</p>
                  <p className="text-white">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="cosmic-card rounded-xl p-4 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-2 text-gray-400 text-sm">Description</th>
                      <th className="text-right pb-2 text-gray-400 text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 text-white">{item.description}</td>
                        <td className="py-2 text-white text-right">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10">
                      <td className="pt-2 font-semibold text-white">Total</td>
                      <td className="pt-2 font-bold text-right cosmic-text-gradient text-xl">
                        ${selectedInvoice.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Link Section for unpaid invoices */}
              {selectedInvoice.status !== 'paid' && (
                <div className="cosmic-card rounded-xl p-4 mb-6 bg-yellow-400/10 border border-yellow-400/30">
                  <p className="text-sm text-yellow-400 mb-2 font-semibold">Payment Link:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-black/30 rounded text-xs text-gray-300 overflow-x-auto">
                      {getPaymentLink(selectedInvoice)}
                    </code>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Send this link to {selectedInvoice.clientName} to collect payment
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {selectedInvoice.status !== 'paid' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const paymentLink = getPaymentLink(selectedInvoice);
                      
                      // Copy to clipboard
                      navigator.clipboard.writeText(paymentLink).then(() => {
                        // Show a better notification
                        const notification = document.createElement('div');
                        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        notification.textContent = 'Payment link copied to clipboard!';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                      });
                    }}
                    className="w-full sm:w-auto cosmic-glow px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Copy Payment Link
                  </motion.button>
                )}
                {selectedInvoice.status !== 'paid' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSmsInvoice(selectedInvoice);
                      setSmsPhone(selectedInvoice.clientName === 'Sarah Jones' ? '+1234567890' : '');
                      setShowSmsModal(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send SMS
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 py-2 rounded-full border border-yellow-400/50 text-yellow-400 font-semibold flex items-center justify-center gap-2 hover:bg-yellow-400/10"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 py-2 rounded-full border border-white/20 text-gray-400 font-semibold flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  <Mail className="w-4 h-4" />
                  Email Invoice
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SMS Modal */}
      <AnimatePresence>
        {showSmsModal && smsInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSmsModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full cosmic-card rounded-2xl p-6 md:p-8"
            >
              <button
                onClick={() => setShowSmsModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold cosmic-text-gradient mb-2 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Send Payment Link via SMS
                </h2>
                <p className="text-gray-400">Send invoice #{smsInvoice.number} to {smsInvoice.clientName}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message Preview</label>
                  <div className="p-4 bg-black/30 rounded-xl text-sm text-gray-300">
                    Hi {smsInvoice.clientName},<br/><br/>
                    Your invoice {smsInvoice.number} for ${smsInvoice.amount.toFixed(2)} is ready.<br/><br/>
                    Pay securely here: {getPaymentLink(smsInvoice).replace(window.location.origin, '[link]')}<br/><br/>
                    - Bowery Creative
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendSms}
                  disabled={!smsPhone || smsSending}
                  className="flex-1 cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {smsSending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send SMS
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSmsModal(false)}
                  className="px-6 py-3 rounded-full border border-white/20 text-gray-400 font-semibold hover:bg-white/10"
                >
                  Cancel
                </motion.button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                {smsInvoice.clientName === 'Sarah Jones' ? 
                  'Test mode: SMS will be mocked (check console)' : 
                  'SMS will be sent via Twilio'
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Invoice Modal */}
      <AnimatePresence>
        {editingInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setEditingInvoice(null);
              setEditForm({});
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full cosmic-card rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold cosmic-text-gradient flex items-center gap-2">
                  <Edit2 className="w-6 h-6" />
                  Edit Invoice
                </h2>
                <button
                  onClick={() => {
                    setEditingInvoice(null);
                    setEditForm({});
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={editForm.number || ''}
                    onChange={(e) => updateEditForm('number', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={editForm.status || 'draft'}
                    onChange={(e) => updateEditForm('status', e.target.value as Invoice['status'])}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={editForm.clientName || ''}
                    onChange={(e) => updateEditForm('clientName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client Email</label>
                  <input
                    type="email"
                    value={editForm.clientEmail || ''}
                    onChange={(e) => updateEditForm('clientEmail', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Invoice Date</label>
                  <input
                    type="date"
                    value={editForm.date || ''}
                    onChange={(e) => updateEditForm('date', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={editForm.dueDate || ''}
                    onChange={(e) => updateEditForm('dueDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Invoice Items</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addEditItem}
                    className="px-4 py-2 rounded-lg bg-yellow-400/20 text-yellow-400 text-sm font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </motion.button>
                </div>
                
                <div className="space-y-3">
                  {editForm.items?.map((item, index) => (
                    <div key={index} className="cosmic-card rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-6">
                          <label className="block text-xs text-gray-400 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description || ''}
                            onChange={(e) => updateEditItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-yellow-400/50 transition-colors text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity || 0}
                            onChange={(e) => {
                              const qty = parseFloat(e.target.value) || 0;
                              updateEditItem(index, 'quantity', qty);
                              updateEditItem(index, 'amount', qty * (item.rate || 0));
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-yellow-400/50 transition-colors text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-400 mb-1">Rate ($)</label>
                          <input
                            type="number"
                            value={item.rate || 0}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value) || 0;
                              updateEditItem(index, 'rate', rate);
                              updateEditItem(index, 'amount', rate * (item.quantity || 0));
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-yellow-400/50 transition-colors text-sm"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-400 mb-1">Amount</label>
                            <div className="px-3 py-2 bg-black/30 rounded-lg text-sm text-white font-semibold">
                              ${item.amount?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeEditItem(index)}
                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 cosmic-card rounded-xl flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold cosmic-text-gradient">
                    ${editForm.items?.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateEditForm('amount', editForm.items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
                    saveEdit();
                  }}
                  className="flex-1 cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingInvoice(null);
                    setEditForm({});
                  }}
                  className="px-6 py-3 rounded-full border border-white/20 text-gray-400 font-semibold hover:bg-white/10"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};