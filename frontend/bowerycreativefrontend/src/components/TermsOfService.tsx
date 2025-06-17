import React from 'react';
import { motion } from 'framer-motion';

export const TermsOfService: React.FC = () => {
  return (
    <section className="section-luxury bg-gradient-to-b from-midnight to-obsidian">
      <div className="container-luxury">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-5xl md:text-6xl font-normal mb-8 tracking-tech">
              <span className="text-gradient-gold">Terms of</span>
              <span className="block text-arctic mt-2">Service</span>
            </h1>
            <p className="text-racing-silver">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism p-8 md:p-12 space-y-8"
          >
            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">1. Acceptance of Terms</h2>
              <div className="text-titanium space-y-4">
                <p>
                  By accessing and using Bowery Creative's website and services, you accept and agree to 
                  be bound by these Terms of Service. If you do not agree to these terms, please do not 
                  use our services.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">2. Services Description</h2>
              <div className="text-titanium space-y-4">
                <p>
                  Bowery Creative provides:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Custom AI development and machine learning solutions</li>
                  <li>Full-stack web and mobile application development</li>
                  <li>Data analytics and business intelligence platforms</li>
                  <li>Process automation and workflow optimization</li>
                  <li>AI consulting and strategic advisory services</li>
                  <li>Technical architecture and infrastructure design</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">3. Client Responsibilities</h2>
              <div className="text-titanium space-y-4">
                <p>As our client, you agree to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Provide accurate and complete project requirements</li>
                  <li>Supply necessary access, data, and resources in a timely manner</li>
                  <li>Respond to requests for feedback and approvals within agreed timeframes</li>
                  <li>Make payments according to the agreed schedule</li>
                  <li>Respect intellectual property rights and confidentiality agreements</li>
                  <li>Use our services for lawful purposes only</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">4. Project Terms and Delivery</h2>
              <div className="text-titanium space-y-4">
                <h3 className="text-lg font-semibold text-champagne">4.1 Project Scope</h3>
                <p>
                  All projects are governed by detailed statements of work that define scope, 
                  deliverables, timeline, and payment terms. Changes to scope require written agreement.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">4.2 Timeline and Milestones</h3>
                <p>
                  Project timelines are estimates based on information available at project initiation. 
                  Delays caused by client feedback, scope changes, or external dependencies may affect delivery dates.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">4.3 Acceptance and Revisions</h3>
                <p>
                  Deliverables are considered accepted if no feedback is provided within 5 business days. 
                  Revision requests beyond the agreed scope may incur additional charges.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">5. Payment Terms</h2>
              <div className="text-titanium space-y-4">
                <h3 className="text-lg font-semibold text-champagne">5.1 Fees and Billing</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Project fees are outlined in individual contracts</li>
                  <li>Payment schedules are typically milestone-based</li>
                  <li>Invoices are due within 30 days unless otherwise specified</li>
                  <li>Late payments may incur interest charges</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">5.2 Expenses</h3>
                <p>
                  Third-party costs (hosting, licenses, APIs) are billed separately unless included in the project quote.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">5.3 Refunds</h3>
                <p>
                  Refunds are handled on a case-by-case basis. Work completed prior to termination is non-refundable.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">6. Intellectual Property</h2>
              <div className="text-titanium space-y-4">
                <h3 className="text-lg font-semibold text-champagne">6.1 Client IP</h3>
                <p>
                  You retain ownership of your business logic, data, and proprietary information.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">6.2 Developed Solutions</h3>
                <p>
                  Unless otherwise specified, custom-developed solutions become your property upon final payment. 
                  We retain rights to general methodologies, frameworks, and non-proprietary components.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">6.3 Third-Party Components</h3>
                <p>
                  Solutions may include third-party libraries and tools subject to their respective licenses.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">7. Confidentiality</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We maintain strict confidentiality regarding your business information, data, and project details. 
                  This obligation continues beyond the termination of our working relationship.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">8. Warranties and Disclaimers</h2>
              <div className="text-titanium space-y-4">
                <h3 className="text-lg font-semibold text-champagne">8.1 Service Warranty</h3>
                <p>
                  We warrant that our services will be performed with professional skill and care 
                  consistent with industry standards.
                </p>
                
                <h3 className="text-lg font-semibold text-champagne mt-6">8.2 Disclaimer</h3>
                <p>
                  EXCEPT AS EXPRESSLY SET FORTH HEREIN, WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, 
                  INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">9. Limitation of Liability</h2>
              <div className="text-titanium space-y-4">
                <p>
                  OUR LIABILITY FOR ANY CLAIM ARISING OUT OF THIS AGREEMENT SHALL NOT EXCEED THE TOTAL 
                  FEES PAID BY YOU FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM. WE SHALL NOT BE 
                  LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">10. Termination</h2>
              <div className="text-titanium space-y-4">
                <p>
                  Either party may terminate an engagement with 30 days written notice. Upon termination:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Payment is due for all work completed</li>
                  <li>We will deliver all completed deliverables</li>
                  <li>Confidentiality obligations remain in effect</li>
                  <li>Appropriate transition assistance will be provided</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">11. Force Majeure</h2>
              <div className="text-titanium space-y-4">
                <p>
                  Neither party shall be liable for delays or failures due to circumstances beyond their 
                  reasonable control, including acts of God, government actions, or other unforeseeable events.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">12. Governing Law</h2>
              <div className="text-titanium space-y-4">
                <p>
                  These terms are governed by the laws of the State of New York, United States. 
                  Any disputes shall be resolved through binding arbitration in New York, NY.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">13. Changes to Terms</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We reserve the right to modify these terms at any time. Material changes will be 
                  communicated via email or website notice. Continued use of our services constitutes 
                  acceptance of modified terms.
                </p>
              </div>
            </div>

            <div className="border-t border-racing-silver pt-8">
              <h2 className="text-2xl font-display text-champagne mb-4">Contact Information</h2>
              <div className="text-titanium space-y-4">
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-carbon p-6 rounded-lg">
                  <p><strong>Bowery Creative Agency</strong></p>
                  <p>Contact: <a href="#contact" className="text-champagne hover:text-electric transition-colors">Secure Contact Form</a></p>
                  <p>Address: New York, NY, United States</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};