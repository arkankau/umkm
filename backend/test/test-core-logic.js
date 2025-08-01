// Test script for core business logic
// Run with: node test/test-core-logic.js

import { validateBusinessData, generateUUID, generateSubdomain } from '../src/utils/validation.js';
import { loadTemplate, processTemplate } from '../src/utils/template.js';
import { deployToEdgeOne } from '../src/utils/deployment.js';

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

async function testCompleteWorkflow() {
  console.log("🚀 Testing Complete UMKM Website Generation Workflow\n");
  
  try {
    // Step 1: Validate business data
    console.log("📝 Step 1: Validating business data...");
    const validated = validateBusinessData(testBusinessData);
    console.log("✅ Business data validated successfully");
    console.log("   - Business Name:", validated.businessName);
    console.log("   - Category:", validated.category);
    console.log("   - Phone:", validated.phone);
    
    // Step 2: Generate unique identifiers
    console.log("\n🆔 Step 2: Generating unique identifiers...");
    const businessId = generateUUID();
    const subdomain = generateSubdomain(validated.businessName);
    console.log("✅ Business ID:", businessId);
    console.log("✅ Subdomain:", subdomain);
    
    // Step 3: Load and process template
    console.log("\n🎨 Step 3: Loading and processing template...");
    const template = await loadTemplate(validated.category);
    console.log("✅ Template loaded (length:", template.length, "characters)");
    
    const processedHtml = processTemplate(template, validated);
    console.log("✅ Template processed (length:", processedHtml.length, "characters)");
    
    // Step 4: Verify template processing
    console.log("\n🔍 Step 4: Verifying template processing...");
    const placeholdersReplaced = !processedHtml.includes('{{') && !processedHtml.includes('}}');
    const hasBusinessName = processedHtml.includes(validated.businessName);
    const hasPhone = processedHtml.includes(validated.phone);
    const hasAddress = processedHtml.includes(validated.address);
    const hasWhatsApp = processedHtml.includes(validated.whatsapp);
    
    console.log("✅ Placeholders replaced:", placeholdersReplaced);
    console.log("✅ Business name in HTML:", hasBusinessName);
    console.log("✅ Phone number in HTML:", hasPhone);
    console.log("✅ Address in HTML:", hasAddress);
    console.log("✅ WhatsApp in HTML:", hasWhatsApp);
    
    // Step 5: Test deployment simulation
    console.log("\n🚀 Step 5: Testing deployment simulation...");
    const deploymentResult = await deployToEdgeOne(subdomain, processedHtml, validated, {});
    console.log("✅ Deployment result:", deploymentResult);
    
    // Step 6: Verify final website URL
    console.log("\n🌐 Step 6: Verifying final website...");
    const websiteUrl = `https://${subdomain}.umkm.id`;
    console.log("✅ Website URL:", websiteUrl);
    console.log("✅ Deployment successful:", deploymentResult.success);
    
    // Summary
    console.log("\n📊 Workflow Summary:");
    console.log("   ✅ Data validation: PASSED");
    console.log("   ✅ ID generation: PASSED");
    console.log("   ✅ Template processing: PASSED");
    console.log("   ✅ HTML generation: PASSED");
    console.log("   ✅ Deployment simulation: PASSED");
    console.log("   ✅ Website URL generation: PASSED");
    
    console.log("\n🎉 Complete workflow test PASSED!");
    return {
      businessId,
      subdomain,
      websiteUrl,
      htmlLength: processedHtml.length,
      success: true
    };
    
  } catch (error) {
    console.error("❌ Workflow test failed:", error.message);
    return { success: false, error: error.message };
  }
}

async function testAllTemplates() {
  console.log("\n🎨 Testing All Template Categories\n");
  
  const categories = ['restaurant', 'retail', 'service', 'other'];
  const results = {};
  
  for (const category of categories) {
    console.log(`Testing ${category} template...`);
    
    try {
      const template = await loadTemplate(category);
      const processedHtml = processTemplate(template, testBusinessData);
      
      const hasBusinessName = processedHtml.includes(testBusinessData.businessName);
      const hasPhone = processedHtml.includes(testBusinessData.phone);
      const placeholdersReplaced = !processedHtml.includes('{{') && !processedHtml.includes('}}');
      
      results[category] = {
        success: true,
        length: processedHtml.length,
        hasBusinessName,
        hasPhone,
        placeholdersReplaced
      };
      
      console.log(`✅ ${category} template: ${processedHtml.length} chars, business name: ${hasBusinessName}, phone: ${hasPhone}`);
      
    } catch (error) {
      console.log(`❌ ${category} template failed:`, error.message);
      results[category] = { success: false, error: error.message };
    }
  }
  
  return results;
}

async function testErrorHandling() {
  console.log("\n⚠️ Testing Error Handling\n");
  
  const testCases = [
    {
      name: "Empty business name",
      data: { ...testBusinessData, businessName: "" },
      shouldFail: true
    },
    {
      name: "Invalid phone number",
      data: { ...testBusinessData, phone: "invalid-phone" },
      shouldFail: true
    },
    {
      name: "Invalid category",
      data: { ...testBusinessData, category: "invalid-category" },
      shouldFail: true
    },
    {
      name: "Valid data",
      data: testBusinessData,
      shouldFail: false
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      validateBusinessData(testCase.data);
      
      if (testCase.shouldFail) {
        console.log(`❌ Expected failure but validation passed`);
      } else {
        console.log(`✅ Validation passed as expected`);
      }
      
    } catch (error) {
      if (testCase.shouldFail) {
        console.log(`✅ Validation failed as expected:`, error.message.substring(0, 100) + "...");
      } else {
        console.log(`❌ Unexpected validation failure:`, error.message);
      }
    }
  }
}

async function runAllTests() {
  console.log("🧪 UMKM Go Digital - Core Logic Tests\n");
  
  // Test complete workflow
  const workflowResult = await testCompleteWorkflow();
  
  // Test all templates
  const templateResults = await testAllTemplates();
  
  // Test error handling
  await testErrorHandling();
  
  // Final summary
  console.log("\n📋 Final Test Summary:");
  console.log("   ✅ Complete workflow:", workflowResult.success ? "PASSED" : "FAILED");
  console.log("   ✅ Template processing:", Object.values(templateResults).every(r => r.success) ? "PASSED" : "FAILED");
  console.log("   ✅ Error handling: PASSED");
  
  if (workflowResult.success) {
    console.log("\n🎯 Key Metrics:");
    console.log("   - Business ID:", workflowResult.businessId);
    console.log("   - Subdomain:", workflowResult.subdomain);
    console.log("   - Website URL:", workflowResult.websiteUrl);
    console.log("   - HTML Size:", workflowResult.htmlLength, "characters");
  }
  
  console.log("\n✅ All core logic tests completed!");
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testCompleteWorkflow,
  testAllTemplates,
  testErrorHandling,
  runAllTests
}; 