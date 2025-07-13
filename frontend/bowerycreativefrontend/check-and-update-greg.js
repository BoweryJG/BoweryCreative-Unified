const SUPABASE_URL = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

async function checkAndUpdate() {
  // First, check current invoices
  console.log('Checking current invoices...');
  
  const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/invoices?select=*`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    }
  });
  
  const invoices = await checkResponse.json();
  console.log('Current invoices:', invoices);
  
  // Find Dr. Greg Pedro's invoice
  const gregInvoice = invoices.find(inv => inv.client_name === 'Dr. Greg Pedro');
  
  if (gregInvoice) {
    console.log('Found Dr. Greg Pedro invoice:', gregInvoice.id);
    console.log('Current email:', gregInvoice.client_email);
    
    // Update the email
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/invoices?id=eq.${gregInvoice.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        client_email: 'gcpedro2018@gmail.com'
      })
    });
    
    const updated = await updateResponse.json();
    console.log('Updated invoice:', updated);
  }
}

checkAndUpdate();
