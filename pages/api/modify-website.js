import { AIWebsiteService } from '../../lib/ai-website-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentHtml, modificationRequest, businessData } = req.body;

    // Validate required fields
    if (!currentHtml || !modificationRequest || !businessData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Modifying website with request:', modificationRequest);

    // Create a GeneratedWebsite object from the current HTML
    const currentWebsite = {
      html: currentHtml,
      css: '', // Extract CSS from HTML if needed
      js: '', // Extract JS from HTML if needed
      metadata: {
        businessData: businessData
      }
    };

    // Use AI service to modify the website
    const aiService = new AIWebsiteService();
    const result = await aiService.modifyWebsite(currentWebsite, modificationRequest);

    if (result.success) {
      // Combine HTML, CSS, and JS into a complete HTML document
      const modifiedHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.businessName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${result.css}
    </style>
</head>
<body>
    ${result.html}
    <script>
        ${result.js}
    </script>
</body>
</html>`;

      res.status(200).json({ 
        modifiedHtml: modifiedHtml,
        message: 'Website modified successfully'
      });
    } else {
      res.status(500).json({ 
        error: result.error || 'Failed to modify website'
      });
    }

  } catch (error) {
    console.error('Error modifying website:', error);
    res.status(500).json({ error: 'Failed to modify website' });
  }
} 