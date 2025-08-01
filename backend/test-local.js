// Local test script for backend functions
import { submitBusiness } from './src/api/submit-business.js';
import { generateSite } from './src/api/generate-site.js';
import { getStatus } from './src/api/get-status.js';
import { getBusiness } from './src/api/get-business.js';

// Mock environment for testing
const mockEnv = {
  UMKM_KV: {
    put: async (key, value) => {
      console.log(`KV PUT: ${key} = ${value}`);
      return Promise.resolve();
    },
    get: async (key) => {
      console.log(`KV GET: ${key}`);
      // Return mock data for testing
      if (key.startsWith('business:')) {
        return JSON.stringify({
          id: 'test-business-id',
          businessName: 'Test Business',
          ownerName: 'Test Owner',
          description: 'Test description',
          category: 'restaurant',
          products: 'Test products',
          phone: '081234567890',
          address: 'Test address',
          subdomain: 'testbusiness',
          status: 'processing',
          createdAt: Date.now()
        });
      }
      if (key.startsWith('subdomain:')) {
        return 'test-business-id';
      }
      return null;
    }
  },
  EDGEONE_API_TOKEN: 'test-token',
  EDGEONE_ACCOUNT_ID: 'test-account',
  EDGEONE_ZONE_ID: 'test-zone'
};

// Mock context
const mockCtx = {
  waitUntil: (promise) => {
    console.log('Context waitUntil called');
    return promise;
  }
};

// Test functions
async function testSubmitBusiness() {
  console.log('\n🧪 Testing submit-business...');
  
  const requestBody = JSON.stringify({
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
  });

  try {
    const response = await submitBusiness({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
      url: 'http://localhost/api/submit-business'
    }, mockEnv, mockCtx);
    const result = await response.json();
    console.log('✅ Submit business result:', result);
    return result.businessId;
  } catch (error) {
    console.error('❌ Submit business error:', error);
    return null;
  }
}

async function testGenerateSite(businessId) {
  console.log('\n🧪 Testing generate-site...');
  
  const requestBody = JSON.stringify({ businessId });

  try {
    const response = await generateSite({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
      url: 'http://localhost/api/generate-site'
    }, mockEnv, mockCtx);
    const result = await response.json();
    console.log('✅ Generate site result:', result);
  } catch (error) {
    console.error('❌ Generate site error:', error);
  }
}

async function testGetStatus(businessId) {
  console.log('\n🧪 Testing get-status...');

  try {
    const response = await getStatus({
      method: 'GET',
      url: `http://localhost/api/get-status?businessId=${businessId}`
    }, mockEnv, mockCtx);
    const result = await response.json();
    console.log('✅ Get status result:', result);
  } catch (error) {
    console.error('❌ Get status error:', error);
  }
}

async function testGetBusiness(businessId) {
  console.log('\n🧪 Testing get-business...');

  try {
    const response = await getBusiness({
      method: 'GET',
      url: `http://localhost/api/get-business?businessId=${businessId}`
    }, mockEnv, mockCtx);
    const result = await response.json();
    console.log('✅ Get business result:', result);
  } catch (error) {
    console.error('❌ Get business error:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting backend function tests...\n');
  
  const businessId = await testSubmitBusiness();
  if (businessId) {
    await testGenerateSite(businessId);
    await testGetStatus(businessId);
    await testGetBusiness(businessId);
  }
  
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error); 