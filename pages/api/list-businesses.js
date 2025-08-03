// Next.js API route for list-businesses
import supabaseClient from '../../app/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed' 
    });
  }

  try {
    const { limit = 50, offset = 0, status } = req.query;

    let query = supabaseClient
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: businesses, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to fetch businesses'
      });
    }

    // Transform the data to match the expected format
    const transformedBusinesses = businesses.map(business => ({
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
      updatedAt: new Date(business.updated_at).getTime()
    }));

    return res.status(200).json({
      businesses: transformedBusinesses,
      total: count || businesses.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('List businesses error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list businesses'
    });
  }
} 