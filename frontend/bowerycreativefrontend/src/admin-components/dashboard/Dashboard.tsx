import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  CreditCard,
  Subscriptions,
  Payment,
  AccountBalance,
  Schedule,
} from '@mui/icons-material';
import { colors } from '../../theme/theme';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${colors.carbon} 0%, ${colors.graphite}40 100%)`,
      border: `1px solid ${colors.graphite}`,
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
      '&:hover': {
        borderColor: color,
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${color}20`,
      },
      transition: 'all 0.3s ease',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ color: color, opacity: 0.9 }}>
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              background: `${colors.electric}20`,
              color: colors.electric,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: colors.arctic,
          fontWeight: 700,
          mb: 1,
          fontSize: '2rem',
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colors.racingSilver,
          mb: 1,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: colors.racingSilver,
          opacity: 0.8,
        }}
      >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.arctic,
            fontWeight: 600,
            mb: 1,
          }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.racingSilver,
          }}
        >
          Here's your account overview and recent activity
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
        <StatCard
          title="Active Subscription"
          value="Pro Plan"
          subtitle="$299/month"
          icon={<Subscriptions sx={{ fontSize: 28 }} />}
          color={colors.champagne}
          trend="+12%"
        />
        <StatCard
          title="Campaign Credits"
          value="247"
          subtitle="Credits remaining"
          icon={<CreditCard sx={{ fontSize: 28 }} />}
          color={colors.electric}
        />
        <StatCard
          title="Monthly Spend"
          value="$1,247"
          subtitle="This billing cycle"
          icon={<Payment sx={{ fontSize: 28 }} />}
          color="#ff6b6b"
        />
        <StatCard
          title="Next Billing"
          value="Jan 15"
          subtitle="5 days remaining"
          icon={<Schedule sx={{ fontSize: 28 }} />}
          color="#4ecdc4"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Subscription Status */}
        <Card
          sx={{
            background: colors.carbon,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.arctic,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Subscription Details
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ color: colors.arctic, fontWeight: 500 }}
                >
                  Professional Plan
                </Typography>
                <Chip
                  label="Active"
                  sx={{
                    background: `${colors.electric}20`,
                    color: colors.electric,
                    fontWeight: 600,
                  }}
                />
              </Box>
              
              <Typography
                variant="body2"
                sx={{ color: colors.racingSilver, mb: 3 }}
              >
                Full access to Campaign Marketplace, unlimited campaigns, advanced analytics
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: colors.racingSilver }}>
                    Usage this month
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.arctic }}>
                    73 of 100 campaigns
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={73}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: colors.graphite,
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${colors.champagne}, ${colors.electric})`,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: colors.champagne,
                    color: colors.obsidian,
                    '&:hover': {
                      background: '#e4c547',
                    },
                  }}
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: colors.champagne,
                    color: colors.champagne,
                    '&:hover': {
                      borderColor: colors.champagne,
                      background: `${colors.champagne}10`,
                    },
                  }}
                >
                  Manage Billing
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card
          sx={{
            background: colors.carbon,
            border: `1px solid ${colors.graphite}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: colors.arctic,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Quick Actions
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CreditCard />}
                sx={{
                  borderColor: colors.graphite,
                  color: colors.arctic,
                  '&:hover': {
                    borderColor: colors.champagne,
                    background: `${colors.champagne}10`,
                  },
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                Buy Campaign Credits
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<AccountBalance />}
                sx={{
                  borderColor: colors.graphite,
                  color: colors.arctic,
                  '&:hover': {
                    borderColor: colors.champagne,
                    background: `${colors.champagne}10`,
                  },
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                View Invoices
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUp />}
                sx={{
                  borderColor: colors.graphite,
                  color: colors.arctic,
                  '&:hover': {
                    borderColor: colors.champagne,
                    background: `${colors.champagne}10`,
                  },
                  justifyContent: 'flex-start',
                  py: 1.5,
                }}
              >
                Usage Analytics
              </Button>
            </Stack>

            <Divider sx={{ my: 3, borderColor: colors.graphite }} />

            <Paper
              sx={{
                p: 2,
                background: `linear-gradient(135deg, ${colors.champagne}10, transparent)`,
                border: `1px solid ${colors.champagne}40`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: colors.champagne,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                🎯 Pro Tip
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.racingSilver,
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                Purchase credits in bulk to save up to 25% on campaign costs
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};