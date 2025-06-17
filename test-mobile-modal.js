const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({
    width: 375,
    height: 667,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  
  try {
    console.log('🚀 Testing Bowery Creative mobile modal...');
    
    // Navigate to the site
    await page.goto('https://bowerycreativeagency.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded');
    
    // Wait for navigation to load
    await page.waitForSelector('[data-testid="start-project"], .btn-primary', { timeout: 10000 });
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'mobile-initial.png', fullPage: true });
    console.log('📸 Initial screenshot taken');
    
    // Find and click the "Start Project" button
    const startButton = await page.$('.btn-primary, [data-testid="start-project"]');
    if (startButton) {
      console.log('🎯 Found Start Project button, clicking...');
      await startButton.click();
      
      // Wait for dropdown to appear
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'mobile-dropdown-open.png', fullPage: true });
      console.log('📸 Dropdown open screenshot taken');
      
      // Check if dropdown is visible and positioned correctly
      const dropdown = await page.$('.absolute.right-0.mt-2');
      if (dropdown) {
        const boundingBox = await dropdown.boundingBox();
        console.log('📍 Dropdown position:', boundingBox);
        
        // Check if it's within viewport
        const viewport = page.viewport();
        const isInViewport = boundingBox.x >= 0 && 
                           boundingBox.y >= 0 && 
                           boundingBox.x + boundingBox.width <= viewport.width &&
                           boundingBox.y + boundingBox.height <= viewport.height;
        
        console.log(`🎯 Dropdown in viewport: ${isInViewport}`);
        
        // Try clicking "Browse Packages"
        const browseButton = await page.$('button:has-text("Browse Packages"), button:has-text("Browse")');
        if (browseButton) {
          console.log('🎯 Found Browse Packages button, clicking...');
          await browseButton.click();
          
          // Wait for modal to open
          await page.waitForTimeout(1000);
          await page.screenshot({ path: 'mobile-modal-open.png', fullPage: true });
          console.log('📸 Modal open screenshot taken');
          
          // Check modal positioning and size
          const modal = await page.$('.fixed.inset-0, [role="dialog"]');
          if (modal) {
            const modalBox = await modal.boundingBox();
            console.log('📍 Modal position:', modalBox);
            
            // Test scrolling within modal
            console.log('🔄 Testing modal scroll...');
            await page.evaluate(() => {
              const modal = document.querySelector('.fixed.inset-0 .relative, .overflow-y-auto');
              if (modal) {
                modal.scrollTop = 100;
              }
            });
            
            await page.waitForTimeout(500);
            await page.screenshot({ path: 'mobile-modal-scrolled.png', fullPage: true });
            console.log('📸 Modal scrolled screenshot taken');
            
            // Test closing modal
            console.log('❌ Testing modal close...');
            const closeButton = await page.$('[data-testid="close"], .absolute button, button[aria-label="Close"]');
            if (closeButton) {
              await closeButton.click();
              await page.waitForTimeout(500);
              await page.screenshot({ path: 'mobile-modal-closed.png', fullPage: true });
              console.log('📸 Modal closed screenshot taken');
            } else {
              console.log('⚠️ No close button found, trying escape key...');
              await page.keyboard.press('Escape');
            }
          }
        }
      }
    }
    
    // Test desktop version
    console.log('🖥️ Testing desktop version...');
    await page.setViewport({
      width: 1920,
      height: 1080,
      isMobile: false
    });
    
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'desktop-initial.png', fullPage: true });
    
    console.log('✅ Testing complete! Check screenshots for issues.');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  }
  
  // Don't close browser automatically so we can inspect
  console.log('🔍 Browser staying open for manual inspection...');
  // await browser.close();
})();