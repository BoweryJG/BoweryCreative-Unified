import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Brand Strategy',
    description: 'Positioning your practice as the definitive choice for discerning patients through sophisticated brand architecture.',
    details: [
      'Comprehensive market analysis and positioning',
      'Visual identity and brand guidelines',
      'Messaging framework and voice development',
      'Competitive differentiation strategy',
    ],
  },
  {
    title: 'Digital Excellence',
    description: 'Crafting digital experiences that reflect the precision and care of your medical practice.',
    details: [
      'Responsive website design and development',
      'Patient portal and booking integration',
      'SEO and local search optimization',
      'Performance tracking and analytics',
    ],
  },
  {
    title: 'Content Creation',
    description: 'Thought leadership and educational content that establishes your authority in the field.',
    details: [
      'Educational video production',
      'Blog and article writing',
      'Social media content strategy',
      'Email marketing campaigns',
    ],
  },
  {
    title: 'Campaign Management',
    description: 'Strategic campaigns designed to attract quality patients and drive sustainable growth.',
    details: [
      'Multi-channel campaign planning',
      'Paid media management (Google, Meta, etc.)',
      'ROI tracking and optimization',
      'A/B testing and conversion optimization',
    ],
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="section-spacing bg-bowery-gray-50">
      <div className="container-bowery">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl mb-24"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Services
          </h2>
          <p className="text-lg text-bowery-gray-600 font-light">
            Comprehensive solutions designed to elevate your medical practice through strategic thinking and refined execution.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="mb-6">
                <span className="text-refined text-bowery-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-light mb-4 group-hover:text-bowery-accent transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-bowery-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>
              {service.details && (
                <ul className="space-y-2 mb-8">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-bowery-accent mr-2">•</span>
                      <span className="text-sm text-bowery-gray-500">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
              <motion.div
                className="inline-block"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <a href="#contact" className="btn-minimal text-bowery-black">
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};