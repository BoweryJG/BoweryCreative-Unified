const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://bowerycreativeagency.com');
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Check what's actually on the page
  const buttons = await page.$$eval('button', buttons => 
    buttons.map(btn => btn.textContent.trim())
  );
  
  console.log('Buttons found:', buttons);
  
  // Take screenshot
  await page.screenshot({ path: 'site-check.png', fullPage: true });
  
  console.log('Screenshot saved. Browser staying open for inspection...');
})();