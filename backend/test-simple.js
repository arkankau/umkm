// Simple test script for backend core functions
import { validateBusinessData, generateUUID, generateSubdomain } from './src/utils/validation.js';
import { loadTemplate, processTemplate } from './src/utils/template.js';
import { deployToEdgeOne } from './src/utils/deployment.js';

// Test validation
console.log('🧪 Testing validation...');
try {
  const testData = {
    businessName: 'Warung Pak Budi',
    ownerName: 'Budi Santoso',
    description: 'Warung makan tradisional dengan cita rasa autentik Indonesia',
    category: 'restaurant',
    products: 'Nasi goreng, Mie goreng, Soto ayam, Es teh manis',
    phone: '081234567890',
    email: 'budi@warung.com',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    whatsapp: '081234567890',
    instagram: 'warungpakbudi'
  };
  
  const validated = validateBusinessData(testData);
  console.log('✅ Validation passed:', validated);
} catch (error) {
  console.error('❌ Validation failed:', error.message);
}

// Test UUID generation
console.log('\n🧪 Testing UUID generation...');
const uuid = generateUUID();
console.log('✅ UUID generated:', uuid);

// Test subdomain generation
console.log('\n🧪 Testing subdomain generation...');
const subdomain = generateSubdomain('Warung Pak Budi');
console.log('✅ Subdomain generated:', subdomain);

// Test template loading
console.log('\n🧪 Testing template loading...');
try {
  const template = await loadTemplate('restaurant');
  console.log('✅ Template loaded (length):', template.length);
} catch (error) {
  console.error('❌ Template loading failed:', error.message);
}

// Test template processing
console.log('\n🧪 Testing template processing...');
try {
  const template = await loadTemplate('restaurant');
  const businessData = {
    businessName: 'Warung Pak Budi',
    ownerName: 'Budi Santoso',
    description: 'Warung makan tradisional dengan cita rasa autentik Indonesia',
    category: 'restaurant',
    products: 'Nasi goreng, Mie goreng, Soto ayam, Es teh manis',
    phone: '081234567890',
    email: 'budi@warung.com',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    whatsapp: '081234567890',
    instagram: 'warungpakbudi',
    subdomain: 'warungpakbudi',
    websiteUrl: 'https://warungpakbudi.umkm.id'
  };
  
  const html = processTemplate(template, businessData);
  console.log('✅ Template processed (length):', html.length);
  console.log('✅ Business name in HTML:', html.includes('Warung Pak Budi'));
  console.log('✅ Phone number in HTML:', html.includes('081234567890'));
} catch (error) {
  console.error('❌ Template processing failed:', error.message);
}

// Test deployment simulation
console.log('\n🧪 Testing deployment simulation...');
try {
  const deployment = await deployToEdgeOne('testbusiness', '<html>test</html>', {}, {});
  console.log('✅ Deployment result:', deployment);
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
}

console.log('\n✅ All core function tests completed!'); 