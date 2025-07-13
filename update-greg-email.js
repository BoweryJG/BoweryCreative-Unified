const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEmail() {
  const { data, error } = await supabase
    .from('invoices')
    .update({ client_email: 'gcpedro2018@gmail.com' })
    .eq('client_name', 'Dr. Greg Pedro');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Updated invoice email for Dr. Greg Pedro to gcpedro2018@gmail.com');
    console.log('Affected rows:', data);
  }
}

updateEmail();
