import { loadTemplate, processTemplate, getAvailableThemes } from '../utils/template.js';
import { deployToEdgeOne } from '../utils/deployment.js';

export async function generateSite(request, env, ctx) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    let data;
    try {
      if (request.json) {
        data = await request.json();
      } else if (request.body) {
        data = JSON.parse(request.body);
      } else {
        throw new Error('Invalid request format');
      }
    } catch (parseError) {
      console.error('Failed to parse request:', parseError);
      return new Response(JSON.stringify({
        error: 'Invalid JSON',
        message: 'Failed to parse request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { businessId, customTheme } = data;
    
    if (!businessId) {
      return new Response(JSON.stringify({ 
        error: 'Bad Request',
        message: 'businessId is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get business data from KV
    const businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
    
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
    
    // Normalize business data
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
    
    // Update status to processing
    businessData.status = 'processing';
    businessData.processingStartedAt = Date.now();
    
    await env.UMKM_KV.put(
      `business:${businessId}`, 
      JSON.stringify(businessData)
    );

    // Load appropriate template based on category with custom theme
    const html = await loadTemplate(businessData.category, businessData, customTheme);
    
    // Deploy to EdgeOne Pages
    const deployment = await deployToEdgeOne(
      businessData.subdomain, 
      html, 
      businessData,
      env
    );
    
    if (!deployment.success) {
      throw new Error(deployment.error || 'Deployment failed');
    }
    
    // Update business data with success status and theme info
    businessData.status = 'live';
    businessData.websiteUrl = deployment.url || `https://${businessData.subdomain}.umkm.id`;
    businessData.deployedAt = deployment.deployedAt || Date.now();
    businessData.processingTime = businessData.deployedAt - businessData.processingStartedAt;
    businessData.theme = customTheme || 'default';
    businessData.deploymentMethod = deployment.deploymentMethod || 'unknown';
    
    await env.UMKM_KV.put(
      `business:${businessId}`, 
      JSON.stringify(businessData)
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      url: businessData.websiteUrl,
      subdomain: businessData.subdomain,
      processingTime: businessData.processingTime,
      theme: businessData.theme,
      deploymentMethod: businessData.deploymentMethod,
      message: 'Website generated and deployed successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Generate site error:', error);
    
    // Update status to error if we have businessId
    try {
      const { businessId } = await request.json();
      if (businessId) {
        const businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
        if (businessDataJson) {
          const businessData = JSON.parse(businessDataJson);
          businessData.status = 'error';
          businessData.error = error.message;
          businessData.errorAt = Date.now();
          
          await env.UMKM_KV.put(
            `business:${businessId}`, 
            JSON.stringify(businessData)
          );
        }
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError);
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate website'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// New API endpoint to get available themes
export async function getThemes(request, env, ctx) {
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
    const themes = getAvailableThemes();
    
    return new Response(JSON.stringify({ 
      success: true,
      themes: themes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get themes error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message || 'Failed to get themes'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 