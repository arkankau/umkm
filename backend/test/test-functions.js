// Test script for UMKM Go Digital EdgeOne Functions
// Run with: node test/test-functions.js

import { validateBusinessData, generateUUID, generateSubdomain } from '../src/utils/validation.js';
import { loadTemplate, processTemplate } from '../src/utils/template.js';
import { deployToEdgeOne } from '../src/utils/deployment.js';

// Mock environment for testing
const mockEnv = {
  UMKM_KV: {
    put: async (key, value) => {
      console.log(`KV PUT: ${key} -> ${value}`);
      return true;
    },
    get: async (key) => {
      console.log(`KV GET: ${key}`);
      return null;
    }
  }
};

// Test business data
const testBusinessData = {
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

async function testValidation() {
  console.log("🧪 Testing validation...");
  
  try {
    const validated = validateBusinessData(testBusinessData);
    console.log("✅ Validation passed:", validated);
    
    const uuid = generateUUID();
    console.log("✅ UUID generated:", uuid);
    
    const subdomain = generateSubdomain(testBusinessData.businessName);
    console.log("✅ Subdomain generated:", subdomain);
    
  } catch (error) {
    console.error("❌ Validation failed:", error.message);
  }
}

async function testTemplateProcessing() {
  console.log("\n🧪 Testing template processing...");
  
  try {
    const template = await loadTemplate('restaurant');
    console.log("✅ Template loaded (length):", template.length);
    
    const processedHtml = processTemplate(template, testBusinessData);
    console.log("✅ Template processed (length):", processedHtml.length);
    
    // Check if placeholders were replaced
    const hasPlaceholders = processedHtml.includes('{{') || processedHtml.includes('}}');
    console.log("✅ Placeholders replaced:", !hasPlaceholders);
    
    // Check for specific business data in processed HTML
    const hasBusinessName = processedHtml.includes(testBusinessData.businessName);
    const hasPhone = processedHtml.includes(testBusinessData.phone);
    console.log("✅ Business name in HTML:", hasBusinessName);
    console.log("✅ Phone number in HTML:", hasPhone);
    
  } catch (error) {
    console.error("❌ Template processing failed:", error.message);
  }
}

async function testDeployment() {
  console.log("\n🧪 Testing deployment simulation...");
  
  try {
    const html = "<html><body><h1>Test Site</h1></body></html>";
    const result = await deployToEdgeOne("testbusiness", html, testBusinessData, mockEnv);
    
    console.log("✅ Deployment result:", result);
    
  } catch (error) {
    console.error("❌ Deployment test failed:", error.message);
  }
}

async function testErrorHandling() {
  console.log("\n🧪 Testing error handling...");
  
  try {
    // Test invalid business data
    const invalidData = {
      businessName: "", // Empty required field
      phone: "invalid-phone" // Invalid phone format
    };
    
    validateBusinessData(invalidData);
    console.log("❌ Should have thrown validation error");
    
  } catch (error) {
    console.log("✅ Validation error caught:", error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting UMKM Go Digital Function Tests\n");
  
  await testValidation();
  await testTemplateProcessing();
  await testDeployment();
  await testErrorHandling();
  
  console.log("\n✅ All tests completed!");
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testValidation,
  testTemplateProcessing,
  testDeployment,
  testErrorHandling,
  runAllTests
}; 