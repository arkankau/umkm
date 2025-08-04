// Test script for API endpoints without Wrangler
// Run with: node test/test-api-endpoints.js

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

// Mock request object
function createMockRequest(method, path, body = null) {
  return {
    method,
    url: `http://localhost:8787${path}`,
    json: async () => body,
    headers: new Map([['content-type', 'application/json']])
  };
}

// Mock response object
function createMockResponse() {
  let status = 200;
  let body = '';
  let headers = new Map();
  
  return {
    status: (code) => { status = code; return this; },
    headers: (newHeaders) => { headers = new Map(Object.entries(newHeaders)); return this; },
    json: (data) => { body = JSON.stringify(data); return this; },
    text: (data) => { body = data; return this; },
    getStatus: () => status,
    getBody: () => body,
    getHeaders: () => headers
  };
}

async function testSubmitBusiness() {
  console.log("🧪 Testing /api/submit-business endpoint...");
  
  try {
    // Import the function
    const { submitBusiness } = await import('../src/api/submit-business.js');
    
    // Create mock request
    const request = createMockRequest('POST', '/api/submit-business', testBusinessData);
    const response = createMockResponse();
    
    // Call the function
    const result = await submitBusiness(request, mockEnv, { waitUntil: () => {} });
    
    console.log("✅ Submit business response status:", result.status);
    console.log("✅ Submit business response body:", result.body);
    
    // Parse the response to get businessId
    const responseData = JSON.parse(result.body);
    if (responseData.success && responseData.businessId) {
      console.log("✅ Business ID generated:", responseData.businessId);
      console.log("✅ Subdomain generated:", responseData.subdomain);
      return responseData.businessId;
    } else {
      console.log("❌ Failed to get business ID");
      return null;
    }
    
  } catch (error) {
    console.error("❌ Submit business test failed:", error.message);
    return null;
  }
}

async function testGenerateSite(businessId) {
  console.log("\n🧪 Testing /api/generate-site endpoint...");
  
  if (!businessId) {
    console.log("❌ No business ID provided, skipping generate site test");
    return;
  }
  
  try {
    // Import the function
    const { generateSite } = await import('../src/api/generate-site.js');
    
    // Create mock request
    const request = createMockRequest('POST', '/api/generate-site', { businessId });
    const response = createMockResponse();
    
    // Call the function
    const result = await generateSite(request, mockEnv, { waitUntil: () => {} });
    
    console.log("✅ Generate site response status:", result.status);
    console.log("✅ Generate site response body:", result.body);
    
    // Parse the response
    const responseData = JSON.parse(result.body);
    if (responseData.success) {
      console.log("✅ Website URL:", responseData.url);
      console.log("✅ Processing time:", responseData.processingTime, "ms");
    }
    
  } catch (error) {
    console.error("❌ Generate site test failed:", error.message);
  }
}

async function testGetStatus(businessId) {
  console.log("\n🧪 Testing /api/get-status endpoint...");
  
  if (!businessId) {
    console.log("❌ No business ID provided, skipping status test");
    return;
  }
  
  try {
    // Import the function
    const { getStatus } = await import('../src/api/get-status.js');
    
    // Create mock request
    const request = createMockRequest('GET', `/api/get-status?businessId=${businessId}`);
    const response = createMockResponse();
    
    // Call the function
    const result = await getStatus(request, mockEnv, { waitUntil: () => {} });
    
    console.log("✅ Get status response status:", result.status);
    console.log("✅ Get status response body:", result.body);
    
  } catch (error) {
    console.error("❌ Get status test failed:", error.message);
  }
}

async function testGetBusiness(businessId) {
  console.log("\n🧪 Testing /api/get-business endpoint...");
  
  if (!businessId) {
    console.log("❌ No business ID provided, skipping get business test");
    return;
  }
  
  try {
    // Import the function
    const { getBusiness } = await import('../src/api/get-business.js');
    
    // Create mock request
    const request = createMockRequest('GET', `/api/get-business?businessId=${businessId}`);
    const response = createMockResponse();
    
    // Call the function
    const result = await getBusiness(request, mockEnv, { waitUntil: () => {} });
    
    console.log("✅ Get business response status:", result.status);
    console.log("✅ Get business response body:", result.body);
    
  } catch (error) {
    console.error("❌ Get business test failed:", error.message);
  }
}

async function runAPITests() {
  console.log("🚀 Starting API Endpoint Tests\n");
  
  // Test submit business
  const businessId = await testSubmitBusiness();
  
  // Test generate site
  await testGenerateSite(businessId);
  
  // Test get status
  await testGetStatus(businessId);
  
  // Test get business
  await testGetBusiness(businessId);
  
  console.log("\n✅ All API endpoint tests completed!");
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests().catch(console.error);
}

export {
  testSubmitBusiness,
  testGenerateSite,
  testGetStatus,
  testGetBusiness,
  runAPITests
}; 