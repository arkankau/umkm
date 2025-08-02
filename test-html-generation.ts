import { BusinessData } from './lib/api';
import { generateCompleteHTML } from './lib/website-generator';

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

function testHTMLGeneration() {
  console.log('📝 Testing HTML generation...\n');
  
  try {
    // Generate complete HTML
    const html = generateCompleteHTML(testBusinessData);
    
    console.log('✅ HTML generated successfully!');
    console.log(`📄 HTML length: ${html.length} characters`);
    console.log(`📄 HTML size: ${(html.length / 1024).toFixed(2)} KB\n`);
    
    // Check if CSS and JS are properly embedded
    const hasCSS = html.includes('/* Reset and Base Styles */');
    const hasJS = html.includes('// Smooth scrolling for navigation links');
    const hasBusinessName = html.includes(testBusinessData.businessName);
    const hasPhone = html.includes(testBusinessData.phone);
    
    console.log('🔍 Content verification:');
    console.log(`   CSS embedded: ${hasCSS ? '✅' : '❌'}`);
    console.log(`   JS embedded: ${hasJS ? '✅' : '❌'}`);
    console.log(`   Business name: ${hasBusinessName ? '✅' : '❌'}`);
    console.log(`   Phone number: ${hasPhone ? '✅' : '❌'}`);
    
    // Save HTML to file for inspection
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, 'test-website.html');
    fs.writeFileSync(outputPath, html);
    
    console.log(`\n💾 HTML saved to: ${outputPath}`);
    console.log('🌐 You can open this file in a browser to preview the website');
    
  } catch (error) {
    console.error('❌ HTML generation failed:', error);
  }
  
  console.log('\n🏁 Test completed!');
}

// Run the test
testHTMLGeneration(); 