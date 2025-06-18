const { execSync } = require('child_process');

console.log('🚀 Testing BoweryCreative Complete Flow\n');

// URLs to test
const urls = [
  {
    name: 'Admin Dashboard',
    url: 'https://bowerycreative-dashboard.netlify.app',
    description: 'Main admin interface - login required'
  },
  {
    name: 'Payment Portal',
    url: 'https://start.bowerycreativeagency.com',
    description: 'Customer payment portal with onboarding'
  },
  {
    name: 'Cosmic Onboarding',
    url: 'https://start.bowerycreativeagency.com/onboarding',
    description: 'Direct link to onboarding flow'
  },
  {
    name: 'Dr. Pedro Payment Link',
    url: 'https://start.bowerycreativeagency.com/pay?code=PEDRO',
    description: 'Direct payment link with PEDRO promo code ($2000/month)'
  },
  {
    name: 'Main Website',
    url: 'https://bowerycreativeagency.com',
    description: 'Public marketing website'
  }
];

console.log('Opening all sites in your browser...\n');

urls.forEach((site, index) => {
  console.log(`${index + 1}. ${site.name}`);
  console.log(`   URL: ${site.url}`);
  console.log(`   ${site.description}\n`);
  
  // Open in browser
  try {
    execSync(`open "${site.url}"`);
  } catch (error) {
    console.error(`   ❌ Failed to open: ${error.message}`);
  }
  
  // Small delay between opens
  if (index < urls.length - 1) {
    execSync('sleep 1');
  }
});

console.log('\n✅ All sites opened! Check your browser tabs.');
console.log('\n📋 Test Flow:');
console.log('1. Admin Dashboard - Login and click "Send Cosmic Onboarding"');
console.log('2. Fill out the cosmic form');
console.log('3. Use promo code: PEDRO');
console.log('4. Complete payment flow');
console.log('\n💳 Test card: 4242 4242 4242 4242');