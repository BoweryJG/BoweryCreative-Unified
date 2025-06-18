const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'user-flow-screenshots');

async function ensureScreenshotsDir() {
  try {
    await fs.mkdir(screenshotsDir, { recursive: true });
  } catch (error) {
    console.log('Screenshots directory already exists');
  }
}

async function takeScreenshot(page, name) {
  const filename = path.join(screenshotsDir, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`Screenshot saved: ${name}.png`);
}

async function waitAndClick(page, selector, options = {}) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 10000, ...options });
    await page.click(selector);
    return true;
  } catch (error) {
    console.error(`Failed to click ${selector}:`, error.message);
    return false;
  }
}

async function waitAndType(page, selector, text, options = {}) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 10000, ...options });
    await page.click(selector);
    await page.type(selector, text);
    return true;
  } catch (error) {
    console.error(`Failed to type in ${selector}:`, error.message);
    return false;
  }
}

(async () => {
  await ensureScreenshotsDir();
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.toString()));
  
  const testResults = {
    steps: [],
    errors: [],
    timestamp: new Date().toISOString()
  };
  
  try {
    console.log('\n=== Testing Complete User Flow on start.bowerycreativeagency.com ===\n');
    
    // Step 1: Navigate to homepage
    console.log('1. Navigating to homepage...');
    await page.goto('https://start.bowerycreativeagency.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await takeScreenshot(page, '01-homepage');
    testResults.steps.push({ step: 1, description: 'Homepage loaded', success: true });
    
    // Check if homepage loaded correctly
    const homePageTitle = await page.title();
    console.log(`Page title: ${homePageTitle}`);
    
    // Step 2: Click "Start Your Journey" button
    console.log('\n2. Looking for "Start Your Journey" button...');
    
    // Try multiple possible selectors
    const startJourneySelectors = [
      'button:has-text("Start Your Journey")',
      'button[class*="cosmic"]',
      'button[class*="start"]',
      'button[class*="journey"]',
      '[data-testid="start-journey"]',
      'button'
    ];
    
    let startButtonFound = false;
    for (const selector of startJourneySelectors) {
      try {
        const buttons = await page.$$(selector);
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent);
          if (text && text.includes('Start Your Journey')) {
            await button.click();
            startButtonFound = true;
            console.log('Clicked "Start Your Journey" button');
            break;
          }
        }
        if (startButtonFound) break;
      } catch (e) {
        // Continue trying other selectors
      }
    }
    
    if (!startButtonFound) {
      // Try a more general approach
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startButton = buttons.find(btn => 
          btn.textContent.toLowerCase().includes('start') && 
          btn.textContent.toLowerCase().includes('journey')
        );
        if (startButton) startButton.click();
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await takeScreenshot(page, '02-onboarding-modal-open');
    testResults.steps.push({ step: 2, description: 'Onboarding modal opened', success: true });
    
    // Step 3: Fill out onboarding form
    console.log('\n3. Filling out onboarding form...');
    
    // Step 3.1: Personal Information
    console.log('   Step 1: Filling personal information...');
    await waitAndType(page, 'input[name="firstName"]', 'Test');
    await waitAndType(page, 'input[name="lastName"]', 'User');
    await waitAndType(page, 'input[name="practiceName"]', 'Test Practice');
    
    // Select practice type
    const practiceTypeSelector = 'select[name="practiceType"], input[name="practiceType"]';
    const practiceTypeExists = await page.$(practiceTypeSelector);
    if (practiceTypeExists) {
      await page.select('select[name="practiceType"]', 'Medical Spa').catch(() => {
        // If it's not a select, try clicking and typing
        return waitAndType(page, 'input[name="practiceType"]', 'Medical Spa');
      });
    }
    
    await takeScreenshot(page, '03-onboarding-step1');
    
    // Click Next
    await waitAndClick(page, 'button:has-text("Next")') || 
    await waitAndClick(page, 'button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3.2: Contact Information
    console.log('   Step 2: Filling contact information...');
    await waitAndType(page, 'input[name="email"], input[type="email"]', 'test@example.com');
    await waitAndType(page, 'input[name="phone"], input[type="tel"]', '555-1234');
    await takeScreenshot(page, '04-onboarding-step2');
    
    // Click Next
    await waitAndClick(page, 'button:has-text("Next")') || 
    await waitAndClick(page, 'button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3.3: Skip optional step
    console.log('   Step 3: Skipping optional step...');
    await takeScreenshot(page, '05-onboarding-step3');
    await waitAndClick(page, 'button:has-text("Skip")') || 
    await waitAndClick(page, 'button:has-text("Next")');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3.4: Marketing goals and budget
    console.log('   Step 4: Selecting marketing goals and budget...');
    
    // Select some marketing goals (checkboxes)
    const goalCheckboxes = await page.$$('input[type="checkbox"]');
    if (goalCheckboxes.length > 0) {
      // Click first 3 checkboxes
      for (let i = 0; i < Math.min(3, goalCheckboxes.length); i++) {
        await goalCheckboxes[i].click();
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Select budget
    const budgetSelectors = [
      'input[value="$2500-$5000"]',
      'label:has-text("$2,500 - $5,000")',
      'label:has-text("$2500-$5000")'
    ];
    
    for (const selector of budgetSelectors) {
      const clicked = await waitAndClick(page, selector);
      if (clicked) break;
    }
    
    // Enter promo code
    await waitAndType(page, 'input[name="promoCode"], input[placeholder*="promo"], input[placeholder*="code"]', 'PEDRO');
    await takeScreenshot(page, '06-onboarding-step4');
    
    // Click Next
    await waitAndClick(page, 'button:has-text("Next")') || 
    await waitAndClick(page, 'button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3.5: Click "Launch Payment Portal"
    console.log('   Step 5: Clicking "Launch Payment Portal"...');
    await takeScreenshot(page, '07-onboarding-step5');
    
    const launchPaymentClicked = await waitAndClick(page, 'button:has-text("Launch Payment Portal")') ||
                                  await waitAndClick(page, 'button:has-text("Launch")') ||
                                  await waitAndClick(page, 'button:has-text("Payment")');
    
    if (launchPaymentClicked) {
      testResults.steps.push({ step: 3, description: 'Onboarding form completed', success: true });
    } else {
      testResults.errors.push('Could not find Launch Payment Portal button');
    }
    
    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Check redirect to /pay
    console.log('\n4. Checking redirect to /pay...');
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/pay')) {
      console.log('Successfully redirected to payment page');
      const urlParams = new URL(currentUrl).searchParams;
      console.log('URL Parameters:', Object.fromEntries(urlParams));
      
      // Check if promo code PEDRO is in the parameters
      if (urlParams.get('promo') === 'PEDRO' || urlParams.get('promoCode') === 'PEDRO') {
        console.log('✓ Promo code PEDRO successfully passed in URL');
        testResults.steps.push({ step: 4, description: 'Promo code PEDRO accepted', success: true });
      } else {
        console.log('✗ Promo code PEDRO not found in URL parameters');
        testResults.errors.push('Promo code PEDRO not passed to payment page');
      }
    } else {
      testResults.errors.push('Did not redirect to /pay page');
    }
    
    await takeScreenshot(page, '08-payment-redirect');
    
    // Step 5: Navigate back to homepage and click "Client Login"
    console.log('\n5. Navigating back to homepage...');
    await page.goto('https://start.bowerycreativeagency.com', { 
      waitUntil: 'networkidle2' 
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('6. Looking for "Client Login" link...');
    const loginClicked = await waitAndClick(page, 'a:has-text("Client Login")') ||
                        await waitAndClick(page, 'button:has-text("Client Login")') ||
                        await waitAndClick(page, '[href*="login"]');
    
    if (loginClicked) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await takeScreenshot(page, '09-login-page');
      testResults.steps.push({ step: 6, description: 'Login page loaded', success: true });
    } else {
      testResults.errors.push('Could not find Client Login link');
    }
    
    // Step 7: Try to access /dashboard (should redirect to login)
    console.log('\n7. Attempting to access /dashboard directly...');
    await page.goto('https://start.bowerycreativeagency.com/dashboard', { 
      waitUntil: 'networkidle2' 
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dashboardUrl = page.url();
    console.log(`Dashboard access URL: ${dashboardUrl}`);
    
    if (dashboardUrl.includes('login') || dashboardUrl.includes('auth')) {
      console.log('✓ Successfully redirected to login (as expected for unauthenticated user)');
      testResults.steps.push({ step: 7, description: 'Dashboard redirect to login works', success: true });
    } else {
      testResults.errors.push('Dashboard did not redirect to login for unauthenticated user');
    }
    
    await takeScreenshot(page, '10-dashboard-redirect');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    testResults.errors.push(error.message);
    await takeScreenshot(page, 'error-state');
  }
  
  // Generate test report
  console.log('\n=== TEST REPORT ===\n');
  console.log('Timestamp:', testResults.timestamp);
  console.log('\nSuccessful Steps:');
  testResults.steps.forEach(step => {
    if (step.success) {
      console.log(`✓ Step ${step.step}: ${step.description}`);
    }
  });
  
  console.log('\nErrors Encountered:');
  if (testResults.errors.length === 0) {
    console.log('✓ No errors encountered');
  } else {
    testResults.errors.forEach(error => {
      console.log(`✗ ${error}`);
    });
  }
  
  // Check UI elements
  console.log('\n=== UI Elements Check ===');
  try {
    // Check for cosmic theme elements
    const cosmicElements = await page.evaluate(() => {
      const elements = {
        particleBackground: !!document.querySelector('[class*="particle"]'),
        cosmicTheme: !!document.querySelector('[class*="cosmic"]'),
        gradients: !!document.querySelector('[class*="gradient"]'),
        animations: !!document.querySelector('[class*="animate"]')
      };
      return elements;
    });
    
    console.log('Cosmic UI Elements:', cosmicElements);
  } catch (error) {
    console.log('Could not check UI elements:', error.message);
  }
  
  // Save test results
  await fs.writeFile(
    path.join(screenshotsDir, 'test-results.json'),
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('\n✅ Test completed. Screenshots saved in:', screenshotsDir);
  console.log('Browser will remain open for manual inspection.');
  console.log('Press Ctrl+C to exit.');
  
})().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});