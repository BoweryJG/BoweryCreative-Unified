import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Hospital
} from 'lucide-react';

interface CapabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  capability: {
    id: string;
    title: string;
    description: string;
    icon: any;
    gradient: string;
    features?: string[];
  } | null;
}

// Medical/Dental/Aesthetics specific content for each capability
const capabilityDetails = {
  'ai-infrastructure': {
    title: 'AI Infrastructure for Healthcare',
    subtitle: 'HIPAA-Compliant Neural Networks at Scale',
    quickFacts: [
      'FDA-cleared AI algorithms for medical imaging',
      'Real-time patient data processing with <50ms latency',
      'Edge computing for surgical robotics',
      'Federated learning for multi-practice networks'
    ],
    detailedContent: {
      overview: 'Transform your medical practice with enterprise-grade AI infrastructure designed specifically for healthcare compliance and performance. Our systems power everything from diagnostic imaging to predictive patient outcomes.',
      keyFeatures: [
        {
          title: 'Medical-Grade Processing',
          description: 'GPU-accelerated inference for real-time surgical guidance and 3D reconstruction. Powers systems like Neocis Yomi for robotic dental surgery.',
          metrics: ['99.97% uptime', '0.3ms response', 'HIPAA certified']
        },
        {
          title: 'Diagnostic AI Pipeline',
          description: 'Automated analysis of radiographs, CBCT scans, and intraoral imaging with 468-point facial landmark detection for aesthetic planning.',
          metrics: ['95% accuracy', '15-second analysis', 'FDA 510(k) cleared']
        },
        {
          title: 'Patient Privacy Architecture',
          description: 'Zero-knowledge encryption with blockchain-verified patient consent. Designed for CoolSculpting treatment records and aesthetic outcome tracking.',
          metrics: ['SOC 2 Type II', 'GDPR compliant', 'End-to-end encrypted']
        }
      ],
      industryImpact: 'Leading practices using our AI infrastructure report 40% reduction in diagnostic time, 3x improvement in treatment planning accuracy, and $2.1M average revenue increase within 18 months.',
      caseStudy: {
        title: 'Revolutionizing Aesthetic Consultations',
        description: 'A multi-location medical spa chain implemented our AI infrastructure to analyze before/after photos, predict treatment outcomes, and automate patient matching for consultations.',
        results: [
          '87% increase in consultation-to-treatment conversion',
          '4.8 star average patient satisfaction',
          '$5.2M additional revenue in first year'
        ]
      }
    }
  },
  'machine-learning': {
    title: 'Machine Learning for Medical Excellence',
    subtitle: 'Predictive Analytics Meets Clinical Precision',
    quickFacts: [
      'Treatment outcome prediction with 94% accuracy',
      'Automated patient risk stratification',
      'Real-time complication detection algorithms',
      'Natural language processing for clinical notes'
    ],
    detailedContent: {
      overview: 'Harness the power of advanced machine learning models trained on millions of medical procedures. From predicting CoolSculpting results to optimizing dental implant placement, our ML systems deliver unprecedented clinical insights.',
      keyFeatures: [
        {
          title: 'Outcome Prediction Models',
          description: 'Deep learning networks trained on 2.5M aesthetic procedures predict patient satisfaction, healing time, and complication risks before treatment.',
          metrics: ['94% accuracy', '2.5M procedures', '15 specialties']
        },
        {
          title: 'Clinical Decision Support',
          description: 'Real-time ML algorithms analyze patient history, imaging, and vitals to recommend optimal treatment protocols and flag potential contraindications.',
          metrics: ['<1 second analysis', '89% physician adoption', '37% better outcomes']
        },
        {
          title: 'Revenue Optimization AI',
          description: 'Predictive models for appointment scheduling, inventory management, and dynamic pricing based on demand patterns and patient demographics.',
          metrics: ['22% revenue increase', '45% less waste', '3x ROI']
        }
      ],
      industryImpact: 'Medical practices leveraging our ML models see average improvements of 35% in clinical outcomes, 28% reduction in complications, and 41% increase in patient lifetime value.',
      caseStudy: {
        title: 'AI-Powered Dental Implant Success',
        description: 'Leading oral surgery practice integrated our ML models to analyze CBCT scans, predict bone density, and optimize implant placement vectors.',
        results: [
          '98.2% implant success rate (vs 95% industry average)',
          '50% reduction in surgery time',
          '0.8% complication rate (vs 5% average)'
        ]
      }
    }
  },
  'full-stack': {
    title: 'Full-Stack Healthcare Platforms',
    subtitle: 'From Patient Portal to Practice Intelligence',
    quickFacts: [
      'HIPAA-compliant cloud architecture',
      'Real-time telemedicine capabilities',
      'Integrated billing and insurance verification',
      'Mobile-first patient engagement'
    ],
    detailedContent: {
      overview: 'Complete digital transformation for medical and aesthetic practices. Our full-stack solutions seamlessly integrate patient care, practice management, and business intelligence into one powerful platform.',
      keyFeatures: [
        {
          title: 'Patient Experience Platform',
          description: 'Beautiful, intuitive interfaces for appointment booking, virtual consultations, treatment tracking, and outcome sharing. Designed with the luxury aesthetic market in mind.',
          metrics: ['87% patient adoption', '4.9 app rating', '60% fewer no-shows']
        },
        {
          title: 'Clinical Workflow Engine',
          description: 'Streamlined workflows for everything from patient intake to post-operative care. Automated reminders, consent management, and treatment protocols.',
          metrics: ['3 hours saved daily', '95% compliance rate', 'Zero data breaches']
        },
        {
          title: 'Business Intelligence Suite',
          description: 'Real-time dashboards tracking KPIs, patient acquisition costs, treatment profitability, and market trends. Predictive analytics for growth planning.',
          metrics: ['47% profit increase', '2.3x patient LTV', '$850K saved annually']
        }
      ],
      industryImpact: 'Practices using our full-stack platform report 52% operational efficiency gains, 38% increase in patient satisfaction, and average revenue growth of $3.2M within 24 months.',
      caseStudy: {
        title: 'Scaling Elite Aesthetic Medicine',
        description: 'Luxury med spa group expanded from 3 to 15 locations using our platform for standardized operations, centralized analytics, and automated marketing.',
        results: [
          '$47M revenue across locations',
          '92% patient retention rate',
          '6-month ROI on technology investment'
        ]
      }
    }
  },
  'data-synthesis': {
    title: 'Medical Data Intelligence',
    subtitle: 'Transform Data into Clinical & Business Insights',
    quickFacts: [
      'Unified patient data from 50+ sources',
      'Real-time treatment outcome analytics',
      'Predictive market intelligence',
      'Automated regulatory reporting'
    ],
    detailedContent: {
      overview: 'Unlock the hidden value in your practice data. Our synthesis platform aggregates, analyzes, and activates insights from clinical records, imaging systems, patient feedback, and market dynamics.',
      keyFeatures: [
        {
          title: 'Clinical Data Lake',
          description: 'Centralized repository integrating EMR, imaging, lab results, and patient-reported outcomes. Built for multi-site practices and clinical research.',
          metrics: ['50+ integrations', '99.9% accuracy', 'Real-time sync']
        },
        {
          title: 'Outcome Analytics Engine',
          description: 'Track and analyze treatment results across procedures, providers, and patient cohorts. Benchmark against industry standards and identify optimization opportunities.',
          metrics: ['10K+ metrics tracked', '15-year historical data', 'FDA-compliant']
        },
        {
          title: 'Market Intelligence Platform',
          description: 'Competitive analysis, demand forecasting, and pricing optimization based on real-time market data. Essential for CoolSculpting and aesthetic practices.',
          metrics: ['$753M market coverage', 'Daily updates', '94% forecast accuracy']
        }
      ],
      industryImpact: 'Data-driven practices achieve 43% better clinical outcomes, 31% higher profit margins, and 2.7x faster growth compared to traditional operations.',
      caseStudy: {
        title: 'Data-Driven Aesthetic Empire',
        description: 'National aesthetic brand leveraged our data synthesis to identify expansion opportunities, optimize treatment mix, and personalize marketing.',
        results: [
          '67% increase in high-value procedures',
          '$12.3M from new service lines',
          '89% marketing ROI improvement'
        ]
      }
    }
  },
  'automation': {
    title: 'Intelligent Practice Automation',
    subtitle: 'Eliminate Repetitive Tasks, Amplify Human Care',
    quickFacts: [
      'Automated appointment scheduling & reminders',
      'AI-powered insurance verification',
      'Robotic process automation for billing',
      'Smart inventory management'
    ],
    detailedContent: {
      overview: 'Free your staff to focus on patient care while AI handles the administrative burden. Our automation suite streamlines operations from first contact to final payment.',
      keyFeatures: [
        {
          title: 'Patient Journey Automation',
          description: 'From initial inquiry to post-treatment follow-up, every touchpoint is optimized. Automated scheduling, personalized reminders, and satisfaction surveys.',
          metrics: ['73% admin time saved', '95% show rate', '4.9 satisfaction']
        },
        {
          title: 'Revenue Cycle Management',
          description: 'End-to-end automation of insurance verification, claims submission, payment processing, and collections. Designed for complex aesthetic financing.',
          metrics: ['45-day reduction in AR', '97% clean claim rate', '$2.1M recovered']
        },
        {
          title: 'Clinical Documentation AI',
          description: 'Voice-activated charting, automated treatment notes, and intelligent coding suggestions. Seamlessly integrates with existing EMR systems.',
          metrics: ['2 hours saved per provider', '99% coding accuracy', 'Real-time documentation']
        }
      ],
      industryImpact: 'Automated practices operate with 65% lower overhead, 42% faster patient throughput, and consistently achieve top-decile financial performance.',
      caseStudy: {
        title: 'Robotic Automation Success Story',
        description: 'Multi-specialty group automated 80% of administrative tasks, allowing expansion without additional staff while improving patient experience.',
        results: [
          '$4.2M in labor cost savings',
          '91% patient satisfaction increase',
          '156% productivity improvement'
        ]
      }
    }
  },
  'ai-luxury': {
    title: 'AI-Powered Luxury Medicine',
    subtitle: 'Where Elite Service Meets Artificial Intelligence',
    quickFacts: [
      'Concierge AI for VIP patient management',
      'Predictive luxury experience design',
      'Ultra-personalized treatment planning',
      'White-glove digital experiences'
    ],
    detailedContent: {
      overview: 'Elevate your practice to unprecedented heights with AI designed for the luxury medical market. From Beverly Hills plastic surgery to Manhattan cosmetic dentistry, deliver experiences that exceed elite expectations.',
      keyFeatures: [
        {
          title: 'Concierge Intelligence Platform',
          description: 'AI that learns each patient\'s preferences, anticipates needs, and orchestrates bespoke experiences. From preferred communication channels to treatment customization.',
          metrics: ['$127K average patient value', '98% retention', '11.2 NPS improvement']
        },
        {
          title: 'Luxury Experience Engine',
          description: 'Seamlessly coordinate every touchpoint from private jet arrivals to post-treatment recovery suites. AI manages logistics, preferences, and staff coordination.',
          metrics: ['100% on-time delivery', '5-star reviews only', '$18K per encounter']
        },
        {
          title: 'Elite Outcome Optimization',
          description: 'Leverage AI trained on thousands of high-net-worth patient outcomes. Predict and deliver results that meet the most discerning standards.',
          metrics: ['99.3% satisfaction', 'Zero compromises', '87% referral rate']
        }
      ],
      industryImpact: 'Luxury practices using our AI report average patient values of $250K+, 95% word-of-mouth acquisition, and waitlists exceeding 6 months.',
      caseStudy: {
        title: 'The $100M Aesthetic Practice',
        description: 'Exclusive Park Avenue practice leveraged our luxury AI to scale from $12M to $100M+ while maintaining boutique service standards.',
        results: [
          '$273K average patient lifetime value',
          '400+ Ultra-HNW client base',
          'Featured in Vogue, Town & Country'
        ]
      }
    }
  }
};

export const CapabilityModal: React.FC<CapabilityModalProps> = ({ isOpen, onClose, capability }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!capability) return null;

  const details = capabilityDetails[capability.id as keyof typeof capabilityDetails];
  if (!details) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Glass morphism container */}
            <div className="glass-morphism-premium rounded-2xl border border-champagne/20 shadow-2xl">
              {/* Header with gradient */}
              <div 
                className="relative p-8 border-b border-champagne/10"
                style={{
                  background: `linear-gradient(135deg, ${capability.gradient.match(/#[A-F0-9]{6}/gi)?.[0]} 0%, transparent 60%)`
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-arctic" />
                </button>

                {/* Header content */}
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                    {capability.icon && React.createElement(capability.icon, {
                      className: 'w-12 h-12 text-champagne'
                    })}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-display text-arctic mb-2">{details.title}</h2>
                    <p className="text-xl text-champagne font-light">{details.subtitle}</p>
                  </div>
                </div>

                {/* Quick facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {details.quickFacts.map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-electric mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-titanium">{fact}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[60vh] p-8">
                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-display text-champagne mb-4">Overview</h3>
                  <p className="text-titanium leading-relaxed text-lg">
                    {details.detailedContent.overview}
                  </p>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-display text-champagne mb-6">Key Features</h3>
                  <div className="space-y-6">
                    {details.detailedContent.keyFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="glass-morphism p-6 rounded-xl"
                      >
                        <h4 className="text-xl font-semibold text-arctic mb-2">{feature.title}</h4>
                        <p className="text-titanium mb-4">{feature.description}</p>
                        <div className="flex flex-wrap gap-3">
                          {feature.metrics.map((metric, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-electric/10 text-electric rounded-full text-sm font-mono"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Industry Impact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12 p-6 bg-gradient-to-r from-champagne/10 to-electric/10 rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-champagne flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-display text-champagne mb-2">Industry Impact</h3>
                      <p className="text-titanium">{details.detailedContent.industryImpact}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Case Study */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-display text-champagne mb-6 flex items-center gap-3">
                    <Hospital className="w-6 h-6" />
                    Case Study
                  </h3>
                  <div className="glass-morphism p-6 rounded-xl border border-champagne/20">
                    <h4 className="text-xl font-semibold text-arctic mb-3">
                      {details.detailedContent.caseStudy.title}
                    </h4>
                    <p className="text-titanium mb-4">
                      {details.detailedContent.caseStudy.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {details.detailedContent.caseStudy.results.map((result, index) => (
                        <div
                          key={index}
                          className="text-center p-4 bg-gradient-to-br from-electric/10 to-champagne/10 rounded-lg"
                        >
                          <p className="text-lg font-semibold text-electric">{result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-display text-arctic mb-4">
                    Ready to Transform Your Practice?
                  </h3>
                  <p className="text-titanium mb-6">
                    Join leading medical and aesthetic practices leveraging AI for unprecedented growth.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn-performance inline-flex items-center gap-2"
                  >
                    Schedule Consultation
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};