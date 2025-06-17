import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AutoAwesome as AIIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  id: string;
  campaign_id: string;
  credits_purchased: number;
  credits_used: number;
  purchase_date: string;
  expires_at: string;
  campaigns: {
    name: string;
    description: string;
    ai_prompt_template: string;
  };
}

interface Recipient {
  email: string;
  name: string;
  customData: Record<string, string>;
}

interface GeneratedEmail {
  id: string;
  recipient_email: string;
  recipient_name: string;
  subject_line: string;
  email_body: string;
  mailto_link: string;
  was_sent: boolean;
  sent_at?: string;
}

const CampaignManager: React.FC = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [emailsOpen, setEmailsOpen] = useState(false);
  const [recipientForm, setRecipientForm] = useState<Recipient>({
    email: '',
    name: '',
    customData: {}
  });

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedEmails = async (purchaseId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchases/${purchaseId}/emails`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
          'x-user-id': user?.id || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedEmails(data);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleAddRecipient = () => {
    if (recipientForm.email && recipientForm.name) {
      setRecipients([...recipients, { ...recipientForm }]);
      setRecipientForm({ email: '', name: '', customData: {} });
    }
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleGenerateEmails = async () => {
    if (!selectedPurchase || recipients.length === 0) return;

    setGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchases/${selectedPurchase.id}/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
            'x-user-id': user?.id || ''
          },
          body: JSON.stringify({ recipients })
        }
      );

      if (response.ok) {
        const emails = await response.json();
        setGeneratedEmails(emails);
        setRecipients([]);
        setGenerateOpen(false);
        setEmailsOpen(true);
        
        // Refresh purchases to update credits
        fetchPurchases();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate emails');
      }
    } catch (error) {
      console.error('Error generating emails:', error);
      alert('Failed to generate emails. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenMailto = (email: GeneratedEmail) => {
    window.location.href = email.mailto_link;
    
    // Mark as sent (in real app, this would update the backend)
    setGeneratedEmails(prev => 
      prev.map(e => e.id === email.id ? { ...e, was_sent: true } : e)
    );
  };

  const handleCopyEmails = () => {
    const emailText = generatedEmails.map(email => 
      `To: ${email.recipient_email}\nSubject: ${email.subject_line}\n\n${email.email_body}\n\n---\n\n`
    ).join('');
    
    navigator.clipboard.writeText(emailText);
    alert('All emails copied to clipboard!');
  };

  const handleDownloadCSV = () => {
    const csv = [
      ['Recipient Email', 'Recipient Name', 'Subject', 'Body', 'Mailto Link'],
      ...generatedEmails.map(email => [
        email.recipient_email,
        email.recipient_name,
        email.subject_line,
        email.email_body.replace(/\n/g, ' '),
        email.mailto_link
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getCreditsRemaining = (purchase: Purchase) => {
    return purchase.credits_purchased - purchase.credits_used;
  };

  const isExpired = (purchase: Purchase) => {
    return new Date(purchase.expires_at) < new Date();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          My Campaigns
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your purchased campaigns and generate personalized emails.
        </Typography>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : purchases.length === 0 ? (
        <Alert severity="info">
          You haven't purchased any campaigns yet. Visit the Campaign Marketplace to get started!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {purchases.map((purchase) => (
            <Grid size={{ xs: 12, md: 6 }} key={purchase.id}>
              <Card 
                sx={{ 
                  opacity: isExpired(purchase) ? 0.6 : 1,
                  position: 'relative'
                }}
              >
                {isExpired(purchase) && (
                  <Chip
                    label="Expired"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                  />
                )}
                
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {purchase.campaigns.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {purchase.campaigns.description}
                  </Typography>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Credits Remaining:
                      </Typography>
                      <Chip 
                        label={`${getCreditsRemaining(purchase)} / ${purchase.credits_purchased}`}
                        color={getCreditsRemaining(purchase) > 0 ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Purchased:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(purchase.purchase_date).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Expires:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color={isExpired(purchase) ? 'error' : 'text.secondary'}
                      >
                        {new Date(purchase.expires_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<AIIcon />}
                      disabled={getCreditsRemaining(purchase) === 0 || isExpired(purchase)}
                      onClick={() => {
                        setSelectedPurchase(purchase);
                        setGenerateOpen(true);
                      }}
                    >
                      Generate Emails
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={() => {
                        setSelectedPurchase(purchase);
                        fetchGeneratedEmails(purchase.id);
                        setEmailsOpen(true);
                      }}
                    >
                      View Emails
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Generate Emails Dialog */}
      <Dialog open={generateOpen} onClose={() => setGenerateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate Personalized Emails</DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">
                  Credits Available: {getCreditsRemaining(selectedPurchase)}
                </Typography>
                <Typography variant="body2">
                  Each recipient will use 1 credit. AI will personalize each email.
                </Typography>
              </Alert>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Add Recipients
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={recipientForm.email}
                  onChange={(e) => setRecipientForm({ ...recipientForm, email: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Name"
                  value={recipientForm.name}
                  onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRecipient}
                  disabled={!recipientForm.email || !recipientForm.name}
                >
                  Add Recipient
                </Button>
              </Stack>

              {recipients.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Recipients ({recipients.length})
                  </Typography>
                  <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                    {recipients.map((recipient, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveRecipient(index)}>
                            <RemoveIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={recipient.name}
                          secondary={recipient.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {recipients.length > getCreditsRemaining(selectedPurchase) && (
                <Alert severity="warning">
                  You have {recipients.length} recipients but only {getCreditsRemaining(selectedPurchase)} credits remaining.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <AIIcon />}
            onClick={handleGenerateEmails}
            disabled={
              generating || 
              recipients.length === 0 || 
              (selectedPurchase ? recipients.length > getCreditsRemaining(selectedPurchase) : false)
            }
          >
            Generate {recipients.length} Email{recipients.length !== 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Emails Dialog */}
      <Dialog open={emailsOpen} onClose={() => setEmailsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Generated Emails</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopyEmails}
                disabled={generatedEmails.length === 0}
              >
                Copy All
              </Button>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadCSV}
                disabled={generatedEmails.length === 0}
              >
                Download CSV
              </Button>
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent>
          {generatedEmails.length === 0 ? (
            <Alert severity="info">
              No emails generated yet for this campaign.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generatedEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{email.recipient_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {email.recipient_email}
                        </Typography>
                      </TableCell>
                      <TableCell>{email.subject_line}</TableCell>
                      <TableCell>
                        {email.was_sent ? (
                          <Chip
                            label="Sent"
                            color="success"
                            size="small"
                            icon={<CheckIcon />}
                          />
                        ) : (
                          <Chip
                            label="Ready"
                            color="default"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Open in Email Client">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenMailto(email)}
                              color="primary"
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Email">
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `To: ${email.recipient_email}\nSubject: ${email.subject_line}\n\n${email.email_body}`
                                );
                              }}
                            >
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignManager;