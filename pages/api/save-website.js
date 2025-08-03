import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing Supabase URL');
}

// Use service role key if available, otherwise fall back to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
  console.error('Missing Supabase API key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId, subdomain, websiteHtml, modificationRequest } = req.body;

    // Validate required fields
    if (!websiteHtml) {
      return res.status(400).json({ error: 'Missing website HTML' });
    }

    if (!businessId && !subdomain) {
      console.log('No businessId or subdomain provided, cannot save');
      return res.status(400).json({ 
        error: 'Missing business identifier (businessId or subdomain)',
        receivedData: { businessId, subdomain }
      });
    }

    console.log('=== SAVE API DEBUG START ===');
    console.log('Saving website modifications for business:', businessId || subdomain);
    console.log('Request body:', { 
      businessId: businessId || 'undefined', 
      subdomain: subdomain || 'undefined', 
      htmlLength: websiteHtml ? websiteHtml.length : 0,
      hasBusinessId: !!businessId,
      hasSubdomain: !!subdomain
    });
    console.log('businessId type:', typeof businessId);
    console.log('businessId value:', businessId);
    console.log('subdomain type:', typeof subdomain);
    console.log('subdomain value:', subdomain);
    console.log('=== SAVE API DEBUG END ===');

    // First, try to find the business record
    let businessQuery = supabase.from('businesses').select('id, business_name, subdomain');
    
    // Strategy 1: Try businessId as id (if it's a valid UUID)
    if (businessId && businessId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      businessQuery = businessQuery.eq('id', businessId);
      console.log('Strategy 1: Searching by id:', businessId);
    } 
    // Strategy 1.5: Try businessId as business_id (if it's a valid UUID)
    else if (businessId && businessId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      businessQuery = businessQuery.eq('business_id', businessId);
      console.log('Strategy 1.5: Searching by business_id:', businessId);
    } 
    // Strategy 2: Try subdomain
    else if (subdomain) {
      businessQuery = businessQuery.eq('subdomain', subdomain);
      console.log('Strategy 2: Searching by subdomain:', subdomain);
    } 
    // Strategy 3: Try businessId as business name (if it's not UUID)
    else if (businessId) {
      businessQuery = businessQuery.ilike('business_name', `%${businessId}%`);
      console.log('Strategy 3: Searching by business name (fallback):', businessId);
    }

    const { data: businessData, error: findError } = await businessQuery;

        if (findError) {
      console.error('Error finding business:', findError);
      return res.status(404).json({ 
        error: 'Business not found', 
        details: findError.message,
        businessId,
        subdomain
      });
    }

    if (!businessData || businessData.length === 0) {
      return res.status(404).json({ 
        error: 'Business not found',
        businessId,
        subdomain
      });
    }

    // If multiple businesses found, use the first one (most recent)
    const business = businessData.length > 1 ? businessData[0] : businessData[0];
    console.log('Found business:', business);

    // Check if website_html column exists by trying to update it
    let updateData = { 
      updated_at: new Date().toISOString()
    };

    // First, try to update with website_html
    let { data, error } = await supabase
      .from('businesses')
      .update({ 
        website_html: websiteHtml,
        updated_at: new Date().toISOString()
      })
      .eq('id', business.id)
      .select();

    // If that fails, the column might not exist, so try storing in website_url as base64
    if (error && error.message.includes('column') && error.message.includes('website_html')) {
      console.log('website_html column does not exist, storing in website_url as base64');
      
      const base64Html = Buffer.from(websiteHtml).toString('base64');
      const dataUrl = `data:text/html;base64,${base64Html}`;
      
      ({ data, error } = await supabase
        .from('businesses')
        .update({ 
          website_url: dataUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', business.id)
        .select());
    }

    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ 
        error: 'Failed to save website',
        details: error.message,
        code: error.code
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Business not found after update' });
    }

    console.log('Website saved successfully');

    res.status(200).json({ 
      success: true,
      message: 'Website modifications saved successfully',
      businessId: businessId,
      modificationRequest: modificationRequest
    });

  } catch (error) {
    console.error('Error saving website:', error);
    res.status(500).json({ 
      error: 'Failed to save website',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 