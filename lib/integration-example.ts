import { BusinessData } from './api';
import { deploymentService } from './deployment-service';

/**
 * Example: How to deploy a website using the integrated system
 */
export async function deployBusinessWebsite(businessData: BusinessData, domain: string) {
  console.log(`🚀 Starting deployment for ${businessData.businessName}...`);
  
  try {
    // Deploy the website
    const result = await deploymentService.deploy(businessData, domain);
    
    if (result.success) {
      console.log('✅ Website deployed successfully!');
      console.log(`🌐 URL: ${result.url}`);
      console.log(`🔧 Method: ${result.deploymentMethod}`);
      console.log(`📅 Deployed: ${new Date(result.deployedAt!).toISOString()}`);
      
      return {
        success: true,
        url: result.url,
        domain: result.domain,
        deployedAt: result.deployedAt
      };
    } else {
      console.log('❌ Deployment failed!');
      console.log(`Error: ${result.error}`);
      
      return {
        success: false,
        error: result.error
      };
    }
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Example: How to generate HTML without deploying
 */
export function generateWebsiteHTML(businessData: BusinessData): string {
  import { generateCompleteHTML } from './website-generator';
  return generateCompleteHTML(businessData);
}

/**
 * Example: Complete workflow from business data to deployed website
 */
export async function completeWebsiteWorkflow(businessData: BusinessData) {
  console.log('🔄 Starting complete website workflow...');
  
  // Step 1: Generate domain name
  const domain = generateDomainFromBusinessName(businessData.businessName);
  console.log(`📝 Generated domain: ${domain}`);
  
  // Step 2: Deploy website
  const result = await deployBusinessWebsite(businessData, domain);
  
  if (result.success) {
    console.log('🎉 Website workflow completed successfully!');
    return {
      success: true,
      url: result.url,
      domain: result.domain,
      deployedAt: result.deployedAt
    };
  } else {
    console.log('💥 Website workflow failed!');
    return {
      success: false,
      error: result.error
    };
  }
}

/**
 * Helper: Generate domain name from business name
 */
function generateDomainFromBusinessName(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20) + Date.now().toString(36);
}

// Example usage:
/*
const businessData: BusinessData = {
  businessName: 'Warung Pak Budi',
  ownerName: 'Pak Budi',
  description: 'Warung tradisional dengan masakan Indonesia autentik.',
  category: 'restaurant',
  products: 'Nasi Goreng, Mie Goreng, Sate Ayam',
  phone: '+62-812-3456-7890',
  email: 'warungpakbudi@example.com',
  address: 'Jl. Sudirman No. 123, Jakarta',
  whatsapp: '+62-812-3456-7890',
  instagram: '@warungpakbudi'
};

// Deploy website
const result = await completeWebsiteWorkflow(businessData);
if (result.success) {
  console.log(`Website deployed at: ${result.url}`);
} else {
  console.log(`Deployment failed: ${result.error}`);
}
*/ 