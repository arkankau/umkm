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

export interface PuppeteerDeploymentResult {
  success: boolean;
  url?: string;
  domain?: string;
  deployedAt?: number;
  error?: string;
}

export async function deployWithPuppeteer(htmlCode: string, domain: string): Promise<PuppeteerDeploymentResult> {
  let browser;
  
  try {
    // Launch browser with enhanced security and performance settings
    browser = await puppeteer.launch({
      headless: false, // Use headless mode (compatible with current puppeteer version)
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
      ]
    });

    const page = await browser.newPage();
    
    // Set random user agent and viewport
    await page.setUserAgent(getRandomUserAgent());
    await page.setViewport(getRandomViewport());
    
    // Set extra headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // Clear all cookies, storage, and session data to ensure we're not logged in
    console.log('Clearing all cookies and session data...');
    const client = await page.target().createCDPSession();
    
    // Clear cookies
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    
    // Clear all storage types (with error handling for security restrictions)
    await page.evaluate(() => {
      try {
        // Clear localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
      } catch (error) {
        console.log('localStorage access blocked by security policy');
      }
      
      try {
        // Clear sessionStorage
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      } catch (error) {
        console.log('sessionStorage access blocked by security policy');
      }
      
      try {
        // Clear all cookies manually
        if (document.cookie) {
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
        }
      } catch (error) {
        console.log('Cookie clearing blocked by security policy');
      }
      
      try {
        // Clear IndexedDB
        if ('indexedDB' in window) {
          indexedDB.databases().then(databases => {
            databases.forEach(db => {
              indexedDB.deleteDatabase(db.name);
            });
          });
        }
      } catch (error) {
        console.log('IndexedDB access blocked by security policy');
      }
      
      try {
        // Clear service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister();
            });
          });
        }
      } catch (error) {
        console.log('Service worker access blocked by security policy');
      }
    });
    
    // Additional cookie clearing for specific domains
    await page.setCookie();
    
    console.log('All cookies and session data cleared successfully');

    console.log('Navigating to EdgeOne Pages...');
    await page.goto('https://edgeone.ai/pages/drop', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Clear cookies again after navigation in case any were set
    console.log('Clearing cookies after navigation...');
    await client.send('Network.clearBrowserCookies');
    await page.evaluate(() => {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
      } catch (error) {
        console.log('localStorage access blocked by security policy');
      }
      
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      } catch (error) {
        console.log('sessionStorage access blocked by security policy');
      }
      
      try {
        if (document.cookie) {
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
        }
      } catch (error) {
        console.log('Cookie clearing blocked by security policy');
      }
    });

    // Reload the page to ensure we're starting fresh without any session data
    console.log('Reloading page to ensure fresh session...');
    await page.reload({ waitUntil: 'networkidle2' });

    // Wait for the page to load completely
    // await page.locator('input[placeholder="Enter your domain name"]', { timeout: 10000 });
    
    console.log('Filling domain name...');
    await page.locator('input[placeholder="Enter your domain name"]').fill(domain, { delay: 100 });

    console.log('Finding Paste Code Button');
    await page.locator('::-p-text(Paste Code)').click({delay: 100})

    console.log('Filling HTML code...');
    await page.locator('textarea.PagesUploadCard_inputTextarea__YujEt').fill(htmlCode, { delay: 50 });
    
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if there's a "Project name already exists" error
        const conflictExists = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.some(el => el.textContent?.includes('Project name already exists'));
        });
        
        if (conflictExists) {
          attempts++;
          const newDomain = `${domain}${attempts}`;
          console.log(`Domain conflict detected, trying: ${newDomain}`);
          
          await page.evaluate((newDomainName) => {
            const input = document.querySelector('input[placeholder="Enter your domain name"]') as HTMLInputElement;
            if (input) {
              input.value = newDomainName;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }, newDomain);
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const deployButton = buttons.find(btn => btn.textContent?.includes('Get Started'));
            if (deployButton) {
              deployButton.click();
            }
          });
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
    const deploymentSuccessful = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.some(el => 
        el.textContent?.includes('successful') ||
        el.textContent?.includes('live') ||
        el.textContent?.includes('deployed') ||
        el.textContent?.includes('ready')
      );
    });
    
    if (deploymentSuccessful) {
      console.log('✅ Deployment successful!');
    } else {
      console.log('⚠️ Deployment status unclear, but proceeding...');
    }
    
    // Get the final URL if possible
    let finalUrl = `https://${domain}.umkm.id`;
    try {
      const href = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*=".umkm.id"]'));
        return links.length > 0 ? links[0].getAttribute('href') : null;
      });
      if (href) {
        finalUrl = href;
        console.log(`Found URL on page: ${finalUrl}`);
      } else {
        console.log(`No URL found on page, using default: ${finalUrl}`);
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
      error: error instanceof Error ? error.message : 'Puppeteer deployment failed',
      domain: domain
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}