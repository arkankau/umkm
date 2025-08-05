import { NextRequest, NextResponse } from 'next/server';
import { AIWebsiteService } from '@/lib_unused/ai-website-service';

export async function POST(request: NextRequest) {
  try {
    const { currentHtml, modificationRequest, businessData } = await request.json();
    
    if (!currentHtml || !modificationRequest) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Current HTML and modification request are required'
      }, { status: 400 });
    }

    // Call AI service to modify the website
    const aiWebsiteService = new AIWebsiteService();
    const result = await aiWebsiteService.modifyWebsite(currentHtml, modificationRequest, businessData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        modifiedHtml: result.html,
        message: 'Website modified successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'AI Service Error',
        message: result.error || 'Failed to modify website'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Modify website error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to modify website'
    }, { status: 500 });
  }
} 