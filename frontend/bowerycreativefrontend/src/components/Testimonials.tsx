import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Bowery Creative transformed our practice. Their strategic approach to brand positioning elevated us from a local clinic to a nationally recognized center of excellence.",
    author: "Dr. Sarah Chen",
    title: "Medical Director, Premier Aesthetics NYC",
    metric: "312% increase in high-value patients",
  },
  {
    quote: "The level of sophistication and attention to detail is unmatched. They understand the nuances of medical marketing and deliver results that exceed expectations.",
    author: "Dr. Michael Torres",
    title: "Founder, Advanced Dermatology Group",
    metric: "5x ROI in first year",
  },
  {
    quote: "Working with Bowery Creative felt like adding a world-class marketing department to our practice. Their technology integration has revolutionized how we connect with patients.",
    author: "Dr. Jennifer Park",
    title: "CEO, Luxe Medical Spa",
    metric: "$2.3M revenue growth",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="section-spacing bg-bowery-black text-bowery-white">
      <div className="container-bowery">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Client Perspectives
          </h2>
          <p className="text-lg text-bowery-gray-400 font-light max-w-2xl mx-auto">
            Trusted by leading medical professionals who demand excellence.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Quote */}
              <div className="mb-8">
                <svg
                  className="w-10 h-10 text-bowery-accent mb-6 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-bowery-gray-300 leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="pt-6 border-t border-bowery-gray-800">
                  <p className="font-display text-lg">{testimonial.author}</p>
                  <p className="text-sm text-bowery-gray-500">{testimonial.title}</p>
                  <p className="text-bowery-accent text-sm mt-3">{testimonial.metric}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};