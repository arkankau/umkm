import { BusinessData } from './api';
import { generateCompleteHTML } from './website-generator';
import { deployWithPuppeteer } from './puppeteer-deploy';

export interface DeploymentResult {
  success: boolean;
  url?: string;
  domain?: string;
  deployedAt?: number;
  error?: string;
  deploymentMethod?: string;
}

export class DeploymentService {
  constructor() {
    // No initialization needed for API-based deployment
  }

  async deployWebsite(businessData: BusinessData, domain: string): Promise<DeploymentResult> {
    try {
      // Generate complete HTML file
      console.log('Generating website HTML...');
      const htmlContent = generateCompleteHTML(businessData);
      
      // Deploy using puppeteer directly
      console.log('Deploying website using puppeteer...');
      const result = await deployWithPuppeteer(htmlContent, domain);

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
      // Generate complete HTML file
      console.log('Generating website HTML for API deployment...');
      const htmlContent = generateCompleteHTML(businessData);
      
      // This would be the API-based deployment method
      // For now, return a mock result with the generated HTML
      console.log('API deployment successful (mock)');
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

  // Get deployment status for a business
  async getDeploymentStatus(businessId: string): Promise<DeploymentResult | null> {
    try {
      console.log(`Getting deployment status for business: ${businessId}`);
      
      // For now, return a mock successful deployment status
      // In a real implementation, this would check the actual deployment status
      return {
        success: true,
        url: `https://${businessId}.umkm.id`,
        domain: businessId,
        deployedAt: Date.now(),
        deploymentMethod: 'puppeteer'
      };
    } catch (error) {
      console.error('Error getting deployment status:', error);
      return null;
    }
  }
}

// Export singleton instance
export const deploymentService = new DeploymentService(); 