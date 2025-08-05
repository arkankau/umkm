import { NextRequest, NextResponse } from 'next/server';
import { deploymentService } from '@/lib_unused/deployment-service';
import supabaseClient from '@/app/lib/supabase';

export const maxDuration = 300;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const businessData = await request.json();
    
    // Log the incoming data for debugging
    console.log('=== GENERATE WEBSITE REQUEST DEBUG ===');
    console.log('Business data received:', JSON.stringify(businessData, null, 2));
    console.log('business_name:', businessData.business_name);
    console.log('owner_name:', businessData.owner_name);
    console.log('description:', businessData.description);
    console.log('category:', businessData.category);
    console.log('phone:', businessData.phone);
    console.log('address:', businessData.address);
    console.log('=== END DEBUG ===');

    // Validate required fields (expect snake_case from client)
    const missingFields = [];
    if (!businessData.business_name) missingFields.push('business_name');
    if (!businessData.owner_name) missingFields.push('owner_name');
    if (!businessData.description) missingFields.push('description');
    if (!businessData.category) missingFields.push('category');
    if (!businessData.phone) missingFields.push('phone');
    if (!businessData.address) missingFields.push('address');

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation Error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      }, { status: 400 });
    }

    // Generate initial subdomain for deployment with timestamp to avoid conflicts
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const cleanBusinessName = businessData.business_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const initialSubdomain = `${cleanBusinessName}${timestamp}`;

    // Transform snake_case to camelCase for the website generator
    const enhancedBusinessData = {
      businessName: businessData.business_name,
      ownerName: businessData.owner_name,
      description: businessData.description,
      category: businessData.category,
      products: businessData.products,
      phone: businessData.phone,
      email: businessData.email,
      address: businessData.address,
      whatsapp: businessData.whatsapp,
      instagram: businessData.instagram,
      productsInfo: businessData.productsInfo || '',
      productsList: businessData.productsList || [],
      customPrompt: businessData.customPrompt || ''
    };

    // Deploy website using deployment service
    console.log('Starting deployment for:', businessData.business_name);
    const result = await deploymentService.deployWebsite(enhancedBusinessData, initialSubdomain);

    if (result.success) {
      // Extract the domain from the final URL to use as businessId
      let businessId = result.domain || initialSubdomain;
      
      // If we have a full URL, extract just the domain part
      if (result.url) {
        try {
          const url = new URL(result.url);
          businessId = url.hostname.replace('.edgeone.app', '');
        } catch (error) {
          console.log('Could not parse URL, using domain:', result.domain);
          businessId = result.domain || initialSubdomain;
        }
      }

      // Update businesses record with deployment results
      const { error: updateError } = await supabaseClient
        .from('businesses')
        .update({
          website_url: result.url,
          website_generated: result.url ? true : false,
          status: 'live',
          updated_at: new Date().toISOString()
        })
        .eq('business_id', businessData.business_id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
      }

      return NextResponse.json({
        success: true,
        businessId: businessData.business_id,
        subdomain: businessId,
        domain: businessId,
        status: 'live',
        message: 'Website generated successfully',
        url: result.url,
        deployedAt: result.deployedAt
      });
    } else {
      // Update businesses record with error status
      await supabaseClient
        .from('businesses')
        .update({
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('business_id', businessData.business_id);

      return NextResponse.json({
        success: false,
        error: 'Deployment Error',
        message: result.error || 'Failed to generate website'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Generate website error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    
    if (errorMessage.includes('timeout') || errorMessage.includes('Function timeout')) {
      statusCode = 408;
      errorCode = 'TIMEOUT';
    } else if (errorMessage.includes('memory') || errorMessage.includes('Memory limit')) {
      statusCode = 507;
      errorCode = 'MEMORY_LIMIT';
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      statusCode = 429;
      errorCode = 'RATE_LIMIT';
    }
    
    return NextResponse.json({
      success: false,
      error: 'Website Generation Error',
      message: 'Failed to generate website',
      details: errorMessage,
      code: errorCode
    }, { status: statusCode });
  }
} 