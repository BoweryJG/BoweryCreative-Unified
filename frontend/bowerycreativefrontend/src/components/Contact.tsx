import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { contactsAPI, onboardingAPI, emailAPI } from '../services/api';
import { AudioButton } from './AudioButton';
import audioManager from '../utils/audioManager';

// Rate limiting: Track submissions per IP/session
const SUBMISSION_COOLDOWN = 60000; // 1 minute
const MAX_DAILY_SUBMISSIONS = 5;

// Input validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/[<>"']/g, '') // Remove dangerous characters
    .substring(0, 1000); // Limit length
};

const validateFormData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    position: '',
    project_type: 'AI Infrastructure',
    message: '',
    budget_range: '',
    timeline: '',
    urgency: 'medium',
    preferred_contact_method: 'email',
    source: 'website',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'validation-error'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState(''); // Bot detection
  const lastSubmission = useRef<number>(0);
  const submissionCount = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationErrors([]);

    // Bot detection - honeypot field should be empty
    if (honeypot) {
      console.warn('Bot detected - honeypot field filled');
      setIsSubmitting(false);
      return;
    }

    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmission.current < SUBMISSION_COOLDOWN) {
      setSubmitStatus('validation-error');
      setValidationErrors(['Please wait before submitting another message']);
      setIsSubmitting(false);
      return;
    }

    if (submissionCount.current >= MAX_DAILY_SUBMISSIONS) {
      setSubmitStatus('validation-error');
      setValidationErrors(['Daily submission limit reached. Please try again tomorrow.']);
      setIsSubmitting(false);
      return;
    }

    // Sanitize and validate input
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email.toLowerCase()),
      company: sanitizeInput(formData.company),
      phone: sanitizeInput(formData.phone),
      position: sanitizeInput(formData.position),
      message: sanitizeInput(formData.message),
    };

    const validation = validateFormData(sanitizedData);
    if (!validation.isValid) {
      setSubmitStatus('validation-error');
      setValidationErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Update rate limiting trackers
      lastSubmission.current = now;
      submissionCount.current += 1;

      // Calculate lead score based on form data
      const leadScore = calculateLeadScore(formData);

      // Create contact through API
      const contact = await contactsAPI.create({
        ...sanitizedData,
        lead_score: leadScore,
        tags: [formData.project_type, formData.urgency],
        availability: formData.timeline,
      });

      if (!contact.id) {
        throw new Error('Failed to create contact');
      }

      // Initialize onboarding through API
      const { projectId } = await onboardingAPI.startOnboarding(contact.id);

      // Send welcome email through API
      if (contact.email) {
        await emailAPI.sendEmail(
          'welcome', // template ID
          contact.email,
          {
            name: contact.name,
            projectType: formData.project_type,
            timeline: formData.timeline,
            projectId: projectId
          }
        );
      }

      setSubmitStatus('success');
      
      // Play success sound
      audioManager.playSuccessSound();
      
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        position: '',
        project_type: 'AI Infrastructure',
        message: '',
        budget_range: '',
        timeline: '',
        urgency: 'medium',
        preferred_contact_method: 'email',
        source: 'website',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Handle specific error types
      if (error?.message?.includes('duplicate key')) {
        setSubmitStatus('validation-error');
        setValidationErrors(['This email has already been submitted. We\'ll respond soon!']);
      } else if (error?.message?.includes('rate limit')) {
        setSubmitStatus('validation-error');
        setValidationErrors(['Too many requests. Please try again later.']);
      } else {
        setSubmitStatus('error');
        setValidationErrors(['Something went wrong. Please try again or contact us directly.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setSubmitStatus('idle');
    }
    
    // Real-time validation feedback
    let sanitizedValue = value;
    if (name === 'email') {
      sanitizedValue = value.toLowerCase().trim();
    } else if (name === 'phone') {
      // Allow only numbers, spaces, dashes, parentheses, and plus
      sanitizedValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const calculateLeadScore = (data: typeof formData): number => {
    let score = 0;
    
    // Budget range scoring
    const budgetScores: Record<string, number> = {
      'Under $10k': 10,
      '$10k - $25k': 25,
      '$25k - $50k': 40,
      '$50k - $100k': 60,
      '$100k - $250k': 80,
      '$250k+': 100
    };
    score += budgetScores[data.budget_range] || 0;

    // Urgency scoring
    const urgencyScores: Record<string, number> = {
      'low': 10,
      'medium': 30,
      'high': 60,
      'urgent': 100
    };
    score += urgencyScores[data.urgency] || 0;

    // Timeline scoring (faster = higher score)
    const timelineScores: Record<string, number> = {
      'ASAP': 100,
      '1-2 weeks': 80,
      '1 month': 60,
      '2-3 months': 40,
      '3-6 months': 20,
      '6+ months': 10,
      'Flexible': 15
    };
    score += timelineScores[data.timeline] || 0;

    // Company presence (has company = more serious)
    if (data.company) score += 20;
    
    // Position indicates decision-making authority
    const seniorPositions = ['ceo', 'cto', 'founder', 'vp', 'director', 'head'];
    if (data.position && seniorPositions.some(pos => data.position.toLowerCase().includes(pos))) {
      score += 30;
    }

    // Message quality (longer = more thought out)
    if (data.message.length > 100) score += 20;
    if (data.message.length > 300) score += 20;

    return Math.min(score, 100); // Cap at 100
  };

  return (
    <section id="contact" className="section-luxury bg-gradient-to-b from-midnight to-obsidian relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-electric/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />

      <div className="container-luxury relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-20 bg-champagne" />
              <p className="text-champagne text-xs tracking-[0.3em] uppercase font-mono">
                Ignite Partnership
              </p>
              <div className="h-px w-20 bg-champagne" />
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal mb-8 tracking-tech">
              <span className="text-gradient-gold">Accelerate</span>
              <span className="block text-arctic mt-2">Your Vision</span>
            </h2>
            
            <p className="text-xl text-titanium font-light leading-relaxed max-w-3xl mx-auto">
              Ready to engineer tomorrow's intelligence? Let's discuss your project and build something extraordinary together.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-morphism p-8 md:p-12 space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic placeholder-racing-silver"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic placeholder-racing-silver"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic placeholder-racing-silver"
                  placeholder="Tech Innovations Inc."
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic placeholder-racing-silver"
                  placeholder="CEO, CTO, Product Manager"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic placeholder-racing-silver"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Budget Range</label>
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
                >
                  <option value="" className="bg-carbon text-arctic">Select Budget Range</option>
                  <option value="Under $10k" className="bg-carbon text-arctic">Under $10k</option>
                  <option value="$10k - $25k" className="bg-carbon text-arctic">$10k - $25k</option>
                  <option value="$25k - $50k" className="bg-carbon text-arctic">$25k - $50k</option>
                  <option value="$50k - $100k" className="bg-carbon text-arctic">$50k - $100k</option>
                  <option value="$100k - $250k" className="bg-carbon text-arctic">$100k - $250k</option>
                  <option value="$250k+" className="bg-carbon text-arctic">$250k+</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Project Type</label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
                >
                  <option value="AI Infrastructure" className="bg-carbon text-arctic">AI Infrastructure</option>
                  <option value="Machine Learning" className="bg-carbon text-arctic">Machine Learning</option>
                  <option value="Full-Stack Development" className="bg-carbon text-arctic">Full-Stack Development</option>
                  <option value="Data Analytics" className="bg-carbon text-arctic">Data Analytics</option>
                  <option value="Process Automation" className="bg-carbon text-arctic">Process Automation</option>
                  <option value="Custom AI Agents" className="bg-carbon text-arctic">Custom AI Agents</option>
                  <option value="Creative Technology" className="bg-carbon text-arctic">Creative Technology</option>
                  <option value="Other" className="bg-carbon text-arctic">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
                >
                  <option value="" className="bg-carbon text-arctic">Select Timeline</option>
                  <option value="ASAP" className="bg-carbon text-arctic">ASAP (Rush)</option>
                  <option value="1-2 weeks" className="bg-carbon text-arctic">1-2 weeks</option>
                  <option value="1 month" className="bg-carbon text-arctic">1 month</option>
                  <option value="2-3 months" className="bg-carbon text-arctic">2-3 months</option>
                  <option value="3-6 months" className="bg-carbon text-arctic">3-6 months</option>
                  <option value="6+ months" className="bg-carbon text-arctic">6+ months</option>
                  <option value="Flexible" className="bg-carbon text-arctic">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Priority Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none text-arctic"
              >
                <option value="low" className="bg-carbon text-arctic">Low - Exploring options</option>
                <option value="medium" className="bg-carbon text-arctic">Medium - Planning phase</option>
                <option value="high" className="bg-carbon text-arctic">High - Ready to start</option>
                <option value="urgent" className="bg-carbon text-arctic">Urgent - Need immediate help</option>
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-champagne mb-3 font-mono">Project Details *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-0 py-4 bg-transparent border-0 border-b border-racing-silver focus:border-champagne transition-colors duration-300 outline-none resize-none text-arctic placeholder-racing-silver"
                placeholder="Describe your project goals, technical requirements, and vision..."
              />
            </div>

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-electric bg-electric/10 rounded-lg"
              >
                <p className="text-electric font-mono text-sm flex items-center">
                  <span className="mr-2">✓</span>
                  Message sent successfully! We'll respond within 24 hours.
                </p>
              </motion.div>
            )}

            {(submitStatus === 'error' || submitStatus === 'validation-error') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-red-400 bg-red-400/10 rounded-lg"
              >
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-red-400 font-mono text-sm flex items-start">
                    <span className="mr-2 mt-0.5">✗</span>
                    {error}
                  </p>
                ))}
              </motion.div>
            )}

            {/* Honeypot field - hidden from users, visible to bots */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <AudioButton
                type="submit"
                disabled={isSubmitting}
                className={`btn-performance ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                variant="primary"
                soundFrequency={523.25} // C5 note
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Processing...' : 'Launch Project'}
                </span>
              </AudioButton>
              
              <div className="flex items-center gap-4 text-racing-silver text-sm">
                <div className="w-2 h-2 bg-electric rounded-full animate-pulse" />
                Response within 24 hours
              </div>
            </div>
          </motion.form>

          {/* Contact Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-24 grid md:grid-cols-3 gap-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 border border-champagne mx-auto mb-4 flex items-center justify-center">
                <span className="text-champagne font-mono text-sm">✦</span>
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-champagne mb-2 font-mono">Contact Method</p>
              <p className="text-arctic">
                Secure Form Only
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 border border-champagne mx-auto mb-4 flex items-center justify-center">
                <span className="text-champagne font-mono text-sm">NYC</span>
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-champagne mb-2 font-mono">Location</p>
              <p className="text-arctic">New York City</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 border border-champagne mx-auto mb-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-electric rounded-full animate-pulse" />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-champagne mb-2 font-mono">Status</p>
              <p className="text-arctic">Available for Projects</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};