import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';

type LegalDocumentType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  isOpen: boolean;
  documentType: LegalDocumentType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, documentType, onClose }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const renderContent = () => {
    switch (documentType) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-5xl mx-4 my-8 max-h-[90vh] overflow-hidden bg-obsidian border border-graphite rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-carbon/90 backdrop-blur-sm border-b border-graphite p-6 flex justify-between items-center">
              <h2 className="text-xl font-display text-arctic">
                {documentType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-graphite/30 rounded-lg transition-colors text-racing-silver hover:text-arctic"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
              {renderContent()}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-carbon/90 backdrop-blur-sm border-t border-graphite p-6 flex justify-end">
              <button
                onClick={onClose}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};