import { supabase } from '../lib/supabase';

// Function to create recurring invoices
export async function createRecurringInvoices() {
  try {
    const today = new Date();
    
    // Check if it's July 1st or later
    if (today >= new Date('2024-07-01')) {
      // Check if July invoice already exists for Dr. Pedro
      const { data: existingInvoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('client_email', 'greg@gregpedromd.com')
        .eq('invoice_date', '2024-07-01')
        .single();

      if (!existingInvoice) {
        // Create July invoice
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            client_name: 'Dr. Greg Pedro',
            client_email: 'greg@gregpedromd.com',
            invoice_number: 'INV-2024-003',
            invoice_date: '2024-07-01',
            due_date: '2024-07-15',
            amount: 2000,
            status: 'sent'
          })
          .select()
          .single();

        if (!invoiceError && newInvoice) {
          // Create invoice item
          await supabase
            .from('invoice_items')
            .insert({
              invoice_id: newInvoice.id,
              description: 'Professional Plan - July 2024',
              quantity: 1,
              rate: 2000,
              amount: 2000
            });

          console.log('Created July invoice for Dr. Pedro');
        }
      }
    }
  } catch (error) {
    console.error('Error creating recurring invoices:', error);
  }
}

// Function to update invoice status to overdue if past due date
export async function updateOverdueInvoices() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'overdue' })
      .eq('status', 'sent')
      .lt('due_date', today);

    if (!error) {
      console.log('Updated overdue invoices');
    }
  } catch (error) {
    console.error('Error updating overdue invoices:', error);
  }
}