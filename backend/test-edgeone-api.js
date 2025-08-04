// Test EdgeOne API connectivity
const env = {
  EDGEONE_API_TOKEN: "ueFiz8PVO5byDF8oMiy2tYbT8dw4zhHt",
  EDGEONE_ACCOUNT_ID: "50200064504"
};

async function testEdgeOneAPI() {
  console.log('🔍 Testing EdgeOne API connectivity...\n');
  
  const endpoints = [
    'https://api.edgeone.com/v1',
    'https://api.cloudflare.com/client/v4',
    'https://api.cloudflare.com/client/v4/accounts/' + env.EDGEONE_ACCOUNT_ID
  ];
  
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${env.EDGEONE_API_TOKEN}`
        }
      });
      console.log(`✅ Status: ${response.status}`);
      if (response.ok) {
        const data = await response.text();
        console.log(`📄 Response: ${data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

testEdgeOneAPI(); 