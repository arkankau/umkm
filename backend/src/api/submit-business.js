import { validateBusinessData, generateUUID, generateSubdomain } from '../utils/validation.js';

export async function submitBusiness(request, env, ctx) {
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
    // Parse request body
    const formData = await request.json();
    
    // Validate input data
    const validated = validateBusinessData(formData);
    
    // Generate unique ID and subdomain
    const businessId = generateUUID();
    const subdomain = generateSubdomain(validated.businessName);
    
    // Prepare business data for storage
    const businessData = {
      ...validated,
      id: businessId,
      subdomain,
      status: 'processing',
      createdAt: Date.now(),
      logoUrl: formData.logoUrl || null,
      websiteUrl: null
    };
    
    // Store in KV
    await env.UMKM_KV.put(
      `business:${businessId}`, 
      JSON.stringify(businessData)
    );
    
    // Also store by subdomain for quick lookup
    await env.UMKM_KV.put(
      `subdomain:${subdomain}`, 
      businessId
    );
    
    // Trigger site generation asynchronously
    ctx.waitUntil(
      triggerSiteGeneration(businessId, env)
    );
    
    return new Response(JSON.stringify({ 
      success: true,
      businessId, 
      subdomain,
      status: 'processing',
      message: 'Business data submitted successfully. Site generation in progress.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Submit business error:', error);
    
    // Handle validation errors
    if (error.message.includes('{')) {
      try {
        const validationErrors = JSON.parse(error.message);
        return new Response(JSON.stringify({ 
          error: 'Validation Error',
          message: 'Please check your input data',
          details: validationErrors
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (parseError) {
        // Fall through to generic error
      }
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'Failed to submit business data'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function triggerSiteGeneration(businessId, env) {
  try {
    // Call the generate-site function
    const response = await fetch(`${env.EDGEONE_FUNCTION_URL}/api/generate-site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.EDGEONE_API_TOKEN}`
      },
      body: JSON.stringify({ businessId })
    });
    
    if (!response.ok) {
      console.error('Site generation failed:', await response.text());
      
      // Update status to error
      const businessData = JSON.parse(
        await env.UMKM_KV.get(`business:${businessId}`)
      );
      businessData.status = 'error';
      businessData.error = 'Site generation failed';
      
      await env.UMKM_KV.put(
        `business:${businessId}`, 
        JSON.stringify(businessData)
      );
    }
  } catch (error) {
    console.error('Error triggering site generation:', error);
    
    // Update status to error
    try {
      const businessData = JSON.parse(
        await env.UMKM_KV.get(`business:${businessId}`)
      );
      businessData.status = 'error';
      businessData.error = 'Site generation failed';
      
      await env.UMKM_KV.put(
        `business:${businessId}`, 
        JSON.stringify(businessData)
      );
    } catch (kvError) {
      console.error('Error updating KV:', kvError);
    }
  }
} 