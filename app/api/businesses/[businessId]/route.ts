import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createEdgeOneAPI } from '@/lib/edgeone-api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Create Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Set the auth token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (business.website_url && business.subdomain) {
      try {
        const edgeOneAPI = createEdgeOneAPI();
        await edgeOneAPI.deleteDeployment(businessId, business.subdomain);
      } catch (error) {
        console.error('Failed to delete website deployment:', error);
      }
    }

    const { error: deleteError } = await supabase
      .from('businesses')
      .delete()
      .eq('business_id', businessId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}