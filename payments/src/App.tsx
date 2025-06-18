import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubscriptionPlans } from './components/subscriptions/SubscriptionPlans';
import { CreditPackages } from './components/credits/CreditPackages';
import { SimpleAdminDashboard } from './components/admin/SimpleAdminDashboard';
import { LoginPage } from './components/auth/LoginPage';
import ClientManagementEnhanced from './components/ClientManagementEnhanced';
import { InvoiceManagement } from './components/InvoiceManagement';
import { BoweryCreativeChatbot } from './components/BoweryCreativeChatbot';
import AuthCallback from './components/auth/AuthCallback';
import { CosmicOnboarding } from './components/CosmicOnboarding';
import { HomePage } from './components/HomePage';
import { PaymentPage } from './components/PaymentPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentCancel } from './components/PaymentCancel';
import { theme } from './theme/theme';
import { stripePromise } from './lib/stripe';

// Dashboard container that handles internal navigation
function DashboardContainer() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isAdmin } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return <SubscriptionPlans />;
      case 'credits':
        return <CreditPackages />;
      case 'clients':
        return isAdmin ? <ClientManagementEnhanced /> : <Navigate to="/dashboard" replace />;
      case 'invoices':
        return isAdmin ? <InvoiceManagement /> : <Navigate to="/dashboard" replace />;
      case 'payments':
        return <div>Payment History - Coming Soon</div>;
      case 'settings':
        return <div>Settings - Coming Soon</div>;
      case 'admin':
        return isAdmin ? <SimpleAdminDashboard /> : <Navigate to="/dashboard" replace />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Elements stripe={stripePromise}>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin-login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Cosmic onboarding route */}
              <Route 
                path="/onboarding" 
                element={
                  <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
                    <CosmicOnboarding onClose={() => window.location.href = '/'} />
                  </div>
                } 
              />
              
              {/* Payment routes */}
              <Route path="/pay" element={<PaymentPage />} />
              <Route path="/pay/:invoiceId" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardContainer />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Elements>
      </Router>
      
      {/* Floating Chatbot */}
      <BoweryCreativeChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        onOpen={() => setShowChatbot(true)}
      />
    </ThemeProvider>
  );
}

export default App