import { generateCompleteHTML } from '../../lib/website-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const businessData = req.body;

    // Validate required fields
    if (!businessData.businessName || !businessData.ownerName || !businessData.description || !businessData.phone || !businessData.address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate HTML using template-based generation (no Gemini API)
    console.log('Generating template-based preview for:', businessData.businessName);
    const html = generateCompleteHTML(businessData);

    // Set response headers
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('Error generating template preview:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
} 