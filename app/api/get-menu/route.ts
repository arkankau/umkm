import { NextRequest, NextResponse } from 'next/server';
import supabaseClient from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({
        success: false,
        error: 'Business ID is required'
      }, { status: 400 });
    }

    // Fetch menu data
    const { data: menuData, error: menuError } = await supabaseClient
      .from('menus')
      .select('*')
      .eq('businessId', businessId)
      .single();

    if (menuError && menuError.code !== 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch menu data'
      }, { status: 500 });
    }

    // Fetch products for this business
    const { data: productsData, error: productsError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('business_id', businessId);

    if (productsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch products data'
      }, { status: 500 });
    }

    // Transform products to match the expected format
    const transformedProducts = productsData?.map(product => ({
      id: product.id,
      category: 'Product', // You can add a category field to products table if needed
      name: product.name,
      price: parseFloat(product.price),
      description: product.description || '',
      image_url: product.imageUrl || '',
      is_available: true // You can add an is_available field to products table if needed
    })) || [];

    // If menu exists, create menuProducts array with products from submenus
    let menuProducts: any[] = [];
    if (menuData && menuData.submenus) {
      const allProductIds = Object.values(menuData.submenus).flat() as string[];
      menuProducts = transformedProducts.filter(product => 
        allProductIds.includes(product.id)
      );
    }

    return NextResponse.json({
      success: true,
      menu: menuData || null,
      products: transformedProducts,
      menuProducts: menuProducts
    });

  } catch (error) {
    console.error('Get menu error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 