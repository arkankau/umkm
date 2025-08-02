import { BusinessData } from './lib/api';
import { deploymentService } from './lib/deployment-service';

// Test business data
const testBusinessData: BusinessData = {
  businessName: 'Warung Pak Budi',
  ownerName: 'Pak Budi',
  description: 'Warung tradisional dengan masakan Indonesia autentik. Menyajikan berbagai hidangan lokal yang lezat dan bergizi.',
  category: 'restaurant',
  products: 'Nasi Goreng, Mie Goreng, Sate Ayam, Es Teh Manis, Es Jeruk, Kopi Hitam',
  phone: '+62-812-3456-7890',
  email: 'warungpakbudi@example.com',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  whatsapp: '+62-812-3456-7890',
  instagram: '@warungpakbudi'
};

async function testWebsiteDeployment() {
  console.log('🚀 Testing website generation and deployment...\n');
  
  try {
    // Test domain
    const testDomain = 'warungpakbuditest';
    
    console.log('📝 Business Data:');
    console.log(`   Name: ${testBusinessData.businessName}`);
    console.log(`   Category: ${testBusinessData.category}`);
    console.log(`   Domain: ${testDomain}\n`);
    
    // Deploy website
    console.log('🌐 Deploying website...');
    const result = await deploymentService.deploy(testBusinessData, testDomain);
    
    console.log('\n📊 Deployment Result:');
    console.log(`   Success: ${result.success}`);
    console.log(`   URL: ${result.url || 'N/A'}`);
    console.log(`   Domain: ${result.domain || 'N/A'}`);
    console.log(`   Method: ${result.deploymentMethod || 'N/A'}`);
    console.log(`   Deployed At: ${result.deployedAt ? new Date(result.deployedAt).toISOString() : 'N/A'}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.success) {
      console.log('\n✅ Deployment successful!');
      console.log(`🌐 Your website is live at: ${result.url}`);
    } else {
      console.log('\n❌ Deployment failed!');
      console.log(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }
  
  console.log('\n🏁 Test completed!');
}

// Run the test
testWebsiteDeployment(); 