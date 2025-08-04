import { deployToEdgeOnePages } from './src/utils/deployment.js';
import { loadTemplate, processTemplate } from './src/utils/template.js';
import { validateBusinessData } from './src/utils/validation.js';
import { generateUUID, generateSubdomain } from './src/utils/validation.js';

// Test business data
const testBusiness = {
  businessName: "Warung Pak Budi",
  ownerName: "Budi Santoso",
  description: "Warung makan tradisional dengan cita rasa autentik Indonesia",
  category: "restaurant",
  products: "Nasi goreng, Mie goreng, Soto ayam, Es teh manis",
  phone: "081234567890",
  email: "budi@warung.com",
  address: "Jl. Sudirman No. 123, Jakarta Pusat",
  whatsapp: "081234567890",
  instagram: "warungpakbudi"
};

// Environment variables (from wrangler.toml)
const env = {
  EDGEONE_API_TOKEN: "ueFiz8PVO5byDF8oMiy2tYbT8dw4zhHt",
  EDGEONE_ACCOUNT_ID: "50200064504"
};

async function testRealEdgeOneDeployment() {
  console.log('🚀 Testing REAL EdgeOne Pages Deployment...\n');
  
  try {
    // 1. Validate business data
    console.log('1️⃣ Validating business data...');
    const validatedData = validateBusinessData(testBusiness);
    console.log('✅ Validation passed:', validatedData);
    
    // 2. Generate business ID and subdomain
    console.log('\n2️⃣ Generating business ID and subdomain...');
    const businessId = generateUUID();
    const subdomain = generateSubdomain(validatedData.businessName);
    console.log('✅ Business ID:', businessId);
    console.log('✅ Subdomain:', subdomain);
    
    // 3. Load and process template
    console.log('\n3️⃣ Loading and processing template...');
    const template = await loadTemplate(validatedData.category);
    const html = await processTemplate(template, {
      ...validatedData,
      id: businessId,
      subdomain: subdomain,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(validatedData.address)}`,
      whatsappUrl: `https://wa.me/62${validatedData.whatsapp.replace(/^0/, '')}`,
      instagramUrl: `https://instagram.com/${validatedData.instagram}`
    });
    console.log('✅ HTML generated (length):', html.length);
    
    // 4. Deploy to EdgeOne Pages
    console.log('\n4️⃣ Deploying to EdgeOne Pages...');
    console.log('🌐 Target URL:', `https://${subdomain}.umkm.id`);
    console.log('🔑 Using API Token:', env.EDGEONE_API_TOKEN.substring(0, 10) + '...');
    console.log('👤 Account ID:', env.EDGEONE_ACCOUNT_ID);
    
    const deploymentResult = await deployToEdgeOnePages(subdomain, html, validatedData, env);
    
    if (deploymentResult.success) {
      console.log('\n🎉 SUCCESS! Website deployed to EdgeOne!');
      console.log('🌐 Live URL:', deploymentResult.url);
      console.log('🆔 Deployment ID:', deploymentResult.deploymentId);
      console.log('⏰ Deployed at:', new Date(deploymentResult.deployedAt).toLocaleString());
      
      // Test the deployed site
      console.log('\n5️⃣ Testing deployed website...');
      try {
        const response = await fetch(deploymentResult.url);
        if (response.ok) {
          console.log('✅ Website is live and accessible!');
        } else {
          console.log('⚠️ Website deployed but not yet accessible (may take a few minutes)');
        }
      } catch (error) {
        console.log('⚠️ Website deployed but not yet accessible (may take a few minutes)');
      }
      
    } else {
      console.log('\n❌ Deployment failed:', deploymentResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRealEdgeOneDeployment(); 