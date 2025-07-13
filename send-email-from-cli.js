const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5001'; // Adjust if your backend runs on a different port
const API_KEY = process.env.EMAIL_API_KEY || 'your-secret-api-key'; // Set this to match your backend

async function sendEmail() {
  const emailData = {
    to: 'test@example.com', // Change this to your recipient
    subject: 'Test Email from CLI',
    text: 'This is a test email sent from the command line!',
    html: '<p>This is a <strong>test email</strong> sent from the command line!</p>'
  };

  try {
    console.log('Sending email to:', emailData.to);
    
    const response = await axios.post(`${API_BASE_URL}/api/emails/send`, emailData, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('Email sent successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Failed to send email:', error.response?.data || error.message);
  }
}

// Run the function
sendEmail();