import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FileText, 
  CreditCard, 
  Users, 
  Rocket,
  DollarSign,
  Shield
} from 'lucide-react';
import type { Contact, Project } from '../lib/supabase';
import { contactsAPI, onboardingAPI, servicesAPI } from '../services/api';

interface OnboardingFlowProps {
  contactId: string;
  onComplete?: () => void;
}

interface StepData {
  contact?: Partial<Contact>;
  project?: Partial<Project>;
  selectedPackages?: string[];
  customRequirements?: string;
  paymentInfo?: {
    method: string;
    terms: string;
  };
  meetingPreferences?: {
    date: string;
    time: string;
    timezone: string;
  };
}

const ONBOARDING_STEPS = [
  {
    id: 'qualification',
    title: 'Project Qualification',
    subtitle: 'Let\'s understand your vision',
    icon: FileText,
    description: 'Detailed project requirements and technical specifications'
  },
  {
    id: 'packages',
    title: 'Service Selection',
    subtitle: 'Choose your perfect solution',
    icon: Users,
    description: 'Select from our curated service packages'
  },
  {
    id: 'proposal',
    title: 'Proposal Review',
    subtitle: 'Your custom solution',
    icon: DollarSign,
    description: 'Review scope, timeline, and investment details'
  },
  {
    id: 'contract',
    title: 'Agreement',
    subtitle: 'Secure your partnership',
    icon: Shield,
    description: 'Digital contract signing and legal agreements'
  },
  {
    id: 'payment',
    title: 'Payment Setup',
    subtitle: 'Investment & billing',
    icon: CreditCard,
    description: 'Payment processing and billing preferences'
  },
  {
    id: 'kickoff',
    title: 'Project Kickoff',
    subtitle: 'Ready to launch',
    icon: Rocket,
    description: 'Schedule kickoff and access your client portal'
  }
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ contactId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<StepData>({});
  const [isLoading] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [servicePackages, setServicePackages] = useState<any[]>([]);

  useEffect(() => {
    loadContactData();
    loadServicePackages();
  }, [contactId]);

  const loadContactData = async () => {
    try {
      const data = await contactsAPI.getById(contactId);
      setContact(data);
    } catch (error) {
      console.error('Error loading contact:', error);
    }
  };

  const loadServicePackages = async () => {
    try {
      const packages = await servicesAPI.getPackages();
      setServicePackages(packages || []);
    } catch (error) {
      console.error('Error loading service packages:', error);
    }
  };

  const updateStepData = (step: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [step]: { ...(prev[step as keyof StepData] as any), ...data }
    }));
  };

  const saveStepProgress = async (stepIndex: number, status: 'completed' | 'in_progress') => {
    try {
      const step = ONBOARDING_STEPS[stepIndex];
      
      // Get current onboarding steps
      const steps = await onboardingAPI.getSteps(contactId);
      const currentStep = steps.find(s => s.step_name === step.id);
      
      if (currentStep?.id) {
        if (status === 'completed') {
          await onboardingAPI.completeStep(currentStep.id, stepData);
        } else {
          // Update step to in_progress via API if needed
          console.log('Step in progress:', step.id);
        }
      }
    } catch (error) {
      console.error('Error saving step progress:', error);
    }
  };

  const nextStep = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      await saveStepProgress(currentStep, 'completed');
      setCurrentStep(currentStep + 1);
      await saveStepProgress(currentStep + 1, 'in_progress');
    } else {
      await saveStepProgress(currentStep, 'completed');
      onComplete?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.id) {
      case 'qualification':
        return <QualificationStep 
          data={stepData.project} 
          onChange={(data) => updateStepData('project', data)} 
          contact={contact}
        />;
      
      case 'packages':
        return <PackageSelectionStep 
          packages={servicePackages}
          selected={stepData.selectedPackages || []}
          onChange={(packages) => updateStepData('selectedPackages', packages)}
          onCustomRequirements={(req) => updateStepData('customRequirements', req)}
        />;
      
      case 'proposal':
        return <ProposalReviewStep 
          project={stepData.project}
          packages={stepData.selectedPackages}
          servicePackages={servicePackages}
          customRequirements={stepData.customRequirements}
        />;
      
      case 'contract':
        return <ContractStep 
          contact={contact}
          project={stepData.project}
        />;
      
      case 'payment':
        return <PaymentSetupStep 
          data={stepData.paymentInfo}
          onChange={(data) => updateStepData('paymentInfo', data)}
        />;
      
      case 'kickoff':
        return <KickoffSchedulingStep 
          data={stepData.meetingPreferences}
          onChange={(data) => updateStepData('meetingPreferences', data)}
          contact={contact}
        />;
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    switch (step.id) {
      case 'qualification':
        return stepData.project?.name && stepData.project?.description;
      case 'packages':
        return stepData.selectedPackages && stepData.selectedPackages.length > 0;
      case 'proposal':
        return true; // Always can proceed from proposal review
      case 'contract':
        return true; // Will be validated by actual contract signing
      case 'payment':
        return stepData.paymentInfo?.method;
      case 'kickoff':
        return stepData.meetingPreferences?.date;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-arctic">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-carbon/90 backdrop-blur-lg border-b border-graphite">
        <div className="container-luxury py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-display text-arctic">Client Onboarding</h1>
            <span className="text-sm text-racing-silver">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono
                  ${index < currentStep ? 'bg-champagne text-obsidian' : 
                    index === currentStep ? 'bg-electric text-obsidian' : 'bg-graphite text-racing-silver'}
                `}>
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className={`w-12 h-px ${
                    index < currentStep ? 'bg-champagne' : 'bg-graphite'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-16">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            {/* Step Header */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-champagne flex items-center justify-center">
                {React.createElement(ONBOARDING_STEPS[currentStep].icon, {
                  size: 24,
                  className: "text-champagne"
                })}
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl mb-4">
                {ONBOARDING_STEPS[currentStep].title}
              </h2>
              
              <p className="text-xl text-titanium mb-2">
                {ONBOARDING_STEPS[currentStep].subtitle}
              </p>
              
              <p className="text-racing-silver">
                {ONBOARDING_STEPS[currentStep].description}
              </p>
            </motion.div>

            {/* Step Content */}
            <motion.div
              key={`content-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-morphism p-8 md:p-12 mb-8"
            >
              {renderStepContent()}
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="mr-2" />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed() || isLoading}
                className="btn-performance disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const QualificationStep: React.FC<{
  data?: any;
  onChange: (data: any) => void;
  contact: Contact | null;
}> = ({ data = {}, onChange, contact }) => {
  const [formData, setFormData] = useState({
    name: data.name || `${contact?.name || 'Untitled'} Project`,
    description: data.description || '',
    scope_of_work: data.scope_of_work || '',
    technical_requirements: data.technical_requirements || {},
    complexity: data.complexity || 'medium',
    priority: data.priority || 'medium',
    ...data
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
          Project Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
          placeholder="Enter your project name"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
          Project Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none resize-none text-arctic"
          placeholder="Describe your project goals, objectives, and vision..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
            Complexity Level
          </label>
          <select
            value={formData.complexity}
            onChange={(e) => handleChange('complexity', e.target.value)}
            className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
          >
            <option value="simple" className="bg-carbon text-arctic">Simple - Basic implementation</option>
            <option value="medium" className="bg-carbon text-arctic">Medium - Standard features</option>
            <option value="complex" className="bg-carbon text-arctic">Complex - Advanced requirements</option>
            <option value="enterprise" className="bg-carbon text-arctic">Enterprise - Mission critical</option>
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
            Business Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
          >
            <option value="low" className="bg-carbon text-arctic">Low - Nice to have</option>
            <option value="medium" className="bg-carbon text-arctic">Medium - Important</option>
            <option value="high" className="bg-carbon text-arctic">High - Critical</option>
            <option value="urgent" className="bg-carbon text-arctic">Urgent - Blocking other work</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
          Technical Requirements & Constraints
        </label>
        <textarea
          value={formData.scope_of_work}
          onChange={(e) => handleChange('scope_of_work', e.target.value)}
          rows={6}
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none resize-none text-arctic"
          placeholder="Detail any specific technical requirements, integrations, performance needs, security requirements, or constraints we should know about..."
        />
      </div>
    </div>
  );
};

const PackageSelectionStep: React.FC<{
  packages: any[];
  selected: string[];
  onChange: (packages: string[]) => void;
  onCustomRequirements: (req: string) => void;
}> = ({ packages, selected, onChange, onCustomRequirements }) => {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(selected || []);
  const [customReqs, setCustomReqs] = useState('');

  useEffect(() => {
    onChange(selectedPackages);
  }, [selectedPackages, onChange]);

  useEffect(() => {
    onCustomRequirements(customReqs);
  }, [customReqs, onCustomRequirements]);

  const togglePackage = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {packages.map((pkg: any) => (
          <div
            key={pkg.id}
            onClick={() => togglePackage(pkg.id)}
            className={`
              p-6 border cursor-pointer transition-all duration-300
              ${selectedPackages.includes(pkg.id) 
                ? 'border-champagne bg-champagne/5' 
                : 'border-racing-silver hover:border-champagne/50'
              }
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-display text-arctic mb-2">{pkg.name}</h3>
                <p className="text-racing-silver">{pkg.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-champagne">
                  {formatPrice(pkg.base_price)}
                </div>
                <div className="text-sm text-racing-silver">
                  {pkg.estimated_duration_days} days
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-champagne mb-2 font-mono uppercase tracking-wide">Features</h4>
                <ul className="space-y-1">
                  {pkg.features?.map((feature: string, index: number) => (
                    <li key={index} className="text-sm text-titanium flex items-center">
                      <Check size={14} className="text-electric mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm text-champagne mb-2 font-mono uppercase tracking-wide">Deliverables</h4>
                <ul className="space-y-1">
                  {pkg.deliverables?.map((deliverable: string, index: number) => (
                    <li key={index} className="text-sm text-titanium flex items-center">
                      <FileText size={14} className="text-electric mr-2 flex-shrink-0" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
          Additional Requirements
        </label>
        <textarea
          value={customReqs}
          onChange={(e) => setCustomReqs(e.target.value)}
          rows={4}
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none resize-none text-arctic"
          placeholder="Any additional services, customizations, or specific requirements not covered by the packages above..."
        />
      </div>
    </div>
  );
};

const ProposalReviewStep: React.FC<{
  project?: any;
  packages?: string[];
  servicePackages: any[];
  customRequirements?: string;
}> = ({ project, packages, servicePackages, customRequirements }) => {
  const selectedPackageDetails = servicePackages.filter((pkg: any) => packages?.includes(pkg.id));
  const totalInvestment = selectedPackageDetails.reduce((sum: number, pkg: any) => sum + (pkg.base_price || 0), 0);
  const totalDuration = Math.max(...selectedPackageDetails.map((pkg: any) => pkg.estimated_duration_days || 0));

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border border-racing-silver">
          <div className="text-3xl font-bold text-champagne mb-2">
            ${totalInvestment.toLocaleString()}
          </div>
          <div className="text-sm text-racing-silver">Total Investment</div>
        </div>
        
        <div className="p-6 border border-racing-silver">
          <div className="text-3xl font-bold text-electric mb-2">
            {totalDuration}
          </div>
          <div className="text-sm text-racing-silver">Days to Complete</div>
        </div>
        
        <div className="p-6 border border-racing-silver">
          <div className="text-3xl font-bold text-arctic mb-2">
            {selectedPackageDetails.length}
          </div>
          <div className="text-sm text-racing-silver">Service Packages</div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display text-arctic mb-4">Project Overview</h3>
        <div className="p-6 border border-racing-silver">
          <h4 className="text-champagne mb-2">{project?.name}</h4>
          <p className="text-titanium">{project?.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display text-arctic mb-4">Selected Services</h3>
        <div className="space-y-4">
          {selectedPackageDetails.map((pkg: any) => (
            <div key={pkg.id} className="p-6 border border-racing-silver">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-champagne mb-2">{pkg.name}</h4>
                  <p className="text-titanium">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-champagne">
                    ${pkg.base_price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-racing-silver">
                    {pkg.estimated_duration_days} days
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {customRequirements && (
        <div>
          <h3 className="text-xl font-display text-arctic mb-4">Custom Requirements</h3>
          <div className="p-6 border border-racing-silver">
            <p className="text-titanium">{customRequirements}</p>
          </div>
        </div>
      )}

      <div className="p-6 border border-champagne bg-champagne/5">
        <h3 className="text-xl font-display text-arctic mb-4">Next Steps</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Review and approve this proposal
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Sign the service agreement
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Set up payment and billing
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Schedule project kickoff meeting
          </li>
        </ul>
      </div>
    </div>
  );
};

const ContractStep: React.FC<{
  contact: Contact | null;
  project?: any;
}> = ({ contact, project }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border border-champagne flex items-center justify-center">
          <Shield size={24} className="text-champagne" />
        </div>
        <h3 className="text-2xl font-display text-arctic mb-4">Service Agreement Ready</h3>
        <p className="text-titanium">
          Your customized service agreement has been prepared and is ready for digital signature.
        </p>
      </div>

      <div className="p-6 border border-racing-silver">
        <h4 className="text-champagne mb-4">Contract Summary</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-racing-silver">Client:</span> {contact?.name}
          </div>
          <div>
            <span className="text-racing-silver">Company:</span> {contact?.company || 'Individual'}
          </div>
          <div>
            <span className="text-racing-silver">Project:</span> {project?.name}
          </div>
          <div>
            <span className="text-racing-silver">Status:</span> <span className="text-electric">Ready for Signature</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-racing-silver flex items-center justify-between">
          <div>
            <h5 className="text-arctic mb-1">Service Agreement</h5>
            <p className="text-sm text-racing-silver">Standard terms and conditions</p>
          </div>
          <button className="btn-ghost">
            <FileText size={16} className="mr-2" />
            Review Document
          </button>
        </div>

        <div className="p-4 border border-racing-silver flex items-center justify-between">
          <div>
            <h5 className="text-arctic mb-1">Project Scope Document</h5>
            <p className="text-sm text-racing-silver">Detailed deliverables and timeline</p>
          </div>
          <button className="btn-ghost">
            <FileText size={16} className="mr-2" />
            Review Document
          </button>
        </div>
      </div>

      <div className="text-center">
        <button className="btn-performance">
          <Shield size={20} className="mr-2" />
          Sign with DocuSign
        </button>
        <p className="text-xs text-racing-silver mt-2">
          Secure digital signature powered by DocuSign
        </p>
      </div>
    </div>
  );
};

const PaymentSetupStep: React.FC<{
  data?: any;
  onChange: (data: any) => void;
}> = ({ data = {}, onChange }) => {
  const [paymentData, setPaymentData] = useState({
    method: data.method || '',
    terms: data.terms || 'net30',
    billing_email: data.billing_email || '',
    ...data
  });

  useEffect(() => {
    onChange(paymentData);
  }, [paymentData, onChange]);

  const handleChange = (field: string, value: any) => {
    setPaymentData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-display text-arctic mb-6">Payment Method</h3>
        <div className="grid gap-4">
          {[
            { id: 'card', label: 'Credit/Debit Card', desc: 'Secure payment via Stripe' },
            { id: 'ach', label: 'Bank Transfer (ACH)', desc: 'Direct bank transfer' },
            { id: 'wire', label: 'Wire Transfer', desc: 'International wire transfer' },
            { id: 'check', label: 'Check', desc: 'Traditional check payment' }
          ].map((method) => (
            <div
              key={method.id}
              onClick={() => handleChange('method', method.id)}
              className={`
                p-4 border cursor-pointer transition-all duration-300
                ${paymentData.method === method.id 
                  ? 'border-champagne bg-champagne/5' 
                  : 'border-racing-silver hover:border-champagne/50'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-arctic mb-1">{method.label}</h4>
                  <p className="text-sm text-racing-silver">{method.desc}</p>
                </div>
                <div className={`
                  w-4 h-4 rounded-full border-2 
                  ${paymentData.method === method.id 
                    ? 'border-champagne bg-champagne' 
                    : 'border-racing-silver'
                  }
                `} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display text-arctic mb-6">Payment Terms</h3>
        <select
          value={paymentData.terms}
          onChange={(e) => handleChange('terms', e.target.value)}
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
        >
          <option value="immediate" className="bg-carbon text-arctic">Immediate - Due upon signature</option>
          <option value="net15" className="bg-carbon text-arctic">Net 15 - Due in 15 days</option>
          <option value="net30" className="bg-carbon text-arctic">Net 30 - Due in 30 days</option>
          <option value="milestone" className="bg-carbon text-arctic">Milestone - Payments tied to deliverables</option>
          <option value="monthly" className="bg-carbon text-arctic">Monthly - Recurring monthly payments</option>
        </select>
      </div>

      <div>
        <h3 className="text-xl font-display text-arctic mb-6">Billing Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
              Billing Email
            </label>
            <input
              type="email"
              value={paymentData.billing_email}
              onChange={(e) => handleChange('billing_email', e.target.value)}
              className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
              placeholder="billing@company.com"
            />
          </div>
        </div>
      </div>

      {paymentData.method === 'card' && (
        <div className="text-center">
          <button className="btn-performance">
            <CreditCard size={20} className="mr-2" />
            Set Up Payment with Stripe
          </button>
          <p className="text-xs text-racing-silver mt-2">
            Secure payment processing powered by Stripe
          </p>
        </div>
      )}
    </div>
  );
};

const KickoffSchedulingStep: React.FC<{
  data?: any;
  onChange: (data: any) => void;
  contact: Contact | null;
}> = ({ data = {}, onChange }) => {
  const [meetingData, setMeetingData] = useState({
    date: data.date || '',
    time: data.time || '',
    timezone: data.timezone || 'America/New_York',
    meeting_type: data.meeting_type || 'video',
    ...data
  });

  useEffect(() => {
    onChange(meetingData);
  }, [meetingData, onChange]);

  const handleChange = (field: string, value: any) => {
    setMeetingData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 border border-champagne flex items-center justify-center">
          <Rocket size={24} className="text-champagne" />
        </div>
        <h3 className="text-2xl font-display text-arctic mb-4">Project Kickoff</h3>
        <p className="text-titanium">
          Let's schedule your project kickoff meeting and set up your client portal access.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-display text-arctic mb-6">Schedule Kickoff Meeting</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
              Preferred Date
            </label>
            <input
              type="date"
              value={meetingData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
              Preferred Time
            </label>
            <select
              value={meetingData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
            >
              <option value="" className="bg-carbon text-arctic">Select time</option>
              <option value="09:00" className="bg-carbon text-arctic">9:00 AM</option>
              <option value="10:00" className="bg-carbon text-arctic">10:00 AM</option>
              <option value="11:00" className="bg-carbon text-arctic">11:00 AM</option>
              <option value="13:00" className="bg-carbon text-arctic">1:00 PM</option>
              <option value="14:00" className="bg-carbon text-arctic">2:00 PM</option>
              <option value="15:00" className="bg-carbon text-arctic">3:00 PM</option>
              <option value="16:00" className="bg-carbon text-arctic">4:00 PM</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">
            Meeting Type
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { id: 'video', label: 'Video Call', desc: 'Zoom/Google Meet' },
              { id: 'phone', label: 'Phone Call', desc: 'Traditional phone call' }
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => handleChange('meeting_type', type.id)}
                className={`
                  p-4 border cursor-pointer transition-all duration-300
                  ${meetingData.meeting_type === type.id 
                    ? 'border-champagne bg-champagne/5' 
                    : 'border-racing-silver hover:border-champagne/50'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-arctic mb-1">{type.label}</h4>
                    <p className="text-sm text-racing-silver">{type.desc}</p>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2 
                    ${meetingData.meeting_type === type.id 
                      ? 'border-champagne bg-champagne' 
                      : 'border-racing-silver'
                    }
                  `} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border border-champagne bg-champagne/5">
        <h3 className="text-xl font-display text-arctic mb-4">What to Expect</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Project goals and timeline review
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Team introductions and roles
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Communication workflow setup
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            Client portal access and training
          </li>
          <li className="flex items-center text-titanium">
            <Check size={16} className="text-electric mr-3" />
            First milestone planning
          </li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-racing-silver mb-4">
          Ready to launch your project? Click complete to finalize everything.
        </p>
        <div className="text-sm text-titanium">
          You'll receive a calendar invite and client portal access within 24 hours.
        </div>
      </div>
    </div>
  );
};