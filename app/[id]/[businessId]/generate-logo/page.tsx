'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';
import LogoGenerator from '@/components/LogoGenerator';
import { ArrowLeft, Home } from 'lucide-react';

interface BusinessData {
  businessId: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  logoUrl: string;
  userId: string;
  createdAt: string;
}

export default function GenerateLogoPage() {
  const params = useParams();
  const router = useRouter();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const { businessId } = params;
        
        if (!businessId) {
          setError('Business ID not found');
          return;
        }

        const { data, error } = await supabaseClient
          .from('businesses')
          .select('*')
          .eq('businessId', businessId)
          .single();

        if (error) throw error;

        setBusinessData(data);
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [params]);

  const handleLogoGenerated = async (logoUrl: string) => {
    if (!businessData) return;

    try {
      // Update business record with new logo
      const { error } = await supabaseClient
        .from('businesses')
        .update({ logoUrl })
        .eq('businessId', businessData.businessId);

      if (error) throw error;

      // Update local state
      setBusinessData(prev => prev ? { ...prev, logoUrl } : null);
      
      console.log('Logo updated successfully');
    } catch (err) {
      console.error('Error updating logo:', err);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business data...</p>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error || 'Business not found'}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleGoBack}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Logo Generator</h1>
                <p className="text-sm text-gray-600">{businessData.businessName}</p>
              </div>
            </div>
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LogoGenerator
            businessName={businessData.businessName}
            businessType={businessData.category}
            description={businessData.description}
            onLogoGenerated={handleLogoGenerated}
            showCloseButton={false}
          />
        </div>
      </div>
    </div>
  );
}
