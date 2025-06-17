const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'BoweryCreative Social Media Manager',
    timestamp: new Date().toISOString()
  });
});

// Test magic link endpoint
app.post('/magic/generate', (req, res) => {
  const { email, practiceName } = req.body;
  
  if (!email || !practiceName) {
    return res.status(400).json({ error: 'Email and practice name required' });
  }
  
  // For now, just return success
  res.json({ 
    success: true, 
    message: `Magic link would be sent to ${email} for ${practiceName}`,
    note: 'This is a test response - full implementation coming soon!'
  });
});

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.json({ 
    message: 'BoweryCreative Social Media Manager API',
    endpoints: {
      health: 'GET /health',
      magicLink: 'POST /magic/generate'
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`⚡ Lightning server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});