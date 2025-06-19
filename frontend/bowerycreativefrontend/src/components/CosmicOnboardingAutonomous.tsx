import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Rocket, Sparkles,
  Globe, Instagram, Facebook,
  Check, TrendingUp, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const availableCampaigns: Campaign[] = [
  {
    id: 'foundation',
    name: 'Foundation Elite',
    description: 'Premium entry point for ambitious practices',
    price: 4997,
    icon: <Rocket className="w-6 h-6" />,
    features: [
      'Complete brand strategy audit & refinement',
      'AI-powered patient acquisition campaigns',
      'Premium website optimization with conversion tracking',
      'Monthly content creation (4 videos, 12 posts, 2 blogs)',
      'Advanced analytics and ROI reporting',
      'Dedicated senior account manager',
      'Monthly strategy consultation calls'
    ]
  },
  {
    id: 'transformation',
    name: 'Visionary Transformation',
    description: 'Complete practice transformation through AI',
    price: 9950,
    popular: true,
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      'Everything in Foundation Elite',
      'AI-powered patient journey optimization',
      'Advanced funnel development & automation',
      'Premium video production (8 videos/month)',
      'Multi-channel campaign management (Google, Meta, LinkedIn)',
      'Reputation management & review optimization',
      'Bi-weekly strategy sessions with senior team',
      'Custom AI chatbot development',
      'Competitive intelligence reports',
      'Staff training on digital marketing best practices'
    ]
  },
  {
    id: 'dominance',
    name: 'Market Dominance',
    description: 'Industry leadership through innovation',
    price: 19500,
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Everything in Visionary Transformation',
      'Market expansion strategy for new locations',
      'Advanced AI patient prediction modeling',
      'Custom software development for practice optimization',
      'Weekly strategy sessions with C-level team',
      'Dedicated team of 5+ specialists',
      'PR and thought leadership campaigns',
      'Speaking engagement opportunities',
      'Industry conference presence & custom research',
      '24/7 support and emergency response',
      'Quarterly in-person strategy intensives'
    ]
  }
];

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
  
  // Step 4 - Campaign Selection
  selectedCampaign: string;
  customRequirements: string;
  
  // Step 5 - Goals & Timeline
  marketingGoals: string[];
  startDate: string;
  additionalNotes: string;
}

interface CosmicOnboardingProps {
  onClose: () => void;
}

export const CosmicOnboardingAutonomous: React.FC<CosmicOnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
    selectedCampaign: '',
    customRequirements: '',
    marketingGoals: [],
    startDate: '',
    additionalNotes: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 6;

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('autonomousOnboardingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('autonomousOnboardingData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      case 4:
        if (!formData.selectedCampaign) newErrors.selectedCampaign = 'Please select a package';
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
      // Get selected campaign details
      const selectedPackage = availableCampaigns.find(c => c.id === formData.selectedCampaign);
      
      // Store all form data with package info
      const submissionData = {
        ...formData,
        selectedPackage: selectedPackage,
        monthlyBudget: selectedPackage?.price.toString() || '0',
        completedAt: new Date().toISOString()
      };

      // Save to Supabase onboarding_submissions table (same as access code flow)
      const { data: submission, error: submissionError } = await supabase
        .from('onboarding_submissions')
        .insert([{
          form_data: submissionData,
          email: formData.email,
          practice_name: formData.practiceName,
          status: 'pending_payment',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (submissionError) {
        console.error('Error saving submission:', submissionError);
      }

      // Send notification email to admin
      try {
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: 'jgolden@bowerycreativeagency.com',
            subject: 'New Package Selection - Cosmic Onboarding',
            html: `
              <h2>New Practice Selected a Package</h2>
              <p><strong>Practice:</strong> ${formData.practiceName}</p>
              <p><strong>Contact:</strong> ${formData.firstName} ${formData.lastName}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Type:</strong> ${formData.practiceType}</p>
              <p><strong>Selected Package:</strong> ${selectedPackage?.name} - $${selectedPackage?.price}/month</p>
              <p><strong>Marketing Goals:</strong> ${formData.marketingGoals.join(', ')}</p>
              <p><strong>Start Date:</strong> ${formData.startDate}</p>
              <p><strong>Custom Requirements:</strong> ${formData.customRequirements || 'None'}</p>
              <p><strong>Additional Notes:</strong> ${formData.additionalNotes || 'None'}</p>
              <hr>
              <p>This lead is pending payment completion.</p>
            `
          }
        });

        if (emailError) {
          console.error('Error sending notification:', emailError);
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      // Clear localStorage
      localStorage.removeItem('autonomousOnboardingData');
      
      // Prepare data for payment portal
      const paymentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        practiceName: formData.practiceName,
        email: formData.email,
        selectedPackage: selectedPackage,
        formData: submissionData,
        submissionId: submission?.id
      };
      
      // Store data for payment portal
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Build URL with parameters
      const params = new URLSearchParams();
      params.append('amount', selectedPackage?.price.toString() || '0');
      params.append('package', selectedPackage?.name || 'Custom Package');
      if (formData.email) params.append('email', formData.email);
      if (submission?.id) params.append('submissionId', submission.id);
      
      const queryString = params.toString();
      
      // Redirect to internal payment page (same as access code flow)
      console.log('Redirecting to payment page...');
      window.location.href = `/pay${queryString ? `?${queryString}` : ''}`;
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Basic Info (same as before)
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">Welcome to Your Creative Journey! 🚀</h2>
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
        // Contact Details (same as before)
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
        // Digital Presence (same as before)
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
              </div>
            </div>
          </motion.div>
        );

      case 4:
        // NEW: Campaign/Package Selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Marketing Package 📦</h2>
              <p className="text-gray-400">Select the perfect solution for your practice</p>
            </div>
            
            <div className="space-y-4">
              {availableCampaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('selectedCampaign', campaign.id)}
                  className={`relative cursor-pointer rounded-xl p-6 transition-all ${
                    formData.selectedCampaign === campaign.id
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400'
                      : 'bg-white/5 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {campaign.popular && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      formData.selectedCampaign === campaign.id
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {campaign.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{campaign.name}</h3>
                        <div className="text-right">
                          <p className="text-3xl font-bold">${campaign.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-400">/month</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-4">{campaign.description}</p>
                      
                      <ul className="space-y-2">
                        {campaign.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {formData.selectedCampaign === campaign.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {errors.selectedCampaign && (
              <p className="text-red-400 text-center">{errors.selectedCampaign}</p>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Custom Requirements (Optional)</label>
              <textarea
                value={formData.customRequirements}
                onChange={(e) => handleInputChange('customRequirements', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all h-24 resize-none"
                placeholder="Tell us about any specific needs or requirements..."
              />
            </div>
          </motion.div>
        );

      case 5:
        // Marketing Goals
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Marketing Goals 🎯</h2>
              <p className="text-gray-400">What would you like to achieve?</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300">Select all that apply:</label>
              <div className="grid grid-cols-2 gap-3">
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
                  <label key={goal} className="flex items-center gap-3 p-3 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
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
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
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

      case 6:
        // Review & Launch
        const selectedPackage = availableCampaigns.find(c => c.id === formData.selectedCampaign);
        
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
                Your marketing journey begins now
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Your Selection:</h3>
              <div className="text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="font-semibold">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Investment:</span>
                  <span className="font-semibold text-yellow-400">${selectedPackage?.price}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Date:</span>
                  <span className="font-semibold">{formData.startDate || 'Immediately'}</span>
                </div>
              </div>
              
              <div className="my-6 border-t border-white/10"></div>
              
              <h4 className="text-md font-semibold mb-2">What happens next:</h4>
              <ul className="space-y-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Secure payment setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Instant dashboard access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-300">Campaign launch within 48 hours</span>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md sm:max-w-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
      >
        {/* Cosmic background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-4 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-30" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">Bowery Creative</h1>
                <p className="text-xs sm:text-sm text-gray-400">Marketing Excellence</p>
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
          <div className="mb-4 sm:mb-8">
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
          <div className="flex items-center justify-between mt-4 sm:mt-8 gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
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
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition-all transform hover:scale-105 cosmic-glow text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Launch Payment Portal
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