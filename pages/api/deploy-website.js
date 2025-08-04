import { createClient } from '@supabase/supabase-js';
import { AIWebsiteService } from '../../lib/ai-website-service';

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
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing businessId' });
    }

    console.log('Deploying website for business:', businessId);

    // Get business data from database (ensure it belongs to the user)
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .eq('user_id', userId)
      .single();

    if (businessError || !business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check if we have saved HTML modifications
    let htmlToDeploy = business.website_html;
    
    if (!htmlToDeploy) {
      // Generate fresh HTML if no saved modifications
      console.log('No saved HTML found, generating fresh website...');
      const aiService = new AIWebsiteService();
      const generatedWebsite = await aiService.generateWebsite({
        businessName: business.business_name,
        ownerName: business.owner_name,
        description: business.description,
        category: business.category,
        products: business.products,
        phone: business.phone,
        email: business.email,
        address: business.address,
        whatsapp: business.whatsapp,
        instagram: business.instagram,
        logoUrl: business.logo_url
      });
      
      htmlToDeploy = generatedWebsite.html;
      
      // Save the generated HTML to database
      await supabase
        .from('businesses')
        .update({ website_html: htmlToDeploy })
        .eq('id', businessId);
    }

    // Deploy using the existing submit-business logic
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000'}/api/submit-business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessName: business.business_name,
        ownerName: business.owner_name,
        description: business.description,
        category: business.category,
        products: business.products,
        phone: business.phone,
        email: business.email,
        address: business.address,
        whatsapp: business.whatsapp,
        instagram: business.instagram,
        logoUrl: business.logo_url,
        customHtml: htmlToDeploy, // Pass the HTML to deploy
        forceCustomHtml: true, // Flag to ensure custom HTML is used
        existingBusinessId: businessId // Pass the existing business ID
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to deploy website');
    }

    const result = await response.json();

    // Update business status to 'live'
    await supabase
      .from('businesses')
      .update({ 
        status: 'live',
        website_url: result.url,
        deployed_at: new Date().toISOString()
      })
      .eq('id', businessId);

    return res.status(200).json({
      success: true,
      businessId: businessId,
      url: result.url,
      message: 'Website deployed successfully'
    });

  } catch (error) {
    console.error('Error in deploy-website:', error);
    return res.status(500).json({ 
      error: 'Failed to deploy website',
      details: error.message 
    });
  }
} 