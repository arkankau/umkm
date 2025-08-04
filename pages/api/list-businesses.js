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
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the user token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = userData.user.id;

    // Fetch businesses belonging to the authenticated user
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
      return res.status(500).json({ error: 'Database Error', details: error });
    }

    return res.status(200).json({ 
      success: true, 
      businesses: data || [],
      count: data ? data.length : 0
    });

  } catch (error) {
    console.error('Error in list-businesses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 