import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { CheckCircle, Dashboard } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceId = searchParams.get('invoice');
  const submissionId = searchParams.get('submissionId');

  useEffect(() => {
    // Update submission status if submissionId is present
    if (submissionId) {
      updateSubmissionStatus();
    }
  }, [submissionId]);

  const updateSubmissionStatus = async () => {
    try {
      // Update submission status to paid
      const { error: updateError } = await supabase
        .from('onboarding_submissions')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Error updating submission:', updateError);
      }

      // Get submission data for notification
      const { data: submission } = await supabase
        .from('onboarding_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (submission) {
        // Send notification email to admin
        try {
          const { error: emailError } = await supabase.functions.invoke('send-email', {
            body: {
              to: 'jgolden@bowerycreativeagency.com',
              subject: 'Payment Completed - New Client Onboarded',
              html: `
                <h2>Payment Completed Successfully!</h2>
                <p><strong>Practice:</strong> ${submission.practice_name}</p>
                <p><strong>Email:</strong> ${submission.email}</p>
                <p><strong>Form Data:</strong></p>
                <pre>${JSON.stringify(submission.form_data, null, 2)}</pre>
                <hr>
                <p>This client has completed payment and is ready for onboarding.</p>
                <p><a href="https://bowerycreativeagency.com/admin">View in Dashboard</a></p>
              `
            }
          });

          if (emailError) {
            console.error('Error sending notification:', emailError);
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: 4,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.98)',
        }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Thank you for your payment. Your invoice has been marked as paid.
            {invoiceId && ` Invoice ID: ${invoiceId}`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Dashboard />}
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                }
              }}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};