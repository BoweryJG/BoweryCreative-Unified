#!/usr/bin/env node

const RESEND_API_KEY = 're_Q7ddNwMN_6728NWvK2fu1jmS9dSFTWwr2';
const DOMAIN = 'bowerycreativeagency.com';

async function addDomain() {
  console.log('Adding domain to Resend...');
  
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: DOMAIN
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error:', data);
      return;
    }

    console.log('\n✅ Domain added successfully!');
    console.log('Domain ID:', data.id);
    console.log('Status:', data.status);
    console.log('\n📋 DNS Records to add:');
    
    if (data.records) {
      data.records.forEach((record, index) => {
        console.log(`\n${index + 1}. ${record.record} Record:`);
        console.log(`   Name: ${record.name}`);
        console.log(`   Value: ${record.value}`);
      });
    }

    console.log('\n🔗 SPF Record (add if not present):');
    console.log('   Type: TXT');
    console.log('   Name: @');
    console.log('   Value: v=spf1 include:_spf.resend.com ~all');

    console.log('\n📊 DMARC Record (optional but recommended):');
    console.log('   Type: TXT');
    console.log('   Name: _dmarc');
    console.log('   Value: v=DMARC1; p=none; rua=mailto:dmarc@bowerycreativeagency.com');

    console.log('\n💾 Saving domain info for later verification...');
    require('fs').writeFileSync('resend-domain-info.json', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Failed to add domain:', error);
  }
}

addDomain();