import React from 'react';
import { motion } from 'framer-motion';

const clients = [
  'CoolSculpting',
  'MiraDry', 
  'Fraxel',
  'Thermage',
  'AbbVie',
  'Cynosure',
  'Valeant',
];

export const ClientLogos: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="container-bowery">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="text-refined text-bowery-gray-600 mb-16">
            Selected Clients
          </p>
          
          {/* Minimal logo display */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12">
            {clients.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-center"
              >
                <span className="text-bowery-gray-400 text-sm font-light hover:text-bowery-black transition-colors duration-300">
                  {client}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};