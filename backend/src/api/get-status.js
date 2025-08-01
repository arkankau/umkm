export async function getStatus(request, env, ctx) {
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
    
    // Calculate processing time if available
    let processingTime = null;
    if (businessData.processingStartedAt) {
      const endTime = businessData.deployedAt || businessData.errorAt || Date.now();
      processingTime = endTime - businessData.processingStartedAt;
    }
    
    // Prepare status response
    const statusResponse = {
      businessId: businessData.id,
      subdomain: businessData.subdomain,
      status: businessData.status,
      businessName: businessData.businessName,
      websiteUrl: businessData.websiteUrl,
      processingTime: processingTime,
      createdAt: businessData.createdAt,
      deployedAt: businessData.deployedAt,
      error: businessData.error || null
    };
    
    // Add additional info based on status
    switch (businessData.status) {
      case 'processing':
        statusResponse.message = 'Website sedang dibuat...';
        statusResponse.progress = '75%';
        break;
      case 'live':
        statusResponse.message = 'Website berhasil dibuat!';
        statusResponse.progress = '100%';
        break;
      case 'error':
        statusResponse.message = 'Gagal membuat website';
        statusResponse.progress = '0%';
        break;
      default:
        statusResponse.message = 'Status tidak diketahui';
        statusResponse.progress = '0%';
    }
    
    return new Response(JSON.stringify(statusResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get status error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'Failed to get status'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 