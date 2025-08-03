import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing database connection...');
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Supabase Service Key:', supabaseServiceKey ? 'Set' : 'Missing');
    console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

    if (!supabaseUrl) {
      return res.status(500).json({ 
        error: 'Missing Supabase URL',
        supabaseUrl: !!supabaseUrl
      });
    }

    // Use service role key if available, otherwise fall back to anon key
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;

    if (!supabaseKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase API key',
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey,
        supabaseAnonKey: !!supabaseAnonKey
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check if we can connect to the database
    console.log('Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('businesses')
      .select('id, business_name')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: testError.message
      });
    }

    console.log('Database connection successful');

    // Test 2: Check if website_html column exists
    console.log('Testing website_html column...');
    const { data: columnTest, error: columnError } = await supabase
      .from('businesses')
      .select('id, website_html')
      .limit(1);

    if (columnError && columnError.message.includes('website_html')) {
      console.log('website_html column does not exist');
      return res.status(200).json({ 
        success: true,
        message: 'Database connected but website_html column missing',
        databaseConnected: true,
        websiteHtmlColumnExists: false,
        suggestion: 'Run the SQL migration to add website_html column'
      });
    }

    console.log('website_html column exists');

    // Test 3: Try to update a test record
    if (testData && testData.length > 0) {
      const testBusinessId = testData[0].id;
      console.log('Testing update with business ID:', testBusinessId);
      
      const { data: updateData, error: updateError } = await supabase
        .from('businesses')
        .update({ 
          website_html: '<html><body>Test HTML</body></html>',
          updated_at: new Date().toISOString()
        })
        .eq('id', testBusinessId)
        .select();

      if (updateError) {
        console.error('Update test failed:', updateError);
        return res.status(500).json({ 
          error: 'Update test failed',
          details: updateError.message,
          databaseConnected: true,
          websiteHtmlColumnExists: true
        });
      }

      console.log('Update test successful');
    }

    res.status(200).json({ 
      success: true,
      message: 'All tests passed',
      databaseConnected: true,
      websiteHtmlColumnExists: true,
      updateTest: 'Passed'
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 