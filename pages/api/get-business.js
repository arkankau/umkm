// Next.js API route for get-business
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed' 
    });
  }

  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Business ID is required'
      });
    }

    // Simulate business data
    const response = {
      id: businessId,
      businessName: 'Sample Business',
      ownerName: 'John Doe',
      description: 'A sample business for demonstration purposes',
      category: 'retail',
      products: 'Various products and services',
      phone: '+6281234567890',
      email: 'contact@samplebusiness.com',
      address: 'Jl. Sample Street No. 123, Jakarta',
      whatsapp: '+6281234567890',
      instagram: '@samplebusiness',
      logoUrl: 'https://via.placeholder.com/150',
      websiteUrl: `https://${businessId}.umkm.id`,
      subdomain: `business_${businessId.split('_')[1] || businessId}`,
      status: 'live',
      createdAt: Date.now() - 86400000, // 1 day ago
      deployedAt: Date.now() - 3600000, // 1 hour ago
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent('Jl. Sample Street No. 123, Jakarta')}`,
      whatsappUrl: `https://wa.me/6281234567890`,
      instagramUrl: 'https://instagram.com/samplebusiness'
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