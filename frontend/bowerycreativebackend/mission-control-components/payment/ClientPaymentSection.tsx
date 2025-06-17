import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  CreditCard,
  Add,
  History,
  AccountBalance,
  TrendingUp,
  Subscriptions,
  ManageAccounts,
} from '@mui/icons-material';
import PaymentModal from './PaymentModal';
import PaymentHistory from './PaymentHistory';
import { PaymentOption } from './types';

interface ClientPaymentSectionProps {
  clientId: string;
  clientEmail: string;
  clientName: string;
}

interface ClientPaymentStats {
  totalSpent: number;
  activeSubscription: {
    name: string;
    status: 'active' | 'cancelled' | 'past_due' | null;
    nextBillingDate?: Date;
    amount?: number;
  } | null;
  creditBalance: number;
  lastPaymentDate?: Date;
}

const ClientPaymentSection: React.FC<ClientPaymentSectionProps> = ({
  clientId,
  clientEmail,
  clientName,
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState<ClientPaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preselectedOption, setPreselectedOption] = useState<PaymentOption | undefined>();

  useEffect(() => {
    fetchClientPaymentStats();
  }, [clientId]);

  const fetchClientPaymentStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/client-stats/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client payment stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching payment stats');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = (option?: PaymentOption) => {
    setPreselectedOption(option);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (sessionId: string) => {
    // Refresh stats after successful payment
    fetchClientPaymentStats();
    setPaymentModalOpen(false);
    // You might want to show a success message here
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ clientId }),
      });

      const { url } = await response.json();
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error creating portal session:', err);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Payment Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="div">
                  Payment Overview
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<History />}
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    {showHistory ? 'Hide' : 'Show'} History
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenPaymentModal()}
                  >
                    New Payment
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Total Spent */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AccountBalance color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      ${stats?.totalSpent ? (stats.totalSpent / 100).toFixed(2) : '0.00'}
                    </Typography>
                    {stats?.lastPaymentDate && (
                      <Typography variant="caption" color="text.secondary">
                        Last payment: {new Date(stats.lastPaymentDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Active Subscription */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Subscriptions color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Subscription
                      </Typography>
                    </Box>
                    {stats?.activeSubscription ? (
                      <>
                        <Typography variant="h6">
                          {stats.activeSubscription.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={stats.activeSubscription.status}
                            size="small"
                            color={stats.activeSubscription.status === 'active' ? 'success' : 'warning'}
                          />
                          {stats.activeSubscription.amount && (
                            <Typography variant="caption" color="text.secondary">
                              ${(stats.activeSubscription.amount / 100).toFixed(2)}/mo
                            </Typography>
                          )}
                        </Box>
                        {stats.activeSubscription.nextBillingDate && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Next billing: {new Date(stats.activeSubscription.nextBillingDate).toLocaleDateString()}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          startIcon={<ManageAccounts />}
                          onClick={handleManageSubscription}
                          sx={{ mt: 1 }}
                        >
                          Manage
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" color="text.secondary">
                          No Active Plan
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenPaymentModal({
                            id: 'subscription',
                            name: 'Choose a Plan',
                            description: 'Select a subscription plan',
                            price: 0,
                            currency: 'usd',
                            type: 'subscription',
                          })}
                          sx={{ mt: 1 }}
                        >
                          Subscribe
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>

                {/* Credit Balance */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TrendingUp color="primary" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Credit Balance
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {stats?.creditBalance || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Campaign credits available
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenPaymentModal({
                        id: 'credits',
                        name: 'Buy Credits',
                        description: 'Purchase campaign credits',
                        price: 0,
                        currency: 'usd',
                        type: 'credits',
                      })}
                      sx={{ mt: 1 }}
                    >
                      Buy Credits
                    </Button>
                  </Box>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" mb={1}>
                      Quick Actions
                    </Typography>
                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenPaymentModal({
                          id: 'service',
                          name: 'Professional Service',
                          description: 'One-time service payment',
                          price: 0,
                          currency: 'usd',
                          type: 'service',
                        })}
                      >
                        Order Service
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenPaymentModal({
                          id: 'custom',
                          name: 'Custom Payment',
                          description: 'Create a custom payment',
                          price: 0,
                          currency: 'usd',
                          type: 'custom',
                        })}
                      >
                        Custom Payment
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment History */}
        {showHistory && (
          <Grid item xs={12}>
            <PaymentHistory clientId={clientId} />
          </Grid>
        )}
      </Grid>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        clientId={clientId}
        clientEmail={clientEmail}
        onSuccess={handlePaymentSuccess}
        preselectedOption={preselectedOption}
      />
    </>
  );
};

export default ClientPaymentSection;