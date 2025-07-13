import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './contexts/AuthContextPayments';
import { HomePage } from './components/HomePage';
import { PaymentPage } from './components/PaymentPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentCancel } from './components/PaymentCancel';
import { SubscriptionPlans } from './components/subscriptions/SubscriptionPlans';
import { CreditPackages } from './components/credits/CreditPackages';
import AuthCallback from './components/auth/AuthCallback';
import { theme } from './theme/theme';
import { stripePromise } from './lib/stripe';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Elements stripe={stripePromise}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Payment Routes */}
              <Route path="/pay/:invoiceId" element={<PaymentPage />} />
              <Route path="/subscribe" element={<SubscriptionPlans />} />
              <Route path="/credits" element={<CreditPackages />} />
              
              {/* Payment Status Routes */}
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/cancel" element={<PaymentCancel />} />
            </Routes>
          </Elements>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;