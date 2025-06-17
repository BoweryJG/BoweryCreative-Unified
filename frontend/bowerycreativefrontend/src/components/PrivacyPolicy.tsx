import React from 'react';
import { motion } from 'framer-motion';

export const PrivacyPolicy: React.FC = () => {
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
              <span className="text-gradient-gold">Privacy</span>
              <span className="block text-arctic mt-2">Policy</span>
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
              <h2 className="text-2xl font-display text-champagne mb-4">1. Information We Collect</h2>
              <div className="text-titanium space-y-4">
                <p>
                  When you use our website or contact us, we may collect the following information:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, company name, position</li>
                  <li><strong>Project Information:</strong> Project type, budget range, timeline, urgency, and project details</li>
                  <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage analytics</li>
                  <li><strong>Communication Records:</strong> Messages, emails, and interaction history for service delivery</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">2. How We Use Your Information</h2>
              <div className="text-titanium space-y-4">
                <p>We use the collected information to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Respond to your inquiries and provide requested services</li>
                  <li>Assess project requirements and provide accurate proposals</li>
                  <li>Maintain communication throughout our business relationship</li>
                  <li>Improve our website and services based on usage analytics</li>
                  <li>Comply with legal obligations and protect our business interests</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">3. Information Sharing</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We do not sell, trade, or share your personal information with third parties except:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in our operations (email services, analytics)</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">4. Data Security</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure cloud infrastructure with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">5. Your Rights</h2>
              <div className="text-titanium space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Correct or update your information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>File a complaint with relevant data protection authorities</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">6. Cookies and Analytics</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We use cookies and similar technologies to improve your experience:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand website usage (Google Analytics)</li>
                  <li>Performance cookies to optimize loading times</li>
                </ul>
                <p>
                  You can control cookie preferences through your browser settings.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">7. Data Retention</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Provide ongoing services and support</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p>
                  Contact information is typically retained for 7 years unless you request deletion.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">8. International Transfers</h2>
              <div className="text-titanium space-y-4">
                <p>
                  Your information may be transferred to and processed in countries outside your residence. 
                  We ensure appropriate safeguards are in place to protect your information in accordance 
                  with applicable data protection laws.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">9. Children's Privacy</h2>
              <div className="text-titanium space-y-4">
                <p>
                  Our services are not directed to individuals under 18 years of age. We do not 
                  knowingly collect personal information from children under 18.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-champagne mb-4">10. Changes to This Policy</h2>
              <div className="text-titanium space-y-4">
                <p>
                  We may update this Privacy Policy periodically. We will notify you of material 
                  changes by posting the updated policy on our website with a new effective date.
                </p>
              </div>
            </div>

            <div className="border-t border-racing-silver pt-8">
              <h2 className="text-2xl font-display text-champagne mb-4">Contact Us</h2>
              <div className="text-titanium space-y-4">
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-carbon p-6 rounded-lg">
                  <p><strong>Bowery Creative Agency</strong></p>
                  <p>Email: privacy@bowerycreativeagency.com</p>
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