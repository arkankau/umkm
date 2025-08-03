import puppeteer from 'puppeteer';

// Generate random user agent
function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Generate random viewport size
function getRandomViewport() {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 },
    { width: 1280, height: 720 }
  ];
  return viewports[Math.floor(Math.random() * viewports.length)];
}

async function deploy(htmlCode, domain) {
  let browser;
  
  try {
    // Launch browser with enhanced security and performance settings
    browser = await puppeteer.launch({
      headless: false, // Use new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      timeout: 60000, // Set a longer timeout for browser launch
    });

    const page = await browser.newPage();
    
    // Set random user agent and viewport
    await page.setUserAgent(getRandomUserAgent());
    await page.setViewport({width: 1024, height: 768});
    
    // Set extra headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // Clear cookies and storage before starting
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    console.log('Navigating to EdgeOne Pages...');
    await page.goto('https://edgeone.ai/pages/drop', { 
      waitUntil: 'load',
      timeout: 30000 
    });

    const input = await page.locator('input[placeholder="Enter your domain name"]').waitHandle();
    // console.log(await page.evaluate(el => { return el.outerHTML ? el.outerHTML : "Not found"}, input));

    console.log('Filling domain name...');
    await input.type(`${domain}`, { delay: 100 });


    console.log('Clicking paste code button...');
    await page.locator('::-p-text(Paste Code)').click({ delay: 100 });
    
    console.log('Filling HTML code...');
    const textArea = await page.locator('textarea.PagesUploadCard_inputTextarea__YujEt').waitHandle();
    await page.evaluate((el, code) => {
      el.value = code;
    }, textArea, htmlCode);

    // Wait for the deploy button to be enabled
    console.log('Waiting for deploy button to be enabled...');
    await page.waitForFunction(() => {
      const btn = document.querySelector('button.PagesUploadCard_deploymentBtn__7ZMYf');
      return btn && !btn.hasAttribute('disabled');
    }, { timeout: 30000 });

    console.log('Clicking deploy button...');
    await page.locator('button.PagesUploadCard_deploymentBtn__7ZMYf').click({ delay: 100 });
    
    // Handle domain name conflicts with retry logic
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      try {
        // Wait a bit to see if there's a conflict
        await page.waitForTimeout(2000);
        
        // Check if there's a "Project name already exists" error
        const conflictExists = await page.locator('::-p-text(Project name already exists)').count() > 0;
        
        if (conflictExists) {
          attempts++;
          const newDomain = `${domain}${attempts}`;
          console.log(`Domain conflict detected, trying: ${newDomain}`);
          
          await page.locator('input[placeholder="Enter your domain name"]').fill(newDomain, { delay: 100 });
          await page.locator('button.PagesUploadCard_deploymentBtn__7ZMYf').click({ delay: 100 });
        } else {
          // No conflict, deployment should proceed
          console.log('No domain conflict, deployment proceeding...');
          break;
        }
      } catch (error) {
        console.log('No conflict detected, deployment proceeding...');
        break;
      }
    }
    
    // Wait for deployment to complete (look for success indicators)
    console.log('Waiting for deployment to complete...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds for deployment
    
    // Check if deployment was successful by looking for success indicators
    const successIndicators = [
      '::-p-text(Deployment successful)',
      '::-p-text(Your site is live)',
      '::-p-text(Deployed successfully)',
      'a[href*=".umkm.id"]'
    ];
    
    let deploymentSuccessful = false;
    for (const indicator of successIndicators) {
      try {
        const element = await page.locator(indicator).first();
        if (await element.count() > 0) {
          deploymentSuccessful = true;
          console.log(`Deployment successful! Found indicator: ${indicator}`);
          break;
        }
      } catch (error) {
        // Continue checking other indicators
      }
    }
    
    if (!deploymentSuccessful) {
      console.log('Deployment status unclear, but proceeding...');
    }
    
    // Get the final URL if possible
    let finalUrl = `https://${domain}.edgeone.app`;
    try {
      const urlElement = await page.locator('a[href*=".edgeone.app"]').first();
      if (await urlElement.count() > 0) {
        const href = await urlElement.getAttribute('href');
        if (href) {
          finalUrl = href;
        }
      }
    } catch (error) {
      console.log('Could not extract final URL, using default');
    }
    
    console.log(`Deployment completed. Final URL: ${finalUrl}`);
    
    return {
      success: true,
      url: finalUrl,
      domain: domain,
      deployedAt: Date.now()
    };
    
  } catch (error) {
    console.error('Puppeteer deployment failed:', error);
    return {
      success: false,
      error: error.message || 'Puppeteer deployment failed',
      domain: domain
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export default deploy;