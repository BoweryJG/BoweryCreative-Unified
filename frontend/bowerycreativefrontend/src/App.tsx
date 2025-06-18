import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Admin imports
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SimpleAdminDashboard } from './admin-components/admin/SimpleAdminDashboard';
import { CosmicOnboarding } from './admin-components/CosmicOnboarding';
import { PaymentPage } from './admin-components/PaymentPage';
import { PaymentSuccess } from './admin-components/PaymentSuccess';
import { PaymentCancel } from './admin-components/PaymentCancel';
import { ProtectedRoute } from './admin-components/auth/ProtectedRoute';
import { theme } from './theme/theme';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PNwP6RuBqx4KHEuEJxDZGKfn0LJcqg4gfhFnYRgMF0WBSbaLDMLTjrFmY5LoMb0RcPnPqFAGpLM6vslCcfZPApD00FGOJmoWD');

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
      <Footer onOpenLegal={onOpenLegal} />
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
        <Router>
          <Routes>
            {/* Marketing site */}
            <Route path="/" element={<MarketingSite onOpenLegal={handleOpenLegal} />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                  <ProtectedRoute>
                    <SimpleAdminDashboard />
                  </ProtectedRoute>
                </Elements>
              </ThemeProvider>
            } />
            
            {/* Onboarding */}
            <Route path="/onboarding" element={
              <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
                <CosmicOnboarding onClose={() => window.location.href = '/'} />
              </div>
            } />
            
            {/* Payment routes */}
            <Route path="/pay" element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                  <PaymentPage />
                </Elements>
              </ThemeProvider>
            } />
            <Route path="/pay/:invoiceId" element={
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Elements stripe={stripePromise}>
                  <PaymentPage />
                </Elements>
              </ThemeProvider>
            } />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        
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