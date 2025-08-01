import { loadTemplate, processTemplate } from '../utils/template.js';
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
    const { businessId } = await request.json();
    
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
    
    // Update status to processing
    businessData.status = 'processing';
    businessData.processingStartedAt = Date.now();
    
    await env.UMKM_KV.put(
      `business:${businessId}`, 
      JSON.stringify(businessData)
    );

    // Load appropriate template based on category
    const template = await loadTemplate(businessData.category);
    
    // Process template with business data
    const html = processTemplate(template, businessData);
    
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
    
    // Update business data with success status
    businessData.status = 'live';
    businessData.websiteUrl = `https://${businessData.subdomain}.umkm.id`;
    businessData.deployedAt = Date.now();
    businessData.processingTime = businessData.deployedAt - businessData.processingStartedAt;
    
    await env.UMKM_KV.put(
      `business:${businessId}`, 
      JSON.stringify(businessData)
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      url: businessData.websiteUrl,
      subdomain: businessData.subdomain,
      processingTime: businessData.processingTime,
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
      console.error('Error updating business status:', updateError);
    }
    
    return new Response(JSON.stringify({ 
      error: 'Site Generation Failed',
      message: error.message || 'Failed to generate website'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 