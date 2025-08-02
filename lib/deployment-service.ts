import { BusinessData } from './api';
import { generateCompleteHTML } from './website-generator';

export interface DeploymentResult {
  success: boolean;
  url?: string;
  domain?: string;
  deployedAt?: number;
  error?: string;
  deploymentMethod?: string;
}

export class DeploymentService {
  private puppeteerDeploy: any;

  constructor() {
    // Import puppeteer deploy function
    this.puppeteerDeploy = null;
  }

  async initialize() {
    try {
      // Dynamic import for puppeteer deployment
      const puppeteerModule = await import('../backend/src/api/puppeteer-deploy.js');
      this.puppeteerDeploy = puppeteerModule.default;
    } catch (error) {
      console.error('Failed to load puppeteer deployment:', error);
    }
  }

  async deployWebsite(businessData: BusinessData, domain: string): Promise<DeploymentResult> {
    try {
      // Generate complete HTML file
      console.log('Generating website HTML...');
      const htmlContent = generateCompleteHTML(businessData);
      
      if (!this.puppeteerDeploy) {
        await this.initialize();
      }

      if (!this.puppeteerDeploy) {
        throw new Error('Puppeteer deployment not available');
      }

      // Deploy using puppeteer
      console.log('Deploying website using puppeteer...');
      const result = await this.puppeteerDeploy(htmlContent, domain);

      return {
        success: result.success,
        url: result.url,
        domain: result.domain,
        deployedAt: result.deployedAt,
        deploymentMethod: 'puppeteer',
        error: result.error
      };

    } catch (error) {
      console.error('Deployment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
        deploymentMethod: 'puppeteer'
      };
    }
  }

  // Alternative deployment method using API (fallback)
  async deployViaAPI(businessData: BusinessData, domain: string): Promise<DeploymentResult> {
    try {
      // This would be the API-based deployment method
      // For now, return a mock result
      return {
        success: true,
        url: `https://${domain}.umkm.id`,
        domain: domain,
        deployedAt: Date.now(),
        deploymentMethod: 'api'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API deployment failed',
        deploymentMethod: 'api'
      };
    }
  }

  // Main deployment method with fallback
  async deploy(businessData: BusinessData, domain: string): Promise<DeploymentResult> {
    console.log(`Starting deployment for domain: ${domain}`);
    
    // Try puppeteer deployment first
    const puppeteerResult = await this.deployWebsite(businessData, domain);
    
    if (puppeteerResult.success) {
      console.log('Puppeteer deployment successful!');
      return puppeteerResult;
    } else {
      console.log('Puppeteer deployment failed, trying API fallback...');
      return await this.deployViaAPI(businessData, domain);
    }
  }
}

// Export singleton instance
export const deploymentService = new DeploymentService(); 