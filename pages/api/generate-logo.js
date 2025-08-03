import { createEdgeOneAPI } from '../../lib/edgeone-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, businessName } = req.body;

    // Validate required fields
    if (!prompt || !businessName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both prompt and businessName are required'
      });
    }

    console.log('Generating logo for:', businessName, 'with prompt:', prompt);

    // Create EdgeOne API instance
    const edgeOneAPI = createEdgeOneAPI();

    // Generate logo
    const result = await edgeOneAPI.generateLogo(prompt, businessName);

    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        message: 'Logo generated successfully'
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