// Next.js API route for submit-business
import { deploymentService } from '../../lib/deployment-service';
import supabaseClient from '../../app/lib/supabase';

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

    // Generate initial subdomain for deployment with timestamp to avoid conflicts
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const cleanBusinessName = businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    const initialSubdomain = `${cleanBusinessName}${timestamp}`;

    // First, save business data to Supabase
    console.log('Saving business data to Supabase:', businessData.businessName);
    
    const { data: supabaseData, error: supabaseError } = await supabaseClient
      .from('businesses')
      .insert([
        {
          business_name: businessData.businessName,
          owner_name: businessData.ownerName,
          description: businessData.description,
          category: businessData.category,
          products: businessData.products,
          phone: businessData.phone,
          email: businessData.email || null,
          address: businessData.address,
          whatsapp: businessData.whatsapp || null,
          instagram: businessData.instagram || null,
          logo_url: businessData.logoUrl || null,
          subdomain: initialSubdomain,
          status: 'processing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      return res.status(500).json({
        success: false,
        error: 'Database Error',
        message: 'Failed to save business data to database',
        details: supabaseError.message
      });
    }

    console.log('Business data saved to Supabase with ID:', supabaseData.id);

    // Deploy website using EdgeOne (or demo mode)
    console.log('Starting deployment for:', businessData.businessName);
    const result = await deploymentService.deployWebsite(businessData, initialSubdomain);

    if (result.success) {
      // Extract the domain from the final URL to use as businessId
      let businessId = result.domain || initialSubdomain;
      
      // If we have a full URL, extract just the domain part
      if (result.url) {
        try {
          const url = new URL(result.url);
          businessId = url.hostname.replace('.edgeone.app', '');
        } catch (error) {
          console.log('Could not parse URL, using domain:', result.domain);
          businessId = result.domain || initialSubdomain;
        }
      }

      // Update Supabase record with deployment results
      const { error: updateError } = await supabaseClient
        .from('businesses')
        .update({
          website_url: result.url,
          subdomain: businessId,
          status: 'live',
          deployed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseData.id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
      }

      // Store the deployment result with the correct businessId
      if (businessId !== initialSubdomain) {
        // Update the stored deployment status with the correct businessId
        deploymentService.storeDeploymentStatus(businessId, {
          ...result,
          businessId: businessId
        });
      }

      return res.status(200).json({
        success: true,
        businessId: supabaseData.id, // Use Supabase ID as businessId
        subdomain: businessId,
        domain: businessId,
        status: 'processing',
        message: 'Website deployment started successfully',
        url: result.url,
        deployedAt: result.deployedAt
      });
    } else {
      // Update Supabase record with error status
      await supabaseClient
        .from('businesses')
        .update({
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseData.id);

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