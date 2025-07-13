-- Update Dr. Greg Pedro's email in the invoices table
UPDATE invoices 
SET client_email = 'gcpedro2018@gmail.com'
WHERE client_name = 'Dr. Greg Pedro';
