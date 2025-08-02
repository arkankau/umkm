import { loadTemplate, processTemplate } from './src/utils/template.js';
import { deployToEdgeOne } from './src/utils/deployment.js';

// Mock business data for testing
const mockBusinessData = {
  id: 'test-business-123',
  name: 'Warung Pak Budi',
  category: 'restaurant',
  subdomain: 'warungpakbuditest',
  description: 'Warung tradisional dengan masakan Indonesia autentik',
  address: 'Jl. Sudirman No. 123, Jakarta',
  phone: '+62-812-3456-7890',
  email: 'warungpakbudi@example.com',
  products: [
    {
      name: 'Menu Utama',
      items: [
        { name: 'Nasi Goreng', price: 25000, description: 'Nasi goreng spesial dengan telur dan ayam' },
        { name: 'Mie Goreng', price: 20000, description: 'Mie goreng dengan sayuran segar' },
        { name: 'Sate Ayam', price: 30000, description: 'Sate ayam dengan bumbu kacang' }
      ]
    },
    {
      name: 'Minuman',
      items: [
        { name: 'Es Teh Manis', price: 5000, description: 'Teh manis dingin' },
        { name: 'Es Jeruk', price: 8000, description: 'Jeruk segar dingin' },
        { name: 'Kopi Hitam', price: 10000, description: 'Kopi hitam tradisional' }
      ]
    }
  ],
  hours: {
    monday: '08:00-22:00',
    tuesday: '08:00-22:00',
    wednesday: '08:00-22:00',
    thursday: '08:00-22:00',
    friday: '08:00-22:00',
    saturday: '08:00-22:00',
    sunday: '08:00-22:00'
  },
  socialMedia: {
    instagram: '@warungpakbudi',
    facebook: 'Warung Pak Budi',
    whatsapp: '+62-812-3456-7890'
  }
};

// Mock environment for testing
const mockEnv = {
  EDGEONE_ACCOUNT_ID: 'test-account-id',
  EDGEONE_API_TOKEN: 'test-api-token'
};

async function testFullDeploymentFlow() {
  console.log('🚀 Testing full deployment flow with puppeteer integration...\n');
  
  try {
    // Step 1: Load and process template
    console.log('📝 Step 1: Loading and processing template...');
    const html = await loadTemplate(mockBusinessData.category, mockBusinessData, 'default');
    console.log('✅ Template loaded successfully');
    console.log(`📄 HTML length: ${html.length} characters\n`);
    
    // Step 2: Deploy using the integrated deployment system
    console.log('🌐 Step 2: Deploying website...');
    const deployment = await deployToEdgeOne(
      mockBusinessData.subdomain,
      html,
      mockBusinessData,
      mockEnv
    );
    
    if (deployment.success) {
      console.log('✅ Deployment successful!');
      console.log(`🌐 Website URL: ${deployment.url}`);
      console.log(`🔧 Deployment Method: ${deployment.deploymentMethod}`);
      console.log(`📅 Deployed at: ${new Date(deployment.deployedAt).toISOString()}`);
      
      // Step 3: Verify the deployment
      console.log('\n🔍 Step 3: Verifying deployment...');
      try {
        const response = await fetch(deployment.url);
        if (response.ok) {
          console.log('✅ Website is accessible!');
          console.log(`📊 Status Code: ${response.status}`);
        } else {
          console.log('⚠️ Website returned non-200 status:', response.status);
        }
      } catch (fetchError) {
        console.log('⚠️ Could not verify website accessibility (this is normal for test deployments)');
      }
      
    } else {
      console.log('❌ Deployment failed!');
      console.log(`Error: ${deployment.error}`);
    }
    
  } catch (error) {
    console.error('❌ Full deployment flow test failed:', error);
  }
  
  console.log('\n🏁 Test completed!');
}

// Run the test
testFullDeploymentFlow(); 