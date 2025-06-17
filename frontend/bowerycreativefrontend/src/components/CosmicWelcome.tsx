import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CreditCard, Shield, Zap, Star, Rocket } from 'lucide-react';

interface WelcomeData {
  firstName: string;
  lastName: string;
  practiceName: string;
  email: string;
  promoCode?: string;
  clientData?: {
    id: string;
    name: string;
    company: string;
    monthly_amount: number;
    custom_package?: {
      name: string;
      description: string;
    };
  };
}

export const CosmicWelcome: React.FC = () => {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [pricing, setPricing] = useState<{ amount: number; description: string }>({ 
    amount: 0, 
    description: 'Custom Package' 
  });

  useEffect(() => {
    // Get welcome data from localStorage
    const data = localStorage.getItem('welcomeData');
    if (data) {
      const parsed = JSON.parse(data);
      setWelcomeData(parsed);
      
      // Set pricing based on client data or promo code
      if (parsed.clientData) {
        setPricing({ 
          amount: parsed.clientData.monthly_amount, 
          description: parsed.clientData.custom_package?.name || 'Custom Package' 
        });
      } else if (parsed.promoCode === 'PEDRO') {
        setPricing({ amount: 2000, description: 'Dr. Pedro Special - Monthly AI Infrastructure' });
      } else if (parsed.promoCode) {
        // Handle other promo codes
        setPricing({ amount: 0, description: 'Custom Package' });
      } else {
        setPricing({ amount: 0, description: 'Select Your Package' });
      }
    }
  }, []);

  const handleLaunchPortal = () => {
    // Pass promo code and user data to payment portal
    const paymentData = {
      ...welcomeData,
      pricing,
      clientAccountId: welcomeData?.clientData?.id
    };
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    // Build URL with parameters
    const params = new URLSearchParams();
    if (welcomeData?.promoCode) params.append('code', welcomeData.promoCode);
    if (welcomeData?.clientData?.id) params.append('client', welcomeData.clientData.id);
    if (pricing.amount > 0) params.append('amount', pricing.amount.toString());
    
    const queryString = params.toString();
    window.location.href = `https://bowerycreativepayments.netlify.app/${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#000000] text-white overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 z-0">
        <div className="stars"></div>
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Header with atomic animation */}
          <div className="text-center mb-12 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-10 w-24 h-24"
            >
              <div className="atom">
                <div className="nucleus"></div>
                <div className="electron-orbit orbit1">
                  <div className="electron electron1"></div>
                </div>
                <div className="electron-orbit orbit2">
                  <div className="electron electron2"></div>
                </div>
                <div className="electron-orbit orbit3">
                  <div className="electron electron3"></div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent bg-300% animate-gradient"
            >
              Welcome to Bowery Creative
            </motion.h1>
            <motion.p
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300"
            >
              Where Extraordinary Ideas Come to Life
            </motion.p>
          </div>

          {/* Main content card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">
                Hi {welcomeData?.firstName || 'there'}! 🚀
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                We're absolutely <span className="text-yellow-400 font-bold">thrilled</span> to welcome you to the Bowery Creative family!
              </p>
              <p className="text-lg text-gray-400">
                Your partnership with us is about to unlock <em className="text-orange-400">incredible creative potential</em> that will transform 
                {welcomeData?.practiceName && <span> {welcomeData.practiceName}</span>} and elevate your brand to extraordinary new heights.
              </p>
            </div>

            {/* Special pricing display for promo codes */}
            {welcomeData?.promoCode && pricing.amount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-6 mb-8 border border-yellow-400/30"
              >
                <div className="text-center">
                  <p className="text-sm text-yellow-400 mb-2">SPECIAL PRICING ACTIVATED</p>
                  <p className="text-3xl font-bold text-white mb-2">
                    ${pricing.amount}/month
                  </p>
                  <p className="text-gray-300">{pricing.description}</p>
                  <p className="text-sm text-yellow-400 mt-2">Code: {welcomeData.promoCode}</p>
                </div>
              </motion.div>
            )}

            <div className="text-center mb-10">
              <p className="text-xl mb-6">Ready to get started? Let's set up your secure payment portal:</p>
              
              <motion.button
                onClick={handleLaunchPortal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-10 py-5 rounded-xl text-xl transition-all transform cosmic-glow inline-flex items-center gap-3"
              >
                <Rocket className="w-6 h-6" />
                Launch My Payment Portal
              </motion.button>
            </div>

            {/* Features grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/5 backdrop-blur rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Payment Setup</h3>
                <p className="text-gray-400">Enterprise-grade security with Stripe</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white/5 backdrop-blur rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Dashboard Access</h3>
                <p className="text-gray-400">Get started immediately after payment</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-white/5 backdrop-blur rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Support</h3>
                <p className="text-gray-400">Dedicated team at your service</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center mt-12 text-gray-400"
          >
            <p>Questions? Contact us at <a href="mailto:support@bowerycreativeagency.com" className="text-yellow-400 hover:text-yellow-300">support@bowerycreativeagency.com</a></p>
            <p className="mt-2">or call <span className="text-yellow-400">(845) 409-0692</span></p>
          </motion.div>
        </motion.div>
      </div>

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

        .bg-300\% {
          background-size: 300%;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        /* Atom styles */
        .atom {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .nucleus {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 20px #ffd700;
        }
        
        .electron-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        
        .orbit1 { 
          width: 60px; 
          height: 60px; 
          animation: atomSpin 2s linear infinite; 
        }
        .orbit2 { 
          width: 80px; 
          height: 30px; 
          animation: atomSpin 3s linear infinite reverse; 
        }
        .orbit3 { 
          width: 70px; 
          height: 70px; 
          animation: atomSpin 2.5s linear infinite; 
        }
        
        .electron {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #00f0ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00f0ff;
        }
        
        .electron1 { top: -2px; left: 28px; }
        .electron2 { top: 14px; right: -2px; }
        .electron3 { bottom: -2px; left: 33px; }
        
        @keyframes atomSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};