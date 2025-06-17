import React from 'react';
import { motion } from 'framer-motion';

const caseStudies = [
  {
    client: 'CoolSculpting Elite',
    category: 'Brand Evolution',
    description: 'Repositioning a market leader for the next generation of body contouring',
    results: '+312% qualified leads',
    image: '/img/work/coolsculpting.jpg',
  },
  {
    client: 'MiraDry',
    category: 'Digital Transformation',
    description: 'Creating a patient-centric digital experience for permanent sweat reduction',
    results: '847% ROI in 6 months',
    image: '/img/work/miradry.jpg',
  },
  {
    client: 'Fraxel',
    category: 'Campaign Strategy',
    description: 'Launching the gold standard in skin resurfacing to a new demographic',
    results: '$2.3M revenue generated',
    image: '/img/work/fraxel.jpg',
  },
  {
    client: 'Thermage FLX',
    category: 'Content Marketing',
    description: 'Educational content strategy for non-invasive skin tightening technology',
    results: '5x engagement rate',
    image: '/img/work/thermage.jpg',
  },
];

export const Work: React.FC = () => {
  return (
    <section id="work" className="section-spacing">
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
            Selected Work
          </h2>
          <p className="text-lg text-bowery-gray-600 font-light">
            Transformative campaigns that redefine medical aesthetics marketing.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="space-y-32">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.client}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="mb-6">
                  <span className="text-refined text-bowery-accent">
                    {study.category}
                  </span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-light mb-6">
                  {study.client}
                </h3>
                <p className="text-bowery-gray-600 text-lg mb-8 leading-relaxed">
                  {study.description}
                </p>
                <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-3xl font-display font-light">{study.results}</span>
                  <span className="text-bowery-gray-500">achieved</span>
                </div>
                <motion.a
                  href="#contact"
                  className="btn-minimal text-bowery-black inline-block"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  View Case Study
                </motion.a>
              </div>

              {/* Image */}
              <div className={`relative aspect-[4/3] bg-bowery-gray-100 overflow-hidden ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <motion.div
                  className="absolute inset-0 bg-bowery-gray-200"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  {/* Placeholder for case study visual */}
                  <div className="h-full flex items-center justify-center">
                    <span className="text-bowery-gray-400 text-sm tracking-refined uppercase">
                      {study.client}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};