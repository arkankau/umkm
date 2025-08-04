import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId } = req.query;

  if (!businessId) {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    // Get business from businesses table
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      return res.status(404).json({ error: 'Business not found' });
    }

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Get products for this business
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId);

    if (productsError) {
      console.error('Error fetching products:', productsError);
    }

    // Format the response to match the expected BusinessInfo interface
    const businessInfo = {
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
      websiteUrl: business.website_url || '',
      subdomain: business.subdomain,
      status: business.status || 'live',
      createdAt: new Date(business.created_at).getTime(),
      deployedAt: business.deployed_at ? new Date(business.deployed_at).getTime() : undefined,
      googleMapsUrl: business.address ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}` : '',
      whatsappUrl: business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '')}` : '',
      instagramUrl: business.instagram ? `https://instagram.com/${business.instagram.replace('@', '')}` : '',
      productsList: products || []
    };

    res.status(200).json(businessInfo);
  } catch (error) {
    console.error('Error in get-business-neo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 