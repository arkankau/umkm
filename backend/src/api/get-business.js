export async function getBusiness(request, env, ctx) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ 
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get('businessId');
    const subdomain = url.searchParams.get('subdomain');
    
    if (!businessId && !subdomain) {
      return new Response(JSON.stringify({ 
        error: 'Bad Request',
        message: 'businessId or subdomain is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let businessDataJson;
    
    if (businessId) {
      businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
    } else if (subdomain) {
      const businessIdFromSubdomain = await env.UMKM_KV.get(`subdomain:${subdomain}`);
      if (businessIdFromSubdomain) {
        businessDataJson = await env.UMKM_KV.get(`business:${businessIdFromSubdomain}`);
      }
    }
    
    if (!businessDataJson) {
      return new Response(JSON.stringify({ 
        error: 'Not Found',
        message: 'Business not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const businessData = JSON.parse(businessDataJson);
    
    // Normalize products data if needed
    if (businessData.products && typeof businessData.products === 'string') {
      businessData.products = [{
        name: 'Menu',
        items: businessData.products.split(',').map(item => ({
          name: item.trim(),
          price: 0,
          description: ''
        }))
      }];
    }
    
    // Remove sensitive fields for public access
    const publicData = {
      id: businessData.id,
      businessName: businessData.businessName,
      ownerName: businessData.ownerName,
      description: businessData.description,
      category: businessData.category,
      products: businessData.products,
      phone: businessData.phone,
      email: businessData.email,
      address: businessData.address,
      whatsapp: businessData.whatsapp,
      instagram: businessData.instagram,
      logoUrl: businessData.logoUrl,
      websiteUrl: businessData.websiteUrl,
      subdomain: businessData.subdomain,
      status: businessData.status,
      createdAt: businessData.createdAt,
      deployedAt: businessData.deployedAt
    };
    
    // Add computed fields
    publicData.googleMapsUrl = generateGoogleMapsUrl(businessData.address);
    publicData.whatsappUrl = generateWhatsAppUrl(businessData.whatsapp || businessData.phone);
    publicData.instagramUrl = generateInstagramUrl(businessData.instagram);
    
    return new Response(JSON.stringify(publicData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get business error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'Failed to get business data'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateGoogleMapsUrl(address) {
  if (!address) return '#';
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/?q=${encodedAddress}`;
}

function generateWhatsAppUrl(phone) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone}`;
  return `https://wa.me/${whatsappPhone}`;
}

function generateInstagramUrl(instagram) {
  if (!instagram) return '#';
  return `https://instagram.com/${instagram}`;
} 