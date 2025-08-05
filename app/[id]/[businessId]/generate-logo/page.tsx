'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LogoGenerator from '@/components/LogoGenerator';
import { getBusinessInfoNeo } from 'https://umkm-eight.vercel.app/lib/api';
import supabaseClient from '@/app/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BusinessInfo {
  id: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email?: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
  websiteUrl?: string;
  subdomain: string;
  status: string;
  createdAt: number;
  deployedAt?: number;
  googleMapsUrl: string;
  whatsappUrl: string;
  instagramUrl: string;
}

export default function GenerateLogoPage() {
  const params = useParams();
  const businessId = params?.businessId as string;
  const [businessData, setBusinessData] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        
        // Try to get business data from both tables
        let business = null;
        
        // Try businesses table
        try {
          const data = await getBusinessInfoNeo(businessId);
          business = data;
        } catch (err) {
          console.log('Business not found, trying businesses table lookup');
        }
        
        // If not found, try direct businesses table lookup
        if (!business) {
          const { data: businessData, error: businessError } = await supabaseClient
            .from('businesses')
            .select('*')
            .eq('business_id', businessId)
            .single();

          if (!businessError && businessData) {
            business = businessData;
          } else {
            // Try businesses table
            const { data: businessOld, error: businessOldError } = await supabaseClient
              .from('businesses')
              .select('*')
              .eq('business_id', businessId)
              .single();

            if (!businessOldError && businessOld) {
              business = businessOld;
            } else {
              // Try by id
              const { data: businessById, error: businessByIdError } = await supabaseClient
                .from('businesses')
                .select('*')
                .eq('id', businessId)
                .single();

              if (!businessByIdError && businessById) {
                business = businessById;
              }
            }
          }
        }
        
        if (!business) {
          throw new Error('Business not found in any table');
        }
        
        // Transform business data to match BusinessInfo interface
        const transformedBusiness = {
          id: business.id,
          businessName: business.businessName || business.business_name || 'Business',
          ownerName: business.ownerName || business.owner_name || 'Owner',
          description: business.description || 'A professional business',
          category: business.category || 'General',
          products: business.products || '',
          phone: business.phone || '',
          email: business.email,
          address: business.address || '',
          whatsapp: business.whatsapp,
          instagram: business.instagram,
          logoUrl: business.logoUrl || business.logo_url,
          websiteUrl: business.websiteUrl || business.website_url,
          subdomain: business.subdomain || business.businessId || business.business_id || business.id,
          status: business.status || 'live',
          createdAt: business.createdAt || new Date(business.created_at).getTime(),
          deployedAt: business.deployedAt || (business.deployed_at ? new Date(business.deployed_at).getTime() : undefined),
          googleMapsUrl: business.googleMapsUrl || (business.address ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}` : ''),
          whatsappUrl: business.whatsappUrl || (business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '')}` : ''),
          instagramUrl: business.instagramUrl || (business.instagram ? `https://instagram.com/${business.instagram.replace('@', '')}` : '')
        };
        
        setBusinessData(transformedBusiness);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessData();
    }
  }, [businessId]);

  const handleLogoGenerated = (logoUrl: string) => {
    if (businessData) {
      setBusinessData({
        ...businessData,
        logoUrl
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading business data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              {error || 'Business not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/${params?.id}/${businessId}`}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Business
          </Button>
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Logo for {businessData.businessName}
          </h1>
          <p className="text-gray-600">
            Create a professional logo for your business using AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogoGenerator
            businessData={businessData}
            businessId={businessId}
            onLogoGenerated={handleLogoGenerated}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Name</label>
                <p className="text-sm">{businessData.businessName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Owner</label>
                <p className="text-sm">{businessData.ownerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm capitalize">{businessData.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm">{businessData.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Products/Services</label>
                <p className="text-sm">{businessData.products}</p>
              </div>
            </CardContent>
          </Card>

          {businessData.logoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Current Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={businessData.logoUrl}
                  alt={`${businessData.businessName} logo`}
                  className="w-full h-auto max-h-32 object-contain border rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
