import { NextRequest, NextResponse } from 'next/server';
import { deploymentService } from '@/lib/deployment-service';
import supabaseClient from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const businessData = await request.json();
    
    // Validate required fields
    if (!businessData.businessName || !businessData.ownerName || !businessData.description || 
        !businessData.category || !businessData.phone || !businessData.address) {
      return NextResponse.json({
        success: false,
        error: 'Validation Error',
        message: 'Please check your input data'
      }, { status: 400 });
    }

    // Generate initial subdomain for deployment with timestamp to avoid conflicts
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const cleanBusinessName = businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    const initialSubdomain = `${cleanBusinessName}${timestamp}`;

    // Prepare enhanced business data with products for AI generation
    const enhancedBusinessData = {
      ...businessData,
      productsInfo: businessData.productsInfo || '',
      productsList: businessData.productsList || [],
      customPrompt: businessData.customPrompt || ''
    };

    // Deploy website using deployment service
    console.log('Starting deployment for:', businessData.businessName);
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

      // Update businessesNeo record with deployment results
      const { error: updateError } = await supabaseClient
        .from('businessesNeo')
        .update({
          websiteUrl: result.url,
          websiteGenerated: true,
          deployed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('businessId', businessData.businessId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
      }

      return NextResponse.json({
        success: true,
        businessId: businessData.businessId,
        subdomain: businessId,
        domain: businessId,
        status: 'live',
        message: 'Website generated successfully',
        url: result.url,
        deployedAt: result.deployedAt
      });
    } else {
      // Update businessesNeo record with error status
      await supabaseClient
        .from('businessesNeo')
        .update({
          websiteGenerated: false,
          updated_at: new Date().toISOString()
        })
        .eq('businessId', businessData.businessId);

      return NextResponse.json({
        success: false,
        error: 'Deployment Error',
        message: result.error || 'Failed to generate website'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Generate website error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to generate website'
    }, { status: 500 });
  }
} 