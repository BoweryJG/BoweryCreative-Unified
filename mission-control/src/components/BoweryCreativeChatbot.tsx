import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Maximize2, Phone, Calendar, Star, Brain, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  sentiment?: number;
}

interface BoweryCreativeChatbotProps {
  clientId?: string;
  apiKey?: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  companyName?: string;
  services?: string[];
}

const BOWERY_KNOWLEDGE_BASE = {
  services: {
    "Custom CRM Development": {
      description: "100% custom CRM systems that pull from anywhere, display any data, connect everything",
      pricing: "$25K-250K",
      features: ["Universal data integration", "Infinite display options", "AI-powered insights", "Predictive analytics"],
      tier: "All tiers"
    },
    "AI Linguistics & Sentiment Analysis": {
      description: "Real-time conversation intelligence, voice transcription, sentiment analysis",
      pricing: "$15K-65K add-on",
      features: ["Real-time transcription", "Emotion detection", "Auto-generated notes", "Follow-up triggers"],
      tier: "Advanced+"
    },
    "Digital Phone System": {
      description: "24/7 AI phone system with call transcription and automated booking",
      pricing: "$8K-65K",
      features: ["100% call coverage", "Smart call routing", "Voice-activated management", "Call analytics"],
      tier: "All tiers"
    },
    "Facial Aesthetic Simulators": {
      description: "Custom simulation tools for treatment visualization and case acceptance",
      pricing: "Included in Tier 2+",
      features: ["Before/after visualization", "Treatment cost estimation", "Patient education tools"],
      tier: "Acceleration+"
    },
    "Custom Website Development": {
      description: "React/Next.js websites - no templates, built from scratch",
      pricing: "Included all tiers",
      features: ["Modern React/Next.js", "Mobile-first design", "Custom animations", "Performance optimized"],
      tier: "All tiers"
    },
    "AI Infrastructure": {
      description: "Enterprise-grade AI systems with custom training and optimization",
      pricing: "$35K-200K+",
      features: ["Custom knowledge bases", "Multi-model integration", "Real-time learning", "API integrations"],
      tier: "Acceleration+"
    }
  },
  tiers: {
    "Foundation": {
      price: "$15K-25K",
      description: "AI-Enhanced Digital Presence",
      includes: ["Custom React website", "Basic AI chatbot", "Social media automation", "Email marketing"]
    },
    "Acceleration": {
      price: "$35K-65K", 
      description: "Intelligent Practice Operations",
      includes: ["Everything in Foundation", "Advanced CRM", "Patient simulators", "Automation workflows"]
    },
    "Dominance": {
      price: "$75K-150K",
      description: "Full AI Infrastructure Transformation", 
      includes: ["Everything in Acceleration", "Custom AI training", "Multi-location management", "Advanced analytics"]
    },
    "Enterprise": {
      price: "$200K+",
      description: "Market Leadership AI Ecosystem",
      includes: ["Multi-practice networks", "Custom research agents", "White-label solutions", "Market intelligence"]
    }
  },
  differentiators: [
    "No templates ever - everything built from scratch",
    "Facebook Developer certified with advanced automation access",
    "Medical-grade HIPAA compliance built-in",
    "Only agency offering true custom CRM for medical practices",
    "AI infrastructure that learns and improves over time"
  ]
};

export const BoweryCreativeChatbot: React.FC<BoweryCreativeChatbotProps> = ({
  clientId,
  apiKey,
  position = 'bottom-right',
  primaryColor = '#d4af37',
  companyName = 'Bowery Creative',
  services = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm the ${companyName} AI Assistant. I specialize in helping dental and aesthetic practices transform their operations with custom AI infrastructure. 

🏥 **What we're known for:**
• Custom CRM systems that connect to everything
• AI phone systems with real-time transcription  
• Facial aesthetic & dental simulators
• Complete practice automation

**How can I help you elevate your practice today?**`,
      sender: 'bot',
      timestamp: new Date(),
      intent: 'greeting'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userSentiment, setUserSentiment] = useState<number>(0.5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return 'pricing_inquiry';
    }
    if (lowerMessage.includes('crm') || lowerMessage.includes('customer relationship')) {
      return 'crm_interest';
    }
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
      return 'ai_interest';
    }
    if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('booking')) {
      return 'phone_system_interest';
    }
    if (lowerMessage.includes('simulator') || lowerMessage.includes('aesthetic') || lowerMessage.includes('dental')) {
      return 'simulator_interest';
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('demo') || lowerMessage.includes('meeting')) {
      return 'demo_request';
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('question')) {
      return 'general_help';
    }
    return 'general_inquiry';
  };

  const analyzeSentiment = (message: string): number => {
    const lowerMessage = message.toLowerCase();
    let sentiment = 0.5; // neutral
    
    // Positive indicators
    if (lowerMessage.includes('great') || lowerMessage.includes('excellent') || lowerMessage.includes('amazing')) {
      sentiment += 0.3;
    }
    if (lowerMessage.includes('interested') || lowerMessage.includes('want') || lowerMessage.includes('need')) {
      sentiment += 0.2;
    }
    
    // Negative indicators  
    if (lowerMessage.includes('expensive') || lowerMessage.includes('costly') || lowerMessage.includes('too much')) {
      sentiment -= 0.2;
    }
    if (lowerMessage.includes('complicated') || lowerMessage.includes('difficult') || lowerMessage.includes('complex')) {
      sentiment -= 0.1;
    }
    
    return Math.max(0, Math.min(1, sentiment));
  };

  const generateResponse = async (userMessage: string, intent: string, sentiment: number): Promise<string> => {
    // Simulate AI processing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);

    switch (intent) {
      case 'pricing_inquiry':
        return `**Pricing Overview for Medical Practices:**

🏥 **Foundation Tier:** $15K-25K
• Custom React website + AI chatbot
• Basic automation & social media
• Perfect for single practitioners

⚡ **Acceleration Tier:** $35K-65K  
• Everything above + Custom CRM
• Patient simulators & advanced automation
• Our most popular for growing practices

🚀 **Dominance Tier:** $75K-150K
• Complete AI infrastructure transformation
• Multi-location management
• Custom research agents & predictive analytics

💎 **Enterprise:** $200K+
• Multi-practice AI networks
• Market intelligence systems
• White-label solutions

**ROI typically 200-400% within 12 months.** Would you like a custom quote for your specific practice?`;

      case 'crm_interest':
        return `**Our Custom CRM is our crown jewel! 👑**

Unlike generic CRMs, ours is built specifically for YOUR practice:

🔗 **Universal Integration:** Connects to ANY system - practice management, billing, labs, imaging, social media, email campaigns
📊 **Infinite Display Options:** Data visualized exactly how YOUR brain processes information  
🧠 **AI Learning:** Gets smarter the longer you use it - predicts patient behavior, optimal treatments, staff scheduling
📈 **Predictive Analytics:** Treatment acceptance probability, patient retention risk, revenue forecasting

**Real Client Results:**
• Dr. Smith saw 35% increase in case acceptance
• Regional dental group reduced admin time by 60%
• Multi-location practice increased revenue 25% in 90 days

The CRM typically identifies $50K-200K in missed revenue opportunities within the first month. Want to see how it would work for your practice?`;

      case 'ai_interest': 
        return `**We're the FIRST agency bringing enterprise AI to medical practices! 🤖**

**Our AI Stack:**
🎤 **Voice Intelligence:** Real-time transcription + sentiment analysis during patient visits
🧠 **Custom Knowledge Bases:** AI trained on YOUR specific procedures, protocols, and patient base  
📞 **Smart Phone Systems:** 24/7 AI receptionist that never calls in sick
💬 **Conversation Intelligence:** Detects patient anxiety, payment concerns, treatment readiness
🔄 **Automated Workflows:** From lead to treatment completion

**What makes us different:**
• Medical-specific AI training (not generic chatbots)
• HIPAA-compliant infrastructure built for healthcare
• Custom knowledge bases that improve over time
• Integration with all medical practice systems

**Example:** Our AI can listen to patient consultations, auto-generate notes, detect anxiety levels, and trigger personalized follow-ups. Want to see this in action?`;

      case 'phone_system_interest':
        return `**The Phone System That Never Sleeps! 📞**

**Revolutionary Features:**
🎯 **100% Call Coverage:** Every call transcribed and analyzed in real-time
🤖 **AI Booking:** Natural conversation appointment scheduling 24/7
📈 **Smart Routing:** High-value patients → Senior staff, Emergency → Immediate triage
📊 **Call Analytics:** Sentiment analysis, conversion tracking, staff coaching insights
🎤 **Voice-Activated Management:** Doctors update notes by voice during patient visits

**Real Results:**
• 40% increase in after-hours bookings
• 25% reduction in no-shows through AI optimization  
• 60% improvement in call-to-appointment conversion
• Staff save 2+ hours daily on documentation

**Pricing:** $8K-65K depending on practice size and features

The system pays for itself within 60 days typically. Ready to eliminate missed calls forever?`;

      case 'simulator_interest':
        return `**Our Simulation Tools = 40-60% Higher Case Acceptance! ✨**

**Custom Simulators We Build:**
👥 **Facial Aesthetic Simulation:** Before/after visualization for Botox, fillers, procedures
🦷 **Dental Implant Visualizer:** 3D treatment planning and patient education
💰 **Real-Time Cost Calculator:** Dynamic pricing based on treatment complexity
📚 **Patient Education Suite:** Animated procedure explanations

**Integration Magic:**
• Data flows directly into your CRM for tracking
• Automatic follow-up triggers based on simulation engagement
• Insurance pre-authorization integration
• Mobile-friendly for patient take-home access

**Client Success:**
"The simulator gives patients the push they need to move forward - it easily pays for itself" - Dr. Martinez

**Pricing:** Included in Acceleration Tier ($35K+) or $15K standalone

Want to see how a smile simulator would work with your patient flow?`;

      case 'demo_request':
        return `**Let's Schedule Your Custom Demo! 📅**

**What We'll Show You:**
🎯 **Live CRM Build:** Using your actual practice data
💻 **Real-Time Integration:** Connect to your current systems  
📊 **Custom Dashboard Creation:** Designed for how you think
🤖 **AI Capabilities:** Voice transcription, sentiment analysis in action
📞 **Phone System Demo:** Hear our AI handle actual patient calls

**Demo Options:**
• **30-min Overview:** Perfect for initial exploration
• **60-min Deep Dive:** Technical demonstration with your data
• **On-Site Visit:** Full practice assessment + live integration

**Next Steps:**
1. 15-min qualification call (determines best demo type)
2. Custom demo preparation using your practice details  
3. Live demonstration with your team
4. Custom proposal with ROI projections

**Available:** Mon-Fri 9AM-6PM EST, Saturdays by appointment

Ready to see what your practice could become? What's your preferred day/time?`;

      default:
        if (sentiment < 0.3) {
          return `I understand your concerns! 💙 

Let me address what might be worrying you:

**"Too Expensive?"** Our systems typically pay for themselves within 60-90 days through increased efficiency and revenue.

**"Too Complex?"** We handle everything - from setup to training to ongoing support. Your team focuses on patients, we handle the tech.

**"Not Sure It Will Work?"** We offer performance guarantees and can show you exactly how it will work with your current systems before you commit.

**Risk-Free Approach:**
1. Free practice assessment
2. Custom demo with your data  
3. 30-day pilot program option
4. Performance-based pricing available

What specific concerns can I address for you?`;
        }
        
        return `Thanks for your question! 😊

**Here's how I can help:**
💰 Ask about **pricing** for different service tiers
🏥 Learn about our **custom CRM** systems  
🤖 Discover our **AI infrastructure** capabilities
📞 Explore our **smart phone systems**
✨ See our **patient simulators** in action
📅 **Schedule a demo** to see everything live

**Quick Fact:** We're the only agency offering true custom infrastructure for medical practices - no templates, everything built specifically for YOUR workflow.

What interests you most? Or would you prefer to schedule a quick 15-minute call to discuss your specific needs?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const intent = analyzeIntent(inputValue);
    const sentiment = analyzeSentiment(inputValue);
    setUserSentiment(sentiment);

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response
    const responseText = await generateResponse(inputValue, intent, sentiment);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      intent,
      sentiment
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-green-500';
    if (sentiment >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 0.7) return '😊';
    if (sentiment >= 0.4) return '😐';
    return '😟';
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 font-sans`}>
      {/* Chat Widget */}
      {isOpen && (
        <div 
          className={`mb-4 bg-white rounded-2xl shadow-2xl border transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          }`}
          style={{ borderColor: primaryColor }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 rounded-t-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #0066cc 100%)` }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">Bowery Creative AI</div>
                <div className="text-xs opacity-90 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Online • Medical Practice AI Specialist
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userSentiment !== 0.5 && (
                <span className="text-lg" title={`Sentiment: ${userSentiment.toFixed(1)}`}>
                  {getSentimentIcon(userSentiment)}
                </span>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[480px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white ml-4'
                          : 'bg-white text-gray-800 border mr-4'
                      }`}
                    >
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ 
                          __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/🏥|⚡|🚀|💎|👑|🔗|📊|🧠|📈|🤖|🎤|🧠|📞|💬|🔄|🎯|📈|🎤|📊|👥|🦷|💰|📚|📅|💻|🤖|💙/g, '<span style="font-size: 1.1em;">$&</span>')
                        }}
                      />
                      {message.intent && (
                        <div className="text-xs mt-2 opacity-70">
                          Intent: {message.intent.replace('_', ' ')}
                          {message.sentiment && (
                            <span className={`ml-2 ${getSentimentColor(message.sentiment)}`}>
                              • Sentiment: {(message.sentiment * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white border rounded-2xl p-3 mr-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t bg-gray-50">
                <div className="flex space-x-2 text-xs">
                  <button 
                    onClick={() => setInputValue('Tell me about your CRM systems')}
                    className="px-2 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    CRM
                  </button>
                  <button 
                    onClick={() => setInputValue('What are your pricing tiers?')}
                    className="px-2 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Pricing
                  </button>
                  <button 
                    onClick={() => setInputValue('Schedule a demo')}
                    className="px-2 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Demo
                  </button>
                  <button 
                    onClick={() => setInputValue('Tell me about AI phone systems')}
                    className="px-2 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Phone AI
                  </button>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-white rounded-b-2xl">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about CRM, AI systems, pricing..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #0066cc 100%)` }}
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <>
            <div className="relative">
              <Brain className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </>
        )}
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            <Zap className="w-3 h-3" />
          </div>
        )}
      </button>

      {/* Floating Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Hi! I'm your AI assistant for medical practice automation 👋
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-black transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};