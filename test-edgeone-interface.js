const puppeteer = require('puppeteer');

async function testEdgeOneInterface() {
  let browser;
  
  try {
    console.log('Starting EdgeOne interface test...');
    
    browser = await puppeteer.launch({
      headless: false, // Show browser so we can see what's happening
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    const page = await browser.newPage();
    
    console.log('Navigating to EdgeOne Pages...');
    await page.goto('https://edgeone.ai/pages/drop', { 
      waitUntil: 'load',
      timeout: 30000 
    });

    console.log('Page loaded, waiting 5 seconds to see the interface...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take a screenshot to see what the interface looks like
    await page.screenshot({ path: 'edgeone-interface.png', fullPage: true });
    console.log('Screenshot saved as edgeone-interface.png');

    // Try to find common elements
    console.log('Looking for common elements...');
    
    const elements = await page.evaluate(() => {
      const results = {};
      
      // Look for input fields
      const inputs = document.querySelectorAll('input');
      results.inputs = Array.from(inputs).map(input => ({
        placeholder: input.placeholder,
        id: input.id,
        className: input.className,
        type: input.type
      }));
      
      // Look for textareas
      const textareas = document.querySelectorAll('textarea');
      results.textareas = Array.from(textareas).map(textarea => ({
        placeholder: textarea.placeholder,
        id: textarea.id,
        className: textarea.className
      }));
      
      // Look for buttons
      const buttons = document.querySelectorAll('button');
      results.buttons = Array.from(buttons).map(button => ({
        text: button.textContent?.trim(),
        id: button.id,
        className: button.className,
        disabled: button.disabled
      }));
      
      return results;
    });

    console.log('Found elements:', JSON.stringify(elements, null, 2));

    console.log('Test completed. Check edgeone-interface.png for visual reference.');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testEdgeOneInterface(); 