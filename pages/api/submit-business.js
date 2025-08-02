// Next.js API route for submit-business
import { deploymentService } from '../../lib/deployment-service';

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
        message: 'Please check your input data',
        details: {
          businessName: !businessData.businessName ? 'businessName is required' : null,
          ownerName: !businessData.ownerName ? 'ownerName is required' : null,
          description: !businessData.description ? 'description is required' : null,
          category: !businessData.category ? 'category is required' : null,
          products: !businessData.products ? 'products is required' : null,
          phone: !businessData.phone ? 'phone is required' : null,
          address: !businessData.address ? 'address is required' : null,
        }
      });
    }

    // Deploy website using EdgeOne (or demo mode)
    console.log('Starting deployment for:', businessData.businessName);
    const result = await deploymentService.deployWebsite(businessData);

    if (result.success) {
      return res.status(200).json({
        success: true,
        businessId: result.businessId,
        subdomain: result.subdomain,
        domain: result.domain,
        status: result.status,
        message: result.message,
        error: result.error
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Deployment Error',
        message: result.error || 'Failed to deploy website'
      });
    }

  } catch (error) {
    console.error('Submit business error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit business data'
    });
  }
} 