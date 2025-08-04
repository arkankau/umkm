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

    const {
      businessName,
      ownerName,
      description,
      category,
      products,
      phone,
      email,
      address,
      whatsapp,
      instagram,
      logoUrl
    } = req.body;

    // Validate required fields
    if (!businessName || !ownerName || !description || !phone || !address) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['businessName', 'ownerName', 'description', 'phone', 'address']
      });
    }

    console.log('Saving business data to Supabase:', businessName);

    // Generate a unique business ID as UUID
    const businessId = crypto.randomUUID();
    
    // Generate subdomain
    const subdomain = `${businessName.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 1000000)}`;

    // Save to businesses database
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        business_id: businessId, // Add the custom business ID field
        business_name: businessName,
        owner_name: ownerName,
        description: description,
        category: category || 'other',
        products: products || '',
        phone: phone,
        email: email || '',
        address: address,
        whatsapp: whatsapp || '',
        instagram: instagram || '',
        logo_url: logoUrl || '',
        subdomain: subdomain,
        user_id: userId, // Add user_id for proper ownership
        status: 'processing', // Use valid status from the check constraint
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ 
        error: 'Failed to save business data',
        details: error.message 
      });
    }

    console.log('Business data saved to Supabase with ID:', data.id);

    return res.status(200).json({
      success: true,
      businessId: data.id,
      subdomain: subdomain,
      message: 'Business data saved successfully'
    });

  } catch (error) {
    console.error('Error in save-business-data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 