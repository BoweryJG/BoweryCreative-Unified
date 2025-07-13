const SUPABASE_URL = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

async function updateEmail() {
  console.log('Updating Dr. Greg Pedro email to gcpedro2018@gmail.com...');
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/invoices?client_name=eq.Dr. Greg Pedro`, {
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

  const data = await response.json();
  console.log('Response:', data);
}

updateEmail();
