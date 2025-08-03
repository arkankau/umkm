// Next.js API route for list-businesses
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, business_name, business_id, subdomain, created_at')
      .limit(5);

    if (error) {
      console.error('Error fetching businesses:', error);
      return res.status(500).json({ error: 'Failed to fetch businesses', details: error });
    }

    return res.status(200).json({ 
      success: true, 
      businesses: data,
      count: data.length
    });

  } catch (error) {
    console.error('Error in list-businesses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 