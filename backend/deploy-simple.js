import { loadTemplate, processTemplate } from './src/utils/template.js';
import { validateBusinessData } from './src/utils/validation.js';
import { generateUUID, generateSubdomain } from './src/utils/validation.js';
import fs from 'fs/promises';
import path from 'path';

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

async function createWebsite() {
  console.log('🚀 Creating website for deployment...\n');
  
  try {
    // 1. Validate business data
    console.log('1️⃣ Validating business data...');
    const validatedData = validateBusinessData(testBusiness);
    console.log('✅ Validation passed');
    
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
    
    // 4. Create deployment directory
    console.log('\n4️⃣ Creating deployment files...');
    const deployDir = path.join(process.cwd(), 'deploy', subdomain);
    await fs.mkdir(deployDir, { recursive: true });
    
    // 5. Save HTML file
    const htmlPath = path.join(deployDir, 'index.html');
    await fs.writeFile(htmlPath, html);
    console.log('✅ HTML saved to:', htmlPath);
    
    // 6. Create deployment info
    const deploymentInfo = {
      businessId,
      subdomain,
      url: `https://${subdomain}.umkm.id`,
      businessName: validatedData.businessName,
      deployedAt: new Date().toISOString(),
      files: ['index.html']
    };
    
    const infoPath = path.join(deployDir, 'deployment-info.json');
    await fs.writeFile(infoPath, JSON.stringify(deploymentInfo, null, 2));
    console.log('✅ Deployment info saved to:', infoPath);
    
    console.log('\n🎉 Website created successfully!');
    console.log('📁 Deployment directory:', deployDir);
    console.log('🌐 Target URL:', deploymentInfo.url);
    console.log('📄 Files created:');
    console.log('   - index.html (main website)');
    console.log('   - deployment-info.json (deployment details)');
    
    console.log('\n📋 Next steps:');
    console.log('1. Upload the files to your web hosting');
    console.log('2. Configure DNS for the subdomain');
    console.log('3. Set up SSL certificate');
    
  } catch (error) {
    console.error('❌ Error creating website:', error);
  }
}

// Run the website creation
createWebsite(); 