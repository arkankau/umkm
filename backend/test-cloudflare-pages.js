// Test Cloudflare Pages API (EdgeOne might use this)
const env = {
  EDGEONE_API_TOKEN: "ueFiz8PVO5byDF8oMiy2tYbT8dw4zhHt",
  EDGEONE_ACCOUNT_ID: "50200064504"
};

async function testCloudflarePagesAPI() {
  console.log('🔍 Testing Cloudflare Pages API...\n');
  
  // Test different Cloudflare API endpoints
  const endpoints = [
    {
      url: `https://api.cloudflare.com/client/v4/accounts/${env.EDGEONE_ACCOUNT_ID}`,
      description: 'Account info'
    },
    {
      url: `https://api.cloudflare.com/client/v4/accounts/${env.EDGEONE_ACCOUNT_ID}/pages/projects`,
      description: 'Pages projects'
    },
    {
      url: `https://api.cloudflare.com/client/v4/user`,
      description: 'User info'
    }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.description}`);
    console.log(`URL: ${endpoint.url}`);
    try {
      const response = await fetch(endpoint.url, {
        headers: {
          'Authorization': `Bearer ${env.EDGEONE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`📄 Response: ${JSON.stringify(data, null, 2).substring(0, 300)}...`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    console.log('');
  }
}

testCloudflarePagesAPI(); 