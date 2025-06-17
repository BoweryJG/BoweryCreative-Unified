import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Check,
  Star,
  Bolt,
  Rocket,
} from '@mui/icons-material';
import { colors } from '../../theme/theme';
import { createCheckoutSession } from '../../services/stripe';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small practices getting started',
    monthlyPrice: 99,
    annualPrice: 950,
    icon: <Star sx={{ fontSize: 28 }} />,
    color: colors.racingSilver,
    features: [
      { name: '25 campaigns per month', included: true },
      { name: 'Basic templates', included: true },
      { name: 'Email support', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Custom branding', included: false },
      { name: 'Advanced AI features', included: false },
      { name: 'Priority support', included: false },
      { name: 'API access', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing practices and agencies',
    monthlyPrice: 299,
    annualPrice: 2990,
    popular: true,
    icon: <Bolt sx={{ fontSize: 28 }} />,
    color: colors.champagne,
    features: [
      { name: '100 campaigns per month', included: true },
      { name: 'Premium templates', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced AI features', included: true },
      { name: 'A/B testing', included: true },
      { name: 'API access', included: false },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For large agencies and enterprise clients',
    monthlyPrice: 999,
    annualPrice: 9990,
    icon: <Rocket sx={{ fontSize: 28 }} />,
    color: colors.electric,
    features: [
      { name: 'Unlimited campaigns', included: true },
      { name: 'All templates', included: true },
      { name: 'White-label solution', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced AI features', included: true },
      { name: 'A/B testing', included: true },
      { name: 'Full API access', included: true },
    ],
  },
];

interface PlanCardProps {
  plan: Plan;
  isAnnual: boolean;
  onSelect: (planId: string) => void;
  currentPlan?: string;
  loading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isAnnual, onSelect, currentPlan, loading }) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const monthlyPrice = isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
  const savings = isAnnual ? ((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12) * 100) : 0;
  const isCurrent = currentPlan === plan.id;

  return (
    <Card
      sx={{
        position: 'relative',
        background: plan.popular
          ? `linear-gradient(135deg, ${plan.color}10 0%, ${colors.carbon} 50%)`
          : colors.carbon,
        border: plan.popular
          ? `2px solid ${plan.color}`
          : `1px solid ${colors.graphite}`,
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: plan.color,
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 30px ${plan.color}20`,
        },
      }}
    >
      {plan.popular && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(90deg, ${plan.color}, ${plan.color}cc)`,
            py: 0.5,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colors.obsidian,
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Most Popular
          </Typography>
        </Box>
      )}

      <CardContent sx={{ p: 3, pt: plan.popular ? 4 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}10)`,
              border: `2px solid ${plan.color}40`,
              mb: 2,
            }}
          >
            <Box sx={{ color: plan.color }}>
              {plan.icon}
            </Box>
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: colors.arctic,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {plan.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.racingSilver,
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            {plan.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
              <Typography
                variant="h3"
                sx={{
                  color: plan.color,
                  fontWeight: 800,
                  fontSize: '2.5rem',
                }}
              >
                ${Math.round(monthlyPrice)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.racingSilver,
                  fontWeight: 500,
                }}
              >
                /month
              </Typography>
            </Box>
            
            {isAnnual && savings > 0 && (
              <Chip
                label={`Save ${Math.round(savings)}%`}
                size="small"
                sx={{
                  background: `${colors.electric}20`,
                  color: colors.electric,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mt: 1,
                }}
              />
            )}
            
            {isAnnual && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.racingSilver,
                  display: 'block',
                  mt: 1,
                }}
              >
                Billed annually (${price.toLocaleString()})
              </Typography>
            )}
          </Box>
        </Box>

        <List sx={{ mb: 3, flex: 1 }}>
          {plan.features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Check
                  sx={{
                    fontSize: 18,
                    color: feature.included ? plan.color : colors.graphite,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={feature.name}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  color: feature.included ? colors.arctic : colors.racingSilver,
                  sx: { opacity: feature.included ? 1 : 0.6 },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          fullWidth
          variant={isCurrent ? 'outlined' : 'contained'}
          disabled={isCurrent || loading}
          onClick={() => onSelect(plan.id)}
          sx={{
            py: 1.5,
            background: isCurrent ? 'transparent' : (plan.popular ? plan.color : colors.champagne),
            color: isCurrent ? plan.color : (plan.popular ? colors.obsidian : colors.obsidian),
            borderColor: plan.color,
            fontWeight: 700,
            fontSize: '0.9rem',
            '&:hover': {
              background: isCurrent ? `${plan.color}10` : (plan.popular ? '#e4c547' : '#e4c547'),
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              color: plan.color,
              borderColor: plan.color,
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? <CircularProgress size={20} /> : (isCurrent ? 'Current Plan' : `Choose ${plan.name}`)}
        </Button>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlans: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentPlan] = useState('professional'); // Mock current plan
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (planId: string) => {
    try {
      setLoading(true);
      await createCheckoutSession(planId, isAnnual);
    } catch (error) {
      console.error('Error selecting plan:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.arctic,
            fontWeight: 700,
            mb: 2,
          }}
        >
          Choose Your Plan
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.racingSilver,
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Select the perfect plan for your practice. Upgrade or downgrade at any time with no commitments.
        </Typography>

        <Paper
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            p: 1,
            background: colors.carbon,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isAnnual ? colors.racingSilver : colors.arctic,
              fontWeight: 600,
            }}
          >
            Monthly
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: colors.champagne,
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: colors.graphite,
                  },
                  '& .Mui-checked .MuiSwitch-thumb': {
                    backgroundColor: colors.champagne,
                  },
                  '& .Mui-checked + .MuiSwitch-track': {
                    backgroundColor: `${colors.champagne}40 !important`,
                  },
                }}
              />
            }
            label=""
            sx={{ m: 0 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: isAnnual ? colors.arctic : colors.racingSilver,
                fontWeight: 600,
              }}
            >
              Annual
            </Typography>
            <Chip
              label="Save 20%"
              size="small"
              sx={{
                background: `${colors.electric}20`,
                color: colors.electric,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 3, mb: 6 }}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            onSelect={handlePlanSelect}
            currentPlan={currentPlan}
            loading={loading}
          />
        ))}
      </Box>

      {/* Enterprise CTA */}
      <Paper
        sx={{
          p: 4,
          background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.graphite}40 100%)`,
          border: `1px solid ${colors.graphite}`,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: colors.arctic,
            fontWeight: 600,
            mb: 2,
          }}
        >
          Need a Custom Solution?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.racingSilver,
            mb: 3,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          For enterprise customers with specific requirements, we offer custom pricing and features tailored to your needs.
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: colors.champagne,
            color: colors.champagne,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              borderColor: colors.champagne,
              background: `${colors.champagne}10`,
            },
          }}
        >
          Contact Sales
        </Button>
      </Paper>
    </Box>
  );
};