// Next.js API route for get-status
import { deploymentService } from '../../lib/deployment-service';
import supabaseClient from '../../app/lib/supabase';

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

    // Get business data from Supabase
    const { data: business, error: supabaseError } = await supabaseClient
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (supabaseError) {
      console.error('Supabase query error:', supabaseError);
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business not found'
      });
    }

    // Get real deployment status from deployment service
    const deploymentResult = await deploymentService.getDeploymentStatus(business.subdomain || businessId);

    // Calculate progress based on status
    const status = deploymentResult?.status || business.status;
    const progress = status === 'live' ? '100%' : 
                    status === 'processing' ? '75%' :
                    status === 'pending' ? '25%' : '0%';

    const response = {
      businessId: business.id,
      subdomain: business.subdomain || businessId,
      domain: business.subdomain || businessId,
      status: status,
      businessName: business.business_name,
      websiteUrl: status === 'live' ? (deploymentResult?.url || business.website_url) : undefined,
      processingTime: status === 'live' ? 30 : Math.floor(Math.random() * 20) + 10,
      createdAt: new Date(business.created_at).getTime(),
      deployedAt: business.deployed_at ? new Date(business.deployed_at).getTime() : deploymentResult?.deployedAt,
      message: deploymentResult?.message || 'Processing your website deployment...',
      progress,
      error: deploymentResult?.error,
      deploymentMethod: deploymentResult?.deploymentMethod
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