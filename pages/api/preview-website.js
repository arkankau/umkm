// Next.js API route for preview-website
import { generateWebsite } from '../../lib/website-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed' 
    });
  }

  try {
    const businessData = req.body;
    
    // Validate required fields
    if (!businessData.businessName || !businessData.ownerName || !businessData.description || 
        !businessData.category || !businessData.products || !businessData.phone || !businessData.address) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Please provide complete business data'
      });
    }

    // Generate the website
    const website = generateWebsite(businessData);
    
    // Create the complete HTML with embedded CSS and JS
    const completeHTML = website.html
      .replace('/* CSS will be injected here */', website.css)
      .replace('// JavaScript will be injected here', website.js);

    // Set content type to HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(completeHTML);

  } catch (error) {
    console.error('Preview website error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate website preview'
    });
  }
} 