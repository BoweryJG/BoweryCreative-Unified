const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.toString()));
  
  const testResults = {
    passed: [],
    failed: [],
    timestamp: new Date().toISOString()
  };
  
  try {
    console.log('\n=== Testing User Flow on start.bowerycreativeagency.com ===\n');
    
    // Test 1: Navigate to homepage
    console.log('Test 1: Loading homepage...');
    await page.goto('https://start.bowerycreativeagency.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const homePageTitle = await page.title();
    console.log(`✓ Homepage loaded. Title: ${homePageTitle}`);
    testResults.passed.push('Homepage loads successfully');
    
    // Test 2: Check for cosmic UI elements
    console.log('\nTest 2: Checking cosmic UI elements...');
    const cosmicElements = await page.evaluate(() => {
      return {
        particleBackground: !!document.querySelector('[class*="particle"]'),
        cosmicTheme: !!document.querySelector('[class*="cosmic"]'),
        gradients: !!document.querySelector('[class*="gradient"]'),
        animations: !!document.querySelector('[class*="animate"]')
      };
    });
    
    console.log('Cosmic UI Elements:', cosmicElements);
    if (Object.values(cosmicElements).some(v => v)) {
      testResults.passed.push('Cosmic UI elements present');
    } else {
      testResults.failed.push('No cosmic UI elements found');
    }
    
    // Test 3: Find and click "Start Your Journey" button
    console.log('\nTest 3: Looking for "Start Your Journey" button...');
    
    const startButtonFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startButton = buttons.find(btn => 
        btn.textContent && btn.textContent.includes('Start Your Journey')
      );
      if (startButton) {
        console.log('Found button:', startButton.textContent);
        startButton.click();
        return true;
      }
      return false;
    });
    
    if (startButtonFound) {
      console.log('✓ Clicked "Start Your Journey" button');
      testResults.passed.push('Start Your Journey button works');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 4: Check if modal opened
      const modalVisible = await page.evaluate(() => {
        const modals = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="onboarding"]');
        return modals.length > 0 && Array.from(modals).some(m => {
          const style = window.getComputedStyle(m);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
      });
      
      if (modalVisible) {
        console.log('✓ Onboarding modal opened');
        testResults.passed.push('Onboarding modal opens');
        
        // Test 5: Try to fill first step
        console.log('\nTest 5: Filling onboarding form...');
        
        // Fill personal info
        const filled = await page.evaluate(() => {
          const inputs = {
            firstName: document.querySelector('input[name="firstName"], input[placeholder*="First"]'),
            lastName: document.querySelector('input[name="lastName"], input[placeholder*="Last"]'),
            practiceName: document.querySelector('input[name="practiceName"], input[placeholder*="Practice"]')
          };
          
          let filledCount = 0;
          if (inputs.firstName) {
            inputs.firstName.value = 'Test';
            inputs.firstName.dispatchEvent(new Event('input', { bubbles: true }));
            filledCount++;
          }
          if (inputs.lastName) {
            inputs.lastName.value = 'User';
            inputs.lastName.dispatchEvent(new Event('input', { bubbles: true }));
            filledCount++;
          }
          if (inputs.practiceName) {
            inputs.practiceName.value = 'Test Practice';
            inputs.practiceName.dispatchEvent(new Event('input', { bubbles: true }));
            filledCount++;
          }
          
          return filledCount;
        });
        
        console.log(`✓ Filled ${filled} form fields`);
        if (filled > 0) {
          testResults.passed.push('Form inputs are fillable');
        } else {
          testResults.failed.push('Could not fill form inputs');
        }
        
        // Test 6: Check for promo code field
        console.log('\nTest 6: Looking for promo code field...');
        
        // Try to navigate through the form to find promo code field
        for (let i = 0; i < 5; i++) {
          const nextButton = await page.$('button:has-text("Next"), button[type="submit"]');
          if (nextButton) {
            await nextButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          const promoFieldExists = await page.evaluate(() => {
            const promoField = document.querySelector('input[name="promoCode"], input[placeholder*="promo"], input[placeholder*="code"], input[placeholder*="Promo"]');
            if (promoField) {
              promoField.value = 'PEDRO';
              promoField.dispatchEvent(new Event('input', { bubbles: true }));
              return true;
            }
            return false;
          });
          
          if (promoFieldExists) {
            console.log('✓ Found and filled promo code field with PEDRO');
            testResults.passed.push('Promo code field accepts PEDRO');
            break;
          }
        }
        
      } else {
        console.log('✗ Onboarding modal did not open');
        testResults.failed.push('Onboarding modal failed to open');
      }
    } else {
      console.log('✗ "Start Your Journey" button not found');
      testResults.failed.push('Start Your Journey button not found');
    }
    
    // Test 7: Navigate back and test Client Login
    console.log('\nTest 7: Testing Client Login...');
    await page.goto('https://start.bowerycreativeagency.com', { 
      waitUntil: 'networkidle2' 
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const loginLinkFound = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      const loginLink = links.find(link => 
        link.textContent && link.textContent.includes('Client Login')
      );
      if (loginLink) {
        loginLink.click();
        return true;
      }
      return false;
    });
    
    if (loginLinkFound) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const currentUrl = page.url();
      console.log(`✓ Client Login clicked. Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('login') || currentUrl.includes('auth')) {
        testResults.passed.push('Client Login redirects to login page');
      } else {
        testResults.failed.push('Client Login did not redirect properly');
      }
    } else {
      console.log('✗ Client Login link not found');
      testResults.failed.push('Client Login link not found');
    }
    
    // Test 8: Test dashboard redirect
    console.log('\nTest 8: Testing dashboard access (should redirect to login)...');
    await page.goto('https://start.bowerycreativeagency.com/dashboard', { 
      waitUntil: 'networkidle2' 
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dashboardUrl = page.url();
    if (dashboardUrl.includes('login') || dashboardUrl.includes('auth')) {
      console.log('✓ Dashboard correctly redirects to login for unauthenticated users');
      testResults.passed.push('Dashboard authentication works');
    } else {
      console.log('✗ Dashboard did not redirect to login');
      testResults.failed.push('Dashboard authentication not working');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    testResults.failed.push(`Fatal error: ${error.message}`);
  }
  
  // Generate final report
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY REPORT');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${testResults.timestamp}`);
  console.log(`Total Tests: ${testResults.passed.length + testResults.failed.length}`);
  console.log(`Passed: ${testResults.passed.length}`);
  console.log(`Failed: ${testResults.failed.length}`);
  
  console.log('\n✅ PASSED TESTS:');
  testResults.passed.forEach(test => console.log(`   - ${test}`));
  
  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.failed.forEach(test => console.log(`   - ${test}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C to exit.');
  
})().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});