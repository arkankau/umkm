import { submitBusiness } from './api/submit-business.js';
import { generateSite } from './api/generate-site.js';
import { getStatus } from './api/get-status.js';
import { getBusiness } from './api/get-business.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      let response;

      switch (path) {
        case '/api/submit-business':
          response = await submitBusiness(request, env, ctx);
          break;
        case '/api/generate-site':
          response = await generateSite(request, env, ctx);
          break;
        case '/api/get-status':
          response = await getStatus(request, env, ctx);
          break;
        case '/api/get-business':
          response = await getBusiness(request, env, ctx);
          break;
        default:
          response = new Response(JSON.stringify({ 
            error: 'Not Found',
            message: 'Endpoint not found' 
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
      }

      // Add CORS headers to all responses
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      console.error('Function error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
}; 