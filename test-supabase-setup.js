const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('businessesNeo')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${data.length} business records in businessesNeo`);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

async function testStorageBucket() {
  console.log('🔍 Testing storage bucket...');
  
  try {
    // Test if we can list files in the bucket
    const { data, error } = await supabase.storage
      .from('productimages')
      .list();
    
    if (error) {
      console.error('❌ Storage bucket test failed:', error.message);
      return false;
    }
    
    console.log('✅ Storage bucket accessible');
    console.log(`📁 Found ${data.length} files in bucket`);
    return true;
  } catch (error) {
    console.error('❌ Storage bucket error:', error.message);
    return false;
  }
}

async function testBusinessCreation() {
  console.log('🔍 Testing business creation...');
  
  try {
    const testBusiness = {
      id: 'test-uuid-' + Date.now(),
      businessId: 'test-business-' + Date.now(),
      businessName: 'Test Business',
      ownerName: 'Test Owner',
      description: 'A test business for verification',
      category: 'other',
      products: 'Test products',
      phone: '081234567890',
      email: 'test@example.com',
      address: 'Test Address'
    };
    
    const { data, error } = await supabase
      .from('businessesNeo')
      .insert([testBusiness])
      .select();
    
    if (error) {
      console.error('❌ Business creation failed:', error.message);
      return false;
    }
    
    console.log('✅ Business creation successful');
    console.log(`🆔 Created business with ID: ${data[0].id}`);
    
    // Test products table
    const testProduct = {
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      business_id: data[0].id
    };
    
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([testProduct])
      .select();
    
    if (productError) {
      console.error('❌ Product creation failed:', productError.message);
      return false;
    }
    
    console.log('✅ Product creation successful');
    console.log(`🆔 Created product with ID: ${productData[0].id}`);
    
    // Clean up - delete the test product and business
    await supabase
      .from('products')
      .delete()
      .eq('id', productData[0].id);
    
    await supabase
      .from('businessesNeo')
      .delete()
      .eq('id', data[0].id);
    
    console.log('🧹 Test data cleaned up');
    return true;
  } catch (error) {
    console.error('❌ Business creation error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Supabase setup verification...\n');
  
  const tests = [
    { name: 'Database Connection', test: testDatabaseConnection },
    { name: 'Storage Bucket', test: testStorageBucket },
    { name: 'Business Creation', test: testBusinessCreation }
  ];
  
  let passedTests = 0;
  
  for (const { name, test } of tests) {
    console.log(`\n📋 Testing: ${name}`);
    const result = await test();
    if (result) {
      passedTests++;
    }
    console.log('─'.repeat(50));
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Your Supabase setup is working correctly.');
    console.log('\n✅ You can now:');
    console.log('   - Create and manage businesses');
    console.log('   - Generate and upload logos');
    console.log('   - Access the logo generator at /[id]/[businessId]/generate-logo');
  } else {
    console.log('❌ Some tests failed. Please check the error messages above.');
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Verify your environment variables in .env.local');
    console.log('   2. Run the SQL setup script in Supabase dashboard');
    console.log('   3. Check the Supabase setup guide: SUPABASE_SETUP_GUIDE.md');
  }
}

// Run the tests
runAllTests().catch(console.error); 