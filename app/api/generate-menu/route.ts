import { NextRequest, NextResponse } from 'next/server';
import { generateImageFromHTML } from '@/lib/edgeone-image';
import supabaseClient from '@/app/lib/supabase';
import supabaseServer from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  console.log('🚀 Menu generation API called');
  
  try {
    console.log('📥 Parsing request body...');
    const { html, businessId } = await request.json();
    
    if (!html || !businessId) {
      return NextResponse.json(
        { error: 'HTML and businessId are required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting image generation...');
    const imageBlob = await generateImageFromHTML(html);
    
    if (!imageBlob) {
      throw new Error('Failed to generate image');
    }

    // Convert blob to buffer for Supabase upload
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const fileName = `${businessId}-menu.png`;
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from('generatedmenu')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('generatedmenu')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      message: 'Menu generated and uploaded successfully'
    });

  } catch (error) {
    console.error('❌ Menu generation error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate menu',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
