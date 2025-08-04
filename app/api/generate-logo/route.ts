import { NextRequest, NextResponse } from 'next/server';
import { generateAndUploadLogo } from '@/lib/generate-image';

export async function POST(request: NextRequest) {
  console.log('🚀 Logo generation API called');
  
  try {
    console.log('📥 Parsing request body...');
    const requestBody = await request.json();
    console.log('📋 Request body received:', JSON.stringify(requestBody, null, 2));
    
    const {
      prompt,
      businessName,
      businessType,
      description,
      businessId,
      style = 'modern and professional',
      colors = ['#22c55e', '#ffffff', '#1f2937']
    } = requestBody;

    if (!prompt || !businessName) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { 
          success: false,
          error: 'Prompt and businessName are required' 
        },
        { status: 400 }
      );
    }

    console.log('🔍 Checking environment variables...');
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
      console.error('❌ API key not found');
      return NextResponse.json(
        { 
          success: false,
          error: 'GEMINI_API_KEY environment variable is not set' 
        },
        { status: 500 }
      );
    }

    // Create enhanced prompt
    const enhancedPrompt = `Create a ${style} logo for "${businessName}", a ${businessType} business. ${description ? `Business description: ${description}. ` : ''}Logo requirements: ${prompt}. Use colors: ${colors.join(', ')}. The logo should be clean, professional, and suitable for business use. Make it simple and memorable.`;

    console.log('📝 Enhanced prompt created');
    
    const logoBusinessId = businessId || `temp-${Date.now()}`;
    console.log('🆔 Using business ID:', logoBusinessId);

    console.log('🎨 Starting logo generation...');
    const logoUrl = await generateAndUploadLogo(enhancedPrompt, logoBusinessId);
    console.log('✅ Logo generated successfully:', logoUrl);

    return NextResponse.json({
      success: true,
      imageUrl: logoUrl,
      message: 'Logo generated successfully'
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
