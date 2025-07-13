import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  AutoAwesome,
  Schedule,
  ContentCopy,
} from '@mui/icons-material';

const ContentStudio: React.FC = () => {
  const [formData, setFormData] = useState({
    content_type: 'social_post',
    topic: '',
    platform: 'instagram',
    tone: 'professional',
    length: 'medium',
  });
  
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const contentTypes = [
    { value: 'social_post', label: 'Social Media Post' },
    { value: 'email', label: 'Email Campaign' },
    { value: 'blog', label: 'Blog Article' },
    { value: 'ad_copy', label: 'Advertisement Copy' },
    { value: 'newsletter', label: 'Newsletter' },
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'email', label: 'Email' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'caring', label: 'Caring & Empathetic' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'inspiring', label: 'Inspiring' },
  ];

  const lengths = [
    { value: 'short', label: 'Short (1-2 sentences)' },
    { value: 'medium', label: 'Medium (3-5 sentences)' },
    { value: 'long', label: 'Long (6+ sentences)' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const generateContent = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic for your content');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // This would connect to your Mission Control API
      const response = await fetch('https://bowerycreative-backend.onrender.com/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'zaSS35rFh9co5lWYpSlnCrKQ9IhHbApKhmbBGd9Aj2Y=',
          'X-Client-ID': '662dc35e-9429-4e1b-8b2f-88e78f275981', // Dr. Smith's client ID
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      console.error('Content generation error:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const recentGenerations = [
    {
      type: 'Instagram Post',
      topic: 'Mental Health Awareness',
      platform: 'Instagram',
      timestamp: '2 hours ago',
    },
    {
      type: 'Email Campaign',
      topic: 'Preventive Care Reminder',
      platform: 'Email',
      timestamp: '5 hours ago',
    },
    {
      type: 'LinkedIn Post',
      topic: 'New Medical Technology',
      platform: 'LinkedIn',
      timestamp: '1 day ago',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Content Studio
      </Typography>

      <Grid container spacing={3}>
        {/* Content Generator */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AutoAwesome sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">AI Content Generator</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Content Type"
                  value={formData.content_type}
                  onChange={(e) => handleInputChange('content_type', e.target.value)}
                >
                  {contentTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Platform"
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                >
                  {platforms.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tone"
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                >
                  {tones.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Length"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                >
                  {lengths.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Topic / Content Brief"
                  placeholder="e.g., Benefits of regular health checkups for preventing chronic diseases"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesome />}
                  onClick={generateContent}
                  disabled={isGenerating}
                  sx={{ mr: 2 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {/* Generated Content */}
          {generatedContent && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Generated Content</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={copyToClipboard}
                    sx={{ mr: 1 }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Schedule />}
                  >
                    Schedule
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  minHeight: 150,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                }}
              >
                {generatedContent}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`${formData.content_type} • ${formData.platform}`} size="small" />
                <Chip label={formData.tone} size="small" variant="outlined" />
                <Chip label={formData.length} size="small" variant="outlined" />
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Templates */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Templates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Health tips for winter',
                'Appointment reminder',
                'New service announcement',
                'Patient testimonial share',
                'Preventive care importance',
              ].map((template, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleInputChange('topic', template)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {template}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* Recent Generations */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Generations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentGenerations.map((item, index) => (
                <Card key={index} variant="outlined" sx={{ cursor: 'pointer' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {item.topic}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={item.platform} size="small" />
                      <Typography variant="caption" color="textSecondary">
                        {item.timestamp}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContentStudio;