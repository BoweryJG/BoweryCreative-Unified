import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LegalModal } from './components/LegalModal';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { Showcase } from './components/Showcase';
import { Technology } from './components/Technology';
import { Process } from './components/Process';
import { About } from './components/About';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AudioToggle } from './components/AudioToggle';
import { AuthProvider } from './contexts/AuthContext';
import { trackPageView } from './lib/analytics';

type LegalDocumentType = 'privacy' | 'terms' | null;

function App() {
  const [legalModal, setLegalModal] = useState<{
    isOpen: boolean;
    documentType: LegalDocumentType;
  }>({
    isOpen: false,
    documentType: null,
  });

  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname);

    // Track navigation changes
    const handleLocationChange = () => {
      trackPageView(window.location.pathname);
    };

    // Handle legal document links
    const handleLegalLinks = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href === '#privacy-policy') {
          e.preventDefault();
          setLegalModal({ isOpen: true, documentType: 'privacy' });
        } else if (href === '#terms-of-service') {
          e.preventDefault();
          setLegalModal({ isOpen: true, documentType: 'terms' });
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    document.addEventListener('click', handleLegalLinks);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLegalLinks);
    };
  }, []);

  const closeLegalModal = () => {
    setLegalModal({ isOpen: false, documentType: null });
  };

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-obsidian cursor-luxury">
          <ErrorBoundary fallback={<div className="text-center p-8 text-arctic">Navigation temporarily unavailable</div>}>
            <Navigation />
          </ErrorBoundary>
        
        <ErrorBoundary fallback={<div className="h-screen bg-obsidian flex items-center justify-center text-arctic">Hero section loading...</div>}>
          <Hero />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Capabilities />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Showcase />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Technology />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Process />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <About />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Insights />
        </ErrorBoundary>
        
            <ErrorBoundary fallback={<div className="text-center p-8 text-arctic">Contact form temporarily unavailable. Please email us directly.</div>}>
              <Contact />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
            
            {/* Legal Documents Modal */}
            <LegalModal
              isOpen={legalModal.isOpen}
              documentType={legalModal.documentType}
              onClose={closeLegalModal}
            />
            
          {/* Audio Toggle */}
          <AudioToggle />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
