import { NextRequest, NextResponse } from 'next/server';
import { generateAndUploadLogo } from '@/lib/generate-image';

export async function POST(request: NextRequest) {
  try {
    const { prompt, businessId } = await request.json();

    if (!prompt || !businessId) {
      return NextResponse.json(
        { error: 'Prompt and businessId are required' },
        { status: 400 }
      );
    }

    const logoUrl = await generateAndUploadLogo(prompt, businessId);

    return NextResponse.json({
      success: true,
      logoUrl,
      message: 'Logo generated and uploaded successfully'
    });

  } catch (error) {
    console.error('Error generating logo:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate logo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
