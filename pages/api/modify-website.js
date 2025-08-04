import { AIWebsiteService } from '../../lib/ai-website-service';
import { websiteModificationFallback } from '../../lib/website-modification-fallback';

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

    // Use fallback system for robust modification
    const result = await websiteModificationFallback.modifyWithFallback({
      currentHtml,
      modificationRequest,
      businessData
    });

    if (result.success) {
      res.status(200).json({ 
        modifiedHtml: result.modifiedHtml,
        message: `Website modified successfully using ${result.method}`
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