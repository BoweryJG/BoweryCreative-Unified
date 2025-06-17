import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from '@mui/material';
import {
  CheckCircleOutline,
  CreditCard,
  Subscriptions,
  Work,
  AttachMoney,
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentModalProps,
  PaymentOption,
  SubscriptionPlan,
  CreditPackage,
  ServicePackage,
  CustomPaymentForm,
} from './types';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  clientId,
  clientEmail,
  onSuccess,
  preselectedOption,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(preselectedOption || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customForm, setCustomForm] = useState<CustomPaymentForm>({
    projectName: '',
    projectDescription: '',
    amount: 0,
  });

  // Subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'starter_monthly',
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      price: 299,
      currency: 'usd',
      type: 'subscription',
      interval: 'monthly',
      features: [
        'Up to 5 campaigns',
        'Basic analytics',
        'Email support',
        '1 team member',
      ],
    },
    {
      id: 'professional_monthly',
      name: 'Professional',
      description: 'For growing businesses that need more power',
      price: 599,
      currency: 'usd',
      type: 'subscription',
      interval: 'monthly',
      popular: true,
      features: [
        'Unlimited campaigns',
        'Advanced analytics',
        'Priority support',
        'Up to 5 team members',
        'Custom branding',
      ],
    },
    {
      id: 'agency_monthly',
      name: 'Agency',
      description: 'For agencies managing multiple clients',
      price: 1299,
      currency: 'usd',
      type: 'subscription',
      interval: 'monthly',
      features: [
        'Everything in Professional',
        'White-label options',
        'Dedicated account manager',
        'Unlimited team members',
        'API access',
        'Custom integrations',
      ],
    },
  ];

  // Credit packages
  const creditPackages: CreditPackage[] = [
    {
      id: 'credits_10',
      name: '10 Credits',
      description: 'Small package for testing campaigns',
      price: 99,
      currency: 'usd',
      type: 'credits',
      creditAmount: 10,
      pricePerCredit: 9.9,
    },
    {
      id: 'credits_50',
      name: '50 Credits',
      description: 'Medium package with 10% discount',
      price: 449,
      currency: 'usd',
      type: 'credits',
      creditAmount: 50,
      pricePerCredit: 8.98,
    },
    {
      id: 'credits_100',
      name: '100 Credits',
      description: 'Large package with 20% discount',
      price: 799,
      currency: 'usd',
      type: 'credits',
      creditAmount: 100,
      pricePerCredit: 7.99,
    },
    {
      id: 'credits_500',
      name: '500 Credits',
      description: 'Enterprise package with 30% discount',
      price: 3499,
      currency: 'usd',
      type: 'credits',
      creditAmount: 500,
      pricePerCredit: 6.99,
    },
  ];

  // Service packages
  const servicePackages: ServicePackage[] = [
    {
      id: 'website_redesign',
      name: 'Website Redesign',
      description: 'Complete website overhaul with modern design',
      price: 4999,
      currency: 'usd',
      type: 'service',
      estimatedDuration: '4-6 weeks',
      deliverables: [
        'Modern responsive design',
        'SEO optimization',
        'Performance improvements',
        'Content migration',
      ],
    },
    {
      id: 'branding_package',
      name: 'Branding Package',
      description: 'Complete brand identity development',
      price: 2999,
      currency: 'usd',
      type: 'service',
      estimatedDuration: '2-3 weeks',
      deliverables: [
        'Logo design',
        'Brand guidelines',
        'Color palette',
        'Typography selection',
        'Business card design',
      ],
    },
    {
      id: 'marketing_setup',
      name: 'Marketing Setup',
      description: 'Complete marketing infrastructure setup',
      price: 1999,
      currency: 'usd',
      type: 'service',
      estimatedDuration: '1-2 weeks',
      deliverables: [
        'Social media setup',
        'Email marketing configuration',
        'Analytics implementation',
        'Initial content strategy',
      ],
    },
  ];

  useEffect(() => {
    if (preselectedOption) {
      setSelectedOption(preselectedOption);
      // Set the appropriate tab based on the preselected option type
      if (preselectedOption.type === 'subscription') setActiveTab(0);
      else if (preselectedOption.type === 'credits') setActiveTab(1);
      else if (preselectedOption.type === 'service') setActiveTab(2);
      else if (preselectedOption.type === 'custom') setActiveTab(3);
    }
  }, [preselectedOption]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSelectedOption(null);
    setError(null);
  };

  const handleCheckout = async () => {
    if (!selectedOption && activeTab !== 3) {
      setError('Please select a payment option');
      return;
    }

    if (activeTab === 3 && (!customForm.projectName || customForm.amount <= 0)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      let checkoutData: any = {
        clientId,
        clientEmail,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      };

      if (activeTab === 3) {
        // Custom payment
        checkoutData = {
          ...checkoutData,
          productType: 'custom',
          metadata: {
            projectName: customForm.projectName,
            projectDescription: customForm.projectDescription,
            amount: Math.round(customForm.amount * 100), // Convert to cents
          },
        };
      } else if (selectedOption) {
        // Standard payment options
        checkoutData = {
          ...checkoutData,
          productType: selectedOption.type,
          productId: selectedOption.id,
          quantity: 1,
        };
      }

      // Call your backend API to create checkout session
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }

      if (onSuccess) {
        onSuccess(sessionId);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  const renderSubscriptionPlans = () => (
    <Grid container spacing={3}>
      {subscriptionPlans.map((plan) => (
        <Grid item xs={12} md={4} key={plan.id}>
          <Card
            variant={selectedOption?.id === plan.id ? 'elevation' : 'outlined'}
            sx={{
              height: '100%',
              position: 'relative',
              cursor: 'pointer',
              border: selectedOption?.id === plan.id ? 2 : 1,
              borderColor: selectedOption?.id === plan.id ? 'primary.main' : 'divider',
            }}
            onClick={() => setSelectedOption(plan)}
          >
            {plan.popular && (
              <Chip
                label="Most Popular"
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                }}
              />
            )}
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {plan.name}
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                ${plan.price}
                <Typography variant="body2" component="span" color="text.secondary">
                  /{plan.interval}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {plan.description}
              </Typography>
              <List dense>
                {plan.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircleOutline color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderCreditPackages = () => (
    <Grid container spacing={3}>
      {creditPackages.map((pkg) => (
        <Grid item xs={12} sm={6} md={3} key={pkg.id}>
          <Card
            variant={selectedOption?.id === pkg.id ? 'elevation' : 'outlined'}
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: selectedOption?.id === pkg.id ? 2 : 1,
              borderColor: selectedOption?.id === pkg.id ? 'primary.main' : 'divider',
            }}
            onClick={() => setSelectedOption(pkg)}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {pkg.creditAmount} Credits
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${pkg.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${pkg.pricePerCredit.toFixed(2)} per credit
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {pkg.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderServicePackages = () => (
    <RadioGroup
      value={selectedOption?.id || ''}
      onChange={(e) => {
        const selected = servicePackages.find((pkg) => pkg.id === e.target.value);
        setSelectedOption(selected || null);
      }}
    >
      <Grid container spacing={3}>
        {servicePackages.map((service) => (
          <Grid item xs={12} key={service.id}>
            <Card
              variant={selectedOption?.id === service.id ? 'elevation' : 'outlined'}
              sx={{
                border: selectedOption?.id === service.id ? 2 : 1,
                borderColor: selectedOption?.id === service.id ? 'primary.main' : 'divider',
              }}
            >
              <CardContent>
                <FormControlLabel
                  value={service.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ width: '100%' }}>
                      <Grid container justifyContent="space-between" alignItems="flex-start">
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6">{service.name}</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {service.description}
                          </Typography>
                          {service.deliverables && (
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                Deliverables:
                              </Typography>
                              <List dense>
                                {service.deliverables.map((item, index) => (
                                  <ListItem key={index} disableGutters>
                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                      <CheckCircleOutline color="success" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={item} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                          <Typography variant="h4" color="primary">
                            ${service.price.toLocaleString()}
                          </Typography>
                          {service.estimatedDuration && (
                            <Typography variant="body2" color="text.secondary">
                              {service.estimatedDuration}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );

  const renderCustomPayment = () => (
    <Box>
      <Typography variant="body1" paragraph>
        Create a custom payment for a specific project or service.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Name"
            value={customForm.projectName}
            onChange={(e) => setCustomForm({ ...customForm, projectName: e.target.value })}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Description"
            value={customForm.projectDescription}
            onChange={(e) => setCustomForm({ ...customForm, projectDescription: e.target.value })}
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={customForm.amount}
            onChange={(e) => setCustomForm({ ...customForm, amount: parseFloat(e.target.value) || 0 })}
            required
            variant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{
              min: 0,
              step: 0.01,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CreditCard />
          Make a Payment
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<Subscriptions />} label="Subscriptions" />
            <Tab icon={<AttachMoney />} label="Credits" />
            <Tab icon={<Work />} label="Services" />
            <Tab icon={<CreditCard />} label="Custom" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ minHeight: 400 }}>
          {activeTab === 0 && renderSubscriptionPlans()}
          {activeTab === 1 && renderCreditPackages()}
          {activeTab === 2 && renderServicePackages()}
          {activeTab === 3 && renderCustomPayment()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCheckout}
          disabled={loading || (!selectedOption && activeTab !== 3)}
          startIcon={loading ? <CircularProgress size={20} /> : <CreditCard />}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;