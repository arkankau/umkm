// Next.js API route for get-status
import { deploymentService } from '../../lib/deployment-service';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed' 
    });
  }

  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Business ID is required'
      });
    }

    // Get real deployment status from deployment service
    const result = await deploymentService.getDeploymentStatus(businessId);

    if (!result) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business not found'
      });
    }

    // Calculate progress based on status
    const progress = result.status === 'live' ? '100%' : 
                    result.status === 'processing' ? '75%' :
                    result.status === 'pending' ? '25%' : '0%';

    const response = {
      businessId: businessId,
      subdomain: result.domain || businessId,
      domain: result.domain || businessId,
      status: result.status || 'processing',
      businessName: 'Your Business',
      websiteUrl: result.status === 'live' ? result.url : undefined,
      processingTime: result.status === 'live' ? 30 : Math.floor(Math.random() * 20) + 10,
      createdAt: Date.now() - 86400000, // 1 day ago
      deployedAt: result.deployedAt,
      message: result.message || 'Processing your website deployment...',
      progress,
      error: result.error
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Get status error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get status'
    });
  }
} 