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
import AuthCallback from './components/auth/AuthCallback';
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Elements stripe={stripePromise}>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
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
    </ThemeProvider>
  );
}

export default App