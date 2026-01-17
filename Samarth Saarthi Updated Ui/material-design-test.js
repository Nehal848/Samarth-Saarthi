import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to the application
  await page.goto('http://localhost:8080');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check if Material Design 3 elements are present
  const hasMaterialDesignClasses = await page.evaluate(() => {
    // Check for Material Design 3 specific classes
    const rounded2xlElements = document.querySelectorAll('.rounded-2xl');
    const elevatedShadowElements = document.querySelectorAll('[class*="shadow-elevated"]');
    const surfaceColorElements = document.querySelectorAll('[style*="--surface"]');
    
    return {
      hasRounded2xl: rounded2xlElements.length > 0,
      hasElevatedShadows: elevatedShadowElements.length > 0,
      hasSurfaceColors: surfaceColorElements.length > 0,
      rounded2xlCount: rounded2xlElements.length,
      elevatedShadowCount: elevatedShadowElements.length
    };
  });
  
  console.log('Material Design 3 Implementation Check:');
  console.log('- Has rounded-2xl classes:', hasMaterialDesignClasses.hasRounded2xl);
  console.log('- Has elevated shadow classes:', hasMaterialDesignClasses.hasElevatedShadows);
  console.log('- Has surface color variables:', hasMaterialDesignClasses.hasSurfaceColors);
  console.log('- Count of rounded-2xl elements:', hasMaterialDesignClasses.rounded2xlCount);
  console.log('- Count of elevated shadow elements:', hasMaterialDesignClasses.elevatedShadowCount);
  
  // Check for specific components
  const hasNavbar = await page.$('.sticky.top-0') !== null;
  const hasCards = await page.$$('.rounded-2xl.border').length > 0;
  
  console.log('- Has Navbar:', hasNavbar);
  console.log('- Has Material Design 3 Cards:', hasCards);
  
  // Check for Gemini gradient
  const hasGeminiGradient = await page.evaluate(() => {
    const elements = document.querySelectorAll('[class*="gradient-to-br"]');
    return Array.from(elements).some(el => {
      const style = getComputedStyle(el);
      return style.backgroundImage && style.backgroundImage.includes('4285F4') && style.backgroundImage.includes('9B72CB');
    });
  });
  
  console.log('- Has Gemini gradient:', hasGeminiGradient);
  
  // Take a screenshot
  await page.screenshot({ path: 'material-design-screenshot.png', fullPage: true });
  
  console.log('\nScreenshot saved as material-design-screenshot.png');
  
  await browser.close();
  
  // Exit with success code if Material Design 3 elements are found
  const hasMaterialDesign = hasMaterialDesignClasses.hasRounded2xl || 
                           hasMaterialDesignClasses.hasElevatedShadows || 
                           hasMaterialDesignClasses.hasSurfaceColors;
  
  if (hasMaterialDesign) {
    console.log('\n✓ Material Design 3 implementation verified successfully!');
    process.exit(0);
  } else {
    console.log('\n✗ Material Design 3 implementation not found');
    process.exit(1);
  }
})();