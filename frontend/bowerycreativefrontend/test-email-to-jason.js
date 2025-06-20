const SUPABASE_URL = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

async function testEmailSending() {
  console.log('Testing email sending to your verified email...');
  
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-invoice-email`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice: {
        invoice_number: 'INV-2025-001',
        client_name: 'Dr. Greg Pedro',
        client_email: 'jasonwilliamgolden@gmail.com', // Using your verified email for testing
        amount_due: 2000,
        due_date: '2025-07-20',
        payment_link: 'https://bowerycreativeagency.com/pay?invoice=INV-2025-001&amount=2000',
        line_items: [
          {
            description: 'Premium AI Infrastructure - June 2025',
            amount: 2000
          }
        ]
      }
    })
  });

  const data = await response.json();
  console.log('Response:', data);
}

testEmailSending();
