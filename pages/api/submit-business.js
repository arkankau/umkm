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

    // Generate clean subdomain for deployment
    const businessName = businessData.businessName || 'business';
    const cleanBusinessName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
    const initialSubdomain = cleanBusinessName;

    let supabaseData;
    
    // Check if this is an existing business deployment
    if (businessData.existingBusinessId) {
      console.log('Deploying existing business:', businessData.existingBusinessId);
      
      // Get existing business data
      const { data: existingBusiness, error: fetchError } = await supabaseClient
        .from('businesses')
        .select('*')
        .eq('id', businessData.existingBusinessId)
        .single();

      if (fetchError || !existingBusiness) {
        console.error('Existing business not found:', fetchError);
        return res.status(404).json({
          success: false,
          error: 'Business Not Found',
          message: 'Existing business not found in database'
        });
      }

      supabaseData = existingBusiness;
      console.log('Using existing business data:', supabaseData.id);
    } else {
      // First, save business data to Supabase
      console.log('Saving business data to Supabase:', businessData.businessName);
      
      const { data: newBusiness, error: supabaseError } = await supabaseClient
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

      supabaseData = newBusiness;
      console.log('Business data saved to Supabase with ID:', supabaseData.id);
    }

    // Deploy website using EdgeOne (or demo mode)
    console.log('Starting deployment for:', businessData.businessName);
    
    // Check if custom HTML is provided
    const customHtml = businessData.customHtml;
    const forceCustomHtml = businessData.forceCustomHtml;
    
    if (customHtml && forceCustomHtml) {
      console.log('Using custom HTML for deployment');
    } else if (customHtml) {
      console.log('Custom HTML provided but not forced, will use if available');
    } else {
      console.log('No custom HTML provided, generating fresh HTML');
    }
    
    const result = await deploymentService.deployWebsite(businessData, initialSubdomain, customHtml);

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