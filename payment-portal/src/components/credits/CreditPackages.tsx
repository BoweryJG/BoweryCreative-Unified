import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  Star,
  Bolt,
  Rocket,
  Diamond,
} from '@mui/icons-material';
import { colors } from '../../theme/theme';
import { createCheckoutSession, PRODUCTS } from '../../lib/stripe';

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  savings?: string;
  description: string;
}

const packages: CreditPackage[] = [
  {
    id: '10',
    credits: 10,
    price: 29,
    originalPrice: 39,
    icon: <Star sx={{ fontSize: 28 }} />,
    color: colors.racingSilver,
    savings: '25% off',
    description: 'Perfect for trying out campaigns',
  },
  {
    id: '50',
    credits: 50,
    price: 99,
    originalPrice: 149,
    popular: true,
    icon: <Bolt sx={{ fontSize: 28 }} />,
    color: colors.champagne,
    savings: '33% off',
    description: 'Most popular for growing practices',
  },
  {
    id: '100',
    credits: 100,
    price: 199,
    originalPrice: 299,
    icon: <Rocket sx={{ fontSize: 28 }} />,
    color: colors.electric,
    savings: '33% off',
    description: 'Great value for busy practices',
  },
  {
    id: '500',
    credits: 500,
    price: 799,
    originalPrice: 1199,
    icon: <Diamond sx={{ fontSize: 28 }} />,
    color: '#ff6b6b',
    savings: '33% off',
    description: 'Maximum value for agencies',
  },
];

interface PackageCardProps {
  package: CreditPackage;
  onPurchase: (packageId: string) => void;
  loading?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onPurchase, loading }) => {
  const pricePerCredit = pkg.price / pkg.credits;
  const originalPricePerCredit = pkg.originalPrice ? pkg.originalPrice / pkg.credits : null;

  return (
    <Card
      sx={{
        position: 'relative',
        background: pkg.popular
          ? `linear-gradient(135deg, ${pkg.color}10 0%, ${colors.carbon} 50%)`
          : colors.carbon,
        border: pkg.popular
          ? `2px solid ${pkg.color}`
          : `1px solid ${colors.graphite}`,
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: pkg.color,
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 30px ${pkg.color}20`,
        },
      }}
    >
      {pkg.popular && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(90deg, ${pkg.color}, ${pkg.color}cc)`,
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
            Best Value
          </Typography>
        </Box>
      )}

      <CardContent sx={{ p: 3, pt: pkg.popular ? 4 : 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${pkg.color}20, ${pkg.color}10)`,
              border: `2px solid ${pkg.color}40`,
              mb: 2,
            }}
          >
            <Box sx={{ color: pkg.color }}>
              {pkg.icon}
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: colors.arctic,
              fontWeight: 800,
              mb: 1,
            }}
          >
            {pkg.credits}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: colors.racingSilver,
              fontWeight: 500,
              mb: 1,
            }}
          >
            Campaign Credits
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.racingSilver,
              mb: 3,
              lineHeight: 1.5,
              minHeight: '2.5em',
            }}
          >
            {pkg.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5, mb: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  color: pkg.color,
                  fontWeight: 800,
                  fontSize: '2.5rem',
                }}
              >
                ${pkg.price}
              </Typography>
            </Box>

            {pkg.savings && (
              <Chip
                label={pkg.savings}
                size="small"
                sx={{
                  background: `${colors.electric}20`,
                  color: colors.electric,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mb: 1,
                }}
              />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.racingSilver,
                  fontSize: '0.875rem',
                }}
              >
                ${pricePerCredit.toFixed(2)} per credit
              </Typography>
              {originalPricePerCredit && (
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.racingSilver,
                    fontSize: '0.75rem',
                    textDecoration: 'line-through',
                    opacity: 0.6,
                  }}
                >
                  ${originalPricePerCredit.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: `linear-gradient(135deg, ${colors.graphite}20, transparent)`,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.arctic,
              fontWeight: 600,
              mb: 1,
              textAlign: 'center',
            }}
          >
            What's Included
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.racingSilver,
                fontSize: '0.875rem',
              }}
            >
              • Full access to Campaign Marketplace
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.racingSilver,
                fontSize: '0.875rem',
              }}
            >
              • AI-powered personalization
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.racingSilver,
                fontSize: '0.875rem',
              }}
            >
              • Advanced analytics & tracking
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.racingSilver,
                fontSize: '0.875rem',
              }}
            >
              • No expiration date
            </Typography>
          </Box>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={() => onPurchase(pkg.id)}
          sx={{
            py: 1.5,
            background: pkg.color,
            color: pkg.color === colors.champagne ? colors.obsidian : colors.obsidian,
            fontWeight: 700,
            fontSize: '0.9rem',
            position: 'relative',
            '&:hover': {
              background: pkg.color === colors.champagne ? '#e4c547' : pkg.color,
              transform: 'translateY(-1px)',
              boxShadow: `0 8px 25px ${pkg.color}40`,
            },
            '&:disabled': {
              background: colors.graphite,
              color: colors.racingSilver,
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'inherit' }} />
          ) : (
            `Purchase ${pkg.credits} Credits`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export const CreditPackages: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    try {
      const { url } = await createCheckoutSession({
        productType: 'credits',
        productId: PRODUCTS.credits[packageId as '10' | '50' | '100' | '500'],
        quantity: 1,
        metadata: {
          credits: packageId,
        },
      });

      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      // TODO: Show error toast
    } finally {
      setLoading(null);
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
          Campaign Credits
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
          Purchase campaign credits to access our premium templates and AI-powered marketing campaigns. Credits never expire and can be used across all campaign types.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3, mb: 6 }}>
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onPurchase={handlePurchase}
            loading={loading === pkg.id}
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <CreditCard sx={{ color: colors.champagne, fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{
              color: colors.arctic,
              fontWeight: 600,
            }}
          >
            Need More Credits?
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: colors.racingSilver,
            mb: 3,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          For high-volume users, we offer custom credit packages with additional discounts and dedicated support.
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