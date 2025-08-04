// EdgeOne Pages deployment utilities
import puppeteerDeploy from '../api/puppeteer-deploy.js';

export async function deployToEdgeOne(subdomain, html, businessData, env) {
  try {
    console.log(`Starting deployment for subdomain: ${subdomain}`);
    
    // First, try puppeteer deployment
    console.log('Attempting puppeteer deployment...');
    const puppeteerResult = await puppeteerDeploy(html, subdomain);
    
    if (puppeteerResult.success) {
      console.log(`Puppeteer deployment successful: ${puppeteerResult.url}`);
      return {
        success: true,
        url: puppeteerResult.url,
        subdomain: subdomain,
        deployedAt: puppeteerResult.deployedAt,
        deploymentMethod: 'puppeteer'
      };
    } else {
      console.log('Puppeteer deployment failed, falling back to API deployment...');
      console.error('Puppeteer error:', puppeteerResult.error);
      
      // Fallback to API deployment
      return await deployToEdgeOnePages(subdomain, html, businessData, env);
    }
    
  } catch (error) {
    console.error('Deployment failed:', error);
    return {
      success: false,
      error: error.message || 'Deployment failed'
    };
  }
}

// Real EdgeOne Pages deployment (for production)
export async function deployToEdgeOnePages(subdomain, html, businessData, env) {
  try {
    // EdgeOne uses Cloudflare Pages API
    const deploymentUrl = `https://api.cloudflare.com/client/v4/accounts/${env.EDGEONE_ACCOUNT_ID}/pages/projects/${subdomain}/deployments`;
    
    const deploymentData = {
      files: [
        {
          name: 'index.html',
          content: html,
          type: 'text/html'
        }
      ],
      settings: {
        domain: `${subdomain}.umkm.id`,
        ssl: true,
        cache: {
          html: 3600,
          css: 86400,
          js: 86400,
          images: 604800
        }
      }
    };
    
    const response = await fetch(deploymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.EDGEONE_API_TOKEN}`
      },
      body: JSON.stringify(deploymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deployment failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    return {
      success: true,
      url: `https://${subdomain}.umkm.id`,
      deploymentId: result.id,
      deployedAt: Date.now()
    };
    
  } catch (error) {
    console.error('EdgeOne Pages deployment failed:', error);
    return {
      success: false,
      error: error.message || 'EdgeOne Pages deployment failed'
    };
  }
}

// File upload handling for logos
export async function uploadLogo(file, businessId, env) {
  try {
    // For MVP, we'll use a placeholder logo service
    // In production, this would upload to EdgeOne R2 or similar
    
    const logoUrl = `https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=${encodeURIComponent(businessId.substring(0, 3))}`;
    
    return {
      success: true,
      url: logoUrl
    };
    
  } catch (error) {
    console.error('Logo upload failed:', error);
    return {
      success: false,
      error: error.message || 'Logo upload failed'
    };
  }
}

// Health check for deployment status
export async function checkDeploymentStatus(deploymentId, env) {
  try {
    const statusUrl = `https://api.edgeone.com/v1/pages/deployments/${deploymentId}`;
    
    const response = await fetch(statusUrl, {
      headers: {
        'Authorization': `Bearer ${env.EDGEONE_API_TOKEN}`,
        'X-Account-ID': env.EDGEONE_ACCOUNT_ID
      }
    });
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    
    const status = await response.json();
    
    return {
      success: true,
      status: status.state,
      url: status.url,
      deployedAt: status.deployed_at
    };
    
  } catch (error) {
    console.error('Status check failed:', error);
    return {
      success: false,
      error: error.message || 'Status check failed'
    };
  }
} 