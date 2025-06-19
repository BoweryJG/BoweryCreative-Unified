import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, 
  Copy, 
  Settings,
  Save,
  Plus,
  X,
  Sparkles,
  Users,
  DollarSign,
  Package,
  Send,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/cosmic.css';

interface CampaignCode {
  code: string;
  name: string;
  amount: number;
  description: string;
  features: string[];
  maxUses?: number;
  usedCount?: number;
  expiresAt?: string;
}

export const OnboardingGenerator: React.FC = () => {
  const [campaignCodes, setCampaignCodes] = useState<CampaignCode[]>([
    {
      code: 'PEDRO',
      name: 'Dr. Pedro Medical Practice Special',
      amount: 2000,
      description: 'Professional medical practice marketing package',
      features: ['Custom SEO Strategy', 'Social Media Management', 'Content Creation', 'Monthly Analytics'],
      usedCount: 1
    }
  ]);
  
  const [showNewCodeModal, setShowNewCodeModal] = useState(false);
  const [newCode, setNewCode] = useState<Partial<CampaignCode>>({
    features: []
  });
  
  const [selectedCode, setSelectedCode] = useState<CampaignCode | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('Your exclusive campaign awaits!');

  const baseUrl = window.location.origin;

  const generateOnboardingLink = (code?: string) => {
    if (code) {
      return `${baseUrl}/onboarding?code=${code}`;
    }
    return `${baseUrl}/onboarding`;
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Link copied to clipboard!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    });
  };

  const addFeature = () => {
    setNewCode({
      ...newCode,
      features: [...(newCode.features || []), '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...(newCode.features || [])];
    features[index] = value;
    setNewCode({ ...newCode, features });
  };

  const removeFeature = (index: number) => {
    const features = [...(newCode.features || [])];
    features.splice(index, 1);
    setNewCode({ ...newCode, features });
  };

  const saveNewCode = () => {
    if (newCode.code && newCode.name && newCode.amount) {
      setCampaignCodes([
        ...campaignCodes,
        {
          ...newCode as CampaignCode,
          usedCount: 0
        }
      ]);
      setNewCode({ features: [] });
      setShowNewCodeModal(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-gradient relative overflow-hidden p-4 md:p-8">
      {/* Background Effects */}
      <div className="galaxy-orb" />
      <div className="stars" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold cosmic-text-gradient mb-2">
            Onboarding Link Generator
          </h1>
          <p className="text-gray-400">Create custom campaign links and track conversions</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* General Onboarding Link */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">General Onboarding</h3>
                <p className="text-gray-400 text-sm">Let prospects explore all available packages</p>
              </div>
              <Link2 className="w-8 h-8 text-yellow-400" />
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 mb-4">
              <code className="text-xs text-gray-300 break-all">
                {generateOnboardingLink()}
              </code>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyLink(generateOnboardingLink())}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg border border-yellow-400/50 text-yellow-400"
              >
                <QrCode className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Create Custom Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="cosmic-card rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Campaign Code</h3>
                <p className="text-gray-400 text-sm">Design custom packages with fixed pricing</p>
              </div>
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewCodeModal(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Campaign Code
            </motion.button>
          </motion.div>
        </div>

        {/* Campaign Codes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-yellow-400" />
            Active Campaign Codes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignCodes.map((campaign, index) => (
              <motion.div
                key={campaign.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="cosmic-card rounded-2xl p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-sm font-mono">
                        {campaign.code}
                      </code>
                      <span className="text-2xl font-bold text-green-400">${campaign.amount}</span>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>

                <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>

                <div className="space-y-2 mb-4">
                  {campaign.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {campaign.usedCount !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="w-4 h-4" />
                    Used {campaign.usedCount} times
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCode(campaign);
                      setShowLinkModal(true);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Link
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyLink(generateOnboardingLink(campaign.code))}
                    className="px-3 py-2 rounded-lg border border-yellow-400/50 text-yellow-400"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Campaign Code Modal */}
      <AnimatePresence>
        {showNewCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewCodeModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full cosmic-card rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold cosmic-text-gradient">Create Campaign Code</h2>
                <button
                  onClick={() => setShowNewCodeModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Campaign Code</label>
                    <input
                      type="text"
                      value={newCode.code || ''}
                      onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. MEDICAL2024"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={newCode.amount || ''}
                        onChange={(e) => setNewCode({ ...newCode, amount: parseFloat(e.target.value) })}
                        placeholder="2000"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={newCode.name || ''}
                    onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                    placeholder="e.g. Medical Practice Premium Package"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newCode.description || ''}
                    onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                    placeholder="Describe what this package includes..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm text-gray-400">Features</label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addFeature}
                      className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {newCode.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Feature description"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-400/50 transition-colors"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveNewCode}
                    disabled={!newCode.code || !newCode.name || !newCode.amount}
                    className="flex-1 cosmic-glow px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Create Campaign
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewCodeModal(false)}
                    className="px-6 py-3 rounded-full border border-white/20 text-gray-400 font-semibold hover:bg-white/10"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Link Modal */}
      <AnimatePresence>
        {showLinkModal && selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLinkModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full cosmic-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Send Campaign Link</h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Campaign</label>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-white font-semibold">{selectedCode.name}</p>
                  <p className="text-sm text-gray-400">${selectedCode.amount} - Code: {selectedCode.code}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Link</label>
                <div className="p-3 bg-black/30 rounded-xl">
                  <code className="text-xs text-gray-300 break-all">
                    {generateOnboardingLink(selectedCode.code)}
                  </code>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Custom Message</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    copyLink(generateOnboardingLink(selectedCode.code));
                    setShowLinkModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send SMS
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};