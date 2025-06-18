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
import { CosmicWelcome } from './components/CosmicWelcome';
import { AuthProvider } from './contexts/AuthContext';
import { trackPageView } from './lib/analytics';

type LegalDocumentType = 'privacy' | 'terms' | null;

function MarketingSite({ onOpenLegal }: { onOpenLegal: (type: LegalDocumentType) => void }) {
  return (
    <>
      <Navigation />
      <main className="relative">
        <CosmicWelcome />
        <Hero />
        <Capabilities />
        <Showcase />
        <Technology />
        <Process />
        <About />
        <Insights />
        <Contact />
      </main>
      <Footer />
      <AudioToggle />
    </>
  );
}

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
    
    // Listen for popstate events
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleOpenLegal = (documentType: LegalDocumentType) => {
    setLegalModal({ isOpen: true, documentType });
  };

  const handleCloseLegal = () => {
    setLegalModal({ isOpen: false, documentType: null });
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <MarketingSite onOpenLegal={handleOpenLegal} />
        
        <LegalModal
          isOpen={legalModal.isOpen}
          documentType={legalModal.documentType}
          onClose={handleCloseLegal}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;