// Next.js API route for get-business
import supabaseClient from '../../app/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed' 
    });
  }

  try {
    const { businessId, subdomain } = req.query;

    if (!businessId && !subdomain) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Business ID or subdomain is required'
      });
    }

    let query = supabaseClient
      .from('businesses')
      .select('*');

    if (businessId) {
      query = query.eq('id', businessId);
    } else if (subdomain) {
      query = query.eq('subdomain', subdomain);
    }

    const { data: business, error } = await query.single();

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business not found'
      });
    }

    // Transform the data to match the expected API response format
    const response = {
      id: business.id,
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
      websiteUrl: business.website_url,
      subdomain: business.subdomain,
      status: business.status,
      createdAt: new Date(business.created_at).getTime(),
      deployedAt: business.deployed_at ? new Date(business.deployed_at).getTime() : null,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
      whatsappUrl: business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '')}` : null,
      instagramUrl: business.instagram ? `https://instagram.com/${business.instagram.replace('@', '')}` : null
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Get business error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get business info'
    });
  }
} 