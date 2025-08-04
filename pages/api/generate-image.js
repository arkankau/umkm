import { geminiImageService } from '../../lib/gemini-image-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, businessData } = req.body;

    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'prompt is required'
      });
    }

    console.log('Generating image with prompt:', prompt);

    let result;

    // If businessData is provided, generate business-related images
    if (businessData) {
      const images = await geminiImageService.generateBusinessImages(businessData);
      result = {
        success: true,
        images,
        message: 'Business images generated successfully using Gemini AI'
      };
    } else {
      // Generate single image
      result = await geminiImageService.generateImage(prompt);
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        images: result.images,
        prompt: result.prompt,
        message: result.message || 'Image generated successfully using Gemini AI'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate image'
      });
    }

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 