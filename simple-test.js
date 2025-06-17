const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true 
  });
  
  const page = await browser.newPage();
  
  // Mobile viewport
  await page.setViewport({
    width: 375,
    height: 667,
    isMobile: true,
    hasTouch: true
  });
  
  try {
    await page.goto('https://bowerycreativeagency.com', { waitUntil: 'networkidle2' });
    
    // Wait a bit for everything to load
    await page.waitForTimeout(3000);
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'current-mobile.png', fullPage: true });
    
    // Check what buttons actually exist
    const buttons = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      return allButtons.map(btn => ({
        text: btn.textContent.trim(),
        classes: btn.className,
        id: btn.id,
        visible: btn.offsetWidth > 0 && btn.offsetHeight > 0,
        clickable: !btn.disabled
      }));
    });
    
    console.log('🔍 All buttons found:', buttons);
    
    // Look for Start Project button specifically
    const startButtons = await page.$$('button');
    for (let i = 0; i < startButtons.length; i++) {
      const text = await page.evaluate(el => el.textContent, startButtons[i]);
      if (text.includes('Start')) {
        console.log(`🎯 Found Start button ${i}: "${text}"`);
        
        try {
          await startButtons[i].click();
          console.log('✅ Successfully clicked Start button');
          await page.waitForTimeout(1000);
          await page.screenshot({ path: `click-result-${i}.png` });
          break;
        } catch (e) {
          console.log(`❌ Failed to click button ${i}:`, e.message);
        }
      }
    }
    
    console.log('🔍 Leaving browser open for inspection...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();