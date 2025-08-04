import { NextRequest, NextResponse } from 'next/server';
import { generateImageFromHTML } from '@/lib/edgeone-image';
import supabaseClient from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('🚀 Menu generation API called');
  
  try {
    console.log('📥 Parsing request body...');
    const requestBody = await request.json();
    console.log('📋 Request body received:', JSON.stringify(requestBody, null, 2));
    
    const html = requestBody;

    console.log('🎨 Starting image generation...');
    const logoUrl = await generateImageFromHTML(html);
    console.log('✅ Logo generated successfully:', logoUrl);

    let { data: business, error: businessError } = await supabaseClient
      .from('businesses')
      .update({logo_url: logoUrl})
      .eq('business_id', businessId)
      .single();

    if (businessError) throw (businessError)

    return NextResponse.json({
      success: true,
      imageUrl: logoUrl,
      message: 'Menu generated successfully'
    });

  } catch (error) {
    console.error('❌ Logo generation error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate logo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
