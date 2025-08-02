import { generateWebsite, GeneratedWebsite } from './website-generator';
import { BusinessData } from './api';
import { EdgeOneAPI, EdgeOneFile, EdgeOneDeployment } from './edgeone-api';

export interface DeploymentResult {
  success: boolean;
  businessId: string;
  subdomain: string;
  domain: string;
  status: 'pending' | 'processing' | 'live' | 'error';
  message: string;
  error?: string;
}

export class DeploymentService {
  private edgeOneAPI: EdgeOneAPI;
  private static demoDeployments: Map<string, DeploymentResult> = new Map();

  constructor() {
    try {
      // Check if we have valid EdgeOne credentials
      const hasValidCredentials = process.env.EDGEONE_API_KEY && 
                                 process.env.EDGEONE_ZONE_ID && 
                                 process.env.EDGEONE_ZONE_ID !== 'your_zone_id_here' &&
                                 process.env.EDGEONE_ACCOUNT_ID;
      
      if (hasValidCredentials) {
        this.edgeOneAPI = new EdgeOneAPI({
          apiKey: process.env.EDGEONE_API_KEY!,
          zoneId: process.env.EDGEONE_ZONE_ID!,
          accountId: process.env.EDGEONE_ACCOUNT_ID!,
          baseDomain: process.env.EDGEONE_BASE_DOMAIN || 'umkm.id',
        });
        console.log('EdgeOne API configured for production mode');
      } else {
        console.log('EdgeOne credentials incomplete, using demo mode');
        this.edgeOneAPI = null as any;
      }
    } catch (error) {
      console.warn('EdgeOne API configuration failed, using demo mode');
      this.edgeOneAPI = null as any;
    }
  }

  async deployWebsite(businessData: BusinessData): Promise<DeploymentResult> {
    try {
      // Generate unique business ID and subdomain
      const businessId = `biz-${Date.now().toString(36)}`;
      const subdomain = await this.generateUniqueSubdomain(businessData.businessName);

      // Generate website files
      console.log(`Generating website for: ${businessData.businessName}`);
      const website = await generateWebsite(businessData);

      // Convert to EdgeOne files
      const files: EdgeOneFile[] = [
        {
          name: 'index.html',
          content: this.injectCSSAndJS(website),
          contentType: 'text/html',
        },
      ];

      // Deploy to EdgeOne (or simulate if not configured)
      let deployment: EdgeOneDeployment;
      
      if (this.edgeOneAPI) {
        deployment = await this.edgeOneAPI.deployWebsite(businessId, subdomain, files);
      } else {
        // Demo mode - simulate deployment
        deployment = await this.simulateDeployment(businessId, subdomain, files);
      }

      const result = {
        success: true,
        businessId,
        subdomain,
        domain: deployment.domain,
        status: deployment.status,
        message: deployment.status === 'live' 
          ? 'Website deployed successfully!' 
          : 'Website is being deployed...',
        error: deployment.error,
      };

      // Store deployment data for demo mode
      if (!this.edgeOneAPI) {
        DeploymentService.demoDeployments.set(businessId, result);
      }

      return result;

    } catch (error) {
      console.error('Deployment failed:', error);
      return {
        success: false,
        businessId: `biz-${Date.now().toString(36)}`,
        subdomain: 'error',
        domain: 'error.umkm.id',
        status: 'error',
        message: 'Deployment failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getDeploymentStatus(businessId: string): Promise<DeploymentResult | null> {
    try {
      if (this.edgeOneAPI) {
        const deployment = await this.edgeOneAPI.getDeploymentStatus(businessId);
        if (!deployment) return null;

        return {
          success: true,
          businessId: deployment.id,
          subdomain: deployment.subdomain,
          domain: deployment.domain,
          status: deployment.status,
          message: this.getStatusMessage(deployment.status),
          error: deployment.error,
        };
      } else {
        // Demo mode - generate consistent subdomain from business ID
        const timestamp = businessId.split('-')[1] || 'business';
        const subdomain = `demo-${timestamp}`;
        
        return {
          success: true,
          businessId,
          subdomain,
          domain: `${subdomain}.umkm.id`,
          status: 'live',
          message: 'Website is live and ready to use!',
        };
      }
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      return null;
    }
  }

  private async generateUniqueSubdomain(businessName: string): Promise<string> {
    if (this.edgeOneAPI && process.env.EDGEONE_API_KEY) {
      return await this.edgeOneAPI.generateUniqueSubdomain(businessName);
    } else {
      // Demo mode - use deterministic subdomain based on timestamp
      const timestamp = Date.now().toString(36);
      return `demo-${timestamp}`;
    }
  }

  private injectCSSAndJS(website: GeneratedWebsite): string {
    return website.html
      .replace('/* CSS will be injected here */', website.css)
      .replace('// JavaScript will be injected here', website.js);
  }

  private async simulateDeployment(
    businessId: string, 
    subdomain: string, 
    files: EdgeOneFile[]
  ): Promise<EdgeOneDeployment> {
    console.log(`Simulating deployment for ${subdomain}.umkm.id`);
    
    // Simulate deployment time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // 95% success rate in demo mode
    const isSuccess = Math.random() > 0.05;
    
    return {
      id: businessId,
      status: isSuccess ? 'live' : 'error',
      subdomain,
      domain: `${subdomain}.umkm.id`,
      files,
      createdAt: new Date(),
      deployedAt: isSuccess ? new Date() : undefined,
      error: isSuccess ? undefined : 'Demo deployment failed',
    };
  }

  private getMockStatus(businessId: string): DeploymentResult {
    // For demo mode, generate a consistent subdomain
    const subdomain = `demo-${businessId.split('-')[1] || 'business'}`;
    
    return {
      success: true,
      businessId,
      subdomain,
      domain: `${subdomain}.umkm.id`,
      status: 'live', // Always live for demo
      message: 'Website is live and ready to use!',
    };
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'live':
        return 'Website is live and ready to use!';
      case 'processing':
        return 'Website is being deployed. Please wait...';
      case 'pending':
        return 'Deployment is queued. Please wait...';
      case 'error':
        return 'Deployment failed. Please try again.';
      default:
        return 'Unknown status';
    }
  }
}

// Singleton instance
export const deploymentService = new DeploymentService(); 