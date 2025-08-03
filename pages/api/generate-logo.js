import { geminiImageService } from '../../lib/gemini-image-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, businessName, businessType, description, style, colors, additionalDetails } = req.body;

    // Validate required fields
    if (!businessName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'businessName is required'
      });
    }

    console.log('Generating logo for:', businessName, 'with prompt:', prompt);

    // Create logo generation request
    const logoRequest = {
      businessName,
      businessType: businessType || 'business',
      description: description || prompt || `A professional ${businessType || 'business'} called ${businessName}`,
      style,
      colors,
      additionalDetails
    };

    // Generate logo using Gemini
    const result = await geminiImageService.generateLogo(logoRequest);

    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        message: 'Logo generated successfully using Gemini AI'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate logo'
      });
    }

  } catch (error) {
    console.error('Logo generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate logo',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 