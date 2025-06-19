import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
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

// Payment & Admin imports
import { LoginPage } from './components/auth/LoginPage';
import { PaymentPage } from './components/payment/PaymentPage';
import { PaymentSuccess } from './components/payment/PaymentSuccess';
import { PaymentCancel } from './components/payment/PaymentCancel';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ClientManagementEnhanced from './components/ClientManagementEnhanced';
import { ClientManagementCosmic } from './components/ClientManagementCosmic';
import { InvoiceManagement } from './components/InvoiceManagement';
import { Billing } from './components/Billing';
import { Dashboard } from './components/Dashboard';
import { DashboardCosmic } from './components/DashboardCosmic';
import { AuthProvider as AuthProviderPayments } from './contexts/AuthContextPayments';
import { AuthCallback } from './components/auth/AuthCallback';
import { AdminLayout } from './components/layout/AdminLayout';

// Homepage component
const Homepage = () => (
  <>
    <Navigation />
    <main className="relative">
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


function App() {
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

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthProviderPayments>
          <Router>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<LoginPage />} />
            
            {/* Auth callback route */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Payment routes */}
            <Route path="/pay" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <DashboardCosmic />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ClientManagementCosmic />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute>
                <AdminLayout>
                  <InvoiceManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Billing />
                </AdminLayout>
              </ProtectedRoute>
            } />
            </Routes>
          </Router>
        </AuthProviderPayments>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;