// Next.js API route for submit-business
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed' 
    });
  }

  try {
    // For development, we'll simulate the backend response
    // In production, this would call the actual EdgeOne function
    
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

    // Generate mock response
    const businessId = 'dev-' + Date.now().toString(36);
    const subdomain = businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) + 
                     Math.random().toString(36).substring(2, 6);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.status(200).json({
      success: true,
      businessId,
      subdomain,
      status: 'processing',
      message: 'Business data submitted successfully. Site generation in progress.'
    });

  } catch (error) {
    console.error('Submit business error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit business data'
    });
  }
} 