import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing businessId' });
    }

    console.log('Getting saved HTML for business:', businessId);

    // Get business data from database
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('website_html, business_name')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (!business.website_html) {
      return res.status(200).json({
        success: false,
        message: 'No saved HTML found for this business'
      });
    }

    console.log('Found saved HTML for business:', business.business_name);

    return res.status(200).json({
      success: true,
      html: business.website_html,
      businessName: business.business_name
    });

  } catch (error) {
    console.error('Error in get-saved-html:', error);
    return res.status(500).json({ 
      error: 'Failed to get saved HTML',
      details: error.message 
    });
  }
} 