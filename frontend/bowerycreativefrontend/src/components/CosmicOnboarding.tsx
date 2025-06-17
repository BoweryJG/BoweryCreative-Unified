import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Rocket, Sparkles,
  Globe, 
  Instagram, Facebook, Twitter, Linkedin,
  Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CosmicOnboardingProps {
  onClose: () => void;
}

interface FormData {
  // Step 1 - Basic Info
  firstName: string;
  lastName: string;
  practiceName: string;
  practiceType: string;
  
  // Step 2 - Contact Details
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 3 - Digital Presence (Optional)
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  
  // Step 4 - Preferences
  marketingGoals: string[];
  monthlyBudget: string;
  startDate: string;
  additionalNotes: string;
  promoCode: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  practiceName: '',
  practiceType: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  website: '',
  instagram: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  marketingGoals: [],
  monthlyBudget: '',
  startDate: '',
  additionalNotes: '',
  promoCode: ''
};

export const CosmicOnboarding: React.FC<CosmicOnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const totalSteps = 5;

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('cosmicOnboardingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('cosmicOnboardingData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.practiceName) newErrors.practiceName = 'Practice name is required';
        if (!formData.practiceType) newErrors.practiceType = 'Practice type is required';
        break;
      case 2:
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // First validate the access code if provided
      let clientData = null;
      if (formData.promoCode) {
        const { data, error } = await supabase.rpc('use_access_code', {
          p_access_code: formData.promoCode,
          p_user_email: formData.email
        });

        if (error || !data?.[0]?.success) {
          setErrors({ promoCode: 'Invalid access code' });
          setIsSubmitting(false);
          return;
        }

        clientData = data[0].client_data;
      }

      // Save to Supabase
      const { error } = await supabase
        .from('onboarding_submissions')
        .insert([{
          user_id: user?.id,
          form_data: formData,
          client_account_id: clientData?.id,
          completed_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem('cosmicOnboardingData');
      
      // Prepare welcome data with client info
      const welcomeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        practiceName: formData.practiceName,
        email: formData.email,
        promoCode: formData.promoCode,
        clientData: clientData // Include pricing and package info
      };
      
      // Store data for welcome page
      localStorage.setItem('welcomeData', JSON.stringify(welcomeData));
      
      // Redirect to welcome page
      window.location.href = '/welcome';
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Welcome to Your Creative Journey! 🚀</h2>
              <p className="text-gray-400 text-sm sm:text-base">Let's start with the basics</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Practice Name *</label>
              <input
                type="text"
                value={formData.practiceName}
                onChange={(e) => handleInputChange('practiceName', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                placeholder="Aesthetic Excellence Center"
              />
              {errors.practiceName && <p className="text-red-400 text-xs">{errors.practiceName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Practice Type *</label>
              <select
                value={formData.practiceType}
                onChange={(e) => handleInputChange('practiceType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              >
                <option value="">Select your practice type</option>
                <option value="medical-spa">Medical Spa</option>
                <option value="dermatology">Dermatology</option>
                <option value="plastic-surgery">Plastic Surgery</option>
                <option value="dental">Dental/Orthodontics</option>
                <option value="wellness">Wellness Center</option>
                <option value="other">Other</option>
              </select>
              {errors.practiceType && <p className="text-red-400 text-xs">{errors.practiceType}</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Contact Information 📍</h2>
              <p className="text-gray-400">How can we reach you?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="New York"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="NY"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="10001"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Digital Presence 🌐</h2>
              <p className="text-gray-400">The more we know, the better we can serve you!</p>
              <p className="text-sm text-yellow-400 mt-2">All fields are optional</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                  placeholder="https://yourpractice.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Instagram className="w-4 h-4" /> Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                    placeholder="@yourpractice"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Facebook className="w-4 h-4" /> Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                    placeholder="facebook.com/yourpractice"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Twitter className="w-4 h-4" /> Twitter/X
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                    placeholder="@yourpractice"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm sm:text-base"
                    placeholder="linkedin.com/company/yourpractice"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-yellow-400 mb-1">Pro Tip:</p>
                <p>Providing your social media accounts helps us create cohesive marketing campaigns across all platforms!</p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Your Marketing Goals 🎯</h2>
              <p className="text-gray-400 text-sm sm:text-base">What would you like to achieve?</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300">Select all that apply:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  'Increase Patient Volume',
                  'Build Brand Awareness',
                  'Launch New Services',
                  'Improve Online Reputation',
                  'Social Media Growth',
                  'Website Redesign',
                  'SEO Optimization',
                  'Paid Advertising'
                ].map((goal) => (
                  <label key={goal} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.marketingGoals.includes(goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('marketingGoals', [...formData.marketingGoals, goal]);
                        } else {
                          handleInputChange('marketingGoals', formData.marketingGoals.filter(g => g !== goal));
                        }
                      }}
                      className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                    />
                    <span className="text-xs sm:text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Monthly Marketing Budget</label>
              <select
                value={formData.monthlyBudget}
                onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              >
                <option value="">Select budget range</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000+">$10,000+</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">When would you like to start?</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Special Pricing Code (if you have one)</label>
              <input
                type="text"
                value={formData.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all uppercase"
                placeholder="Enter code (e.g., PEDRO)"
              />
              <p className="text-xs text-gray-400">If you've been given a special pricing code, enter it here</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all h-24 resize-none"
                placeholder="Tell us more about your vision..."
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"
              />
              <Rocket className="w-24 h-24 mx-auto text-yellow-400 relative z-10" />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Ready for Liftoff! 🚀
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Your creative journey begins now
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">What happens next:</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Set up your secure payment method</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Choose your service package</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Get instant access to your dashboard</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl my-auto bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] rounded-lg sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Cosmic background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-30" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Bowery Creative</h1>
                <p className="text-xs sm:text-sm text-gray-400">Ignite Your Practice</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs sm:text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 md:px-6 sm:py-2.5 md:py-3 rounded-lg transition-all text-sm sm:text-base ${
                currentStep === 1
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 md:px-6 sm:py-2.5 md:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Next
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 md:px-8 sm:py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition-all transform hover:scale-105 cosmic-glow text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Launch Payment Portal</span>
                    <span className="sm:hidden">Launch</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
      
      <style>{`
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, #fff, transparent),
            radial-gradient(1px 1px at 90px 40px, #eee, transparent),
            radial-gradient(1px 1px at 130px 80px, #fff, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: stars-move 10s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes stars-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100px); }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </motion.div>
  );
};