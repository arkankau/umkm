'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavDash from '@/components/dashboardnav';
import supabaseClient from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';
import BusinessTab from '@/components/business-tab';
import WebsiteTab from '@/components/website-tab';

interface BusinessData {
  businessId: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: 'restaurant' | 'retail' | 'service' | 'other';
  products: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  logoUrl: string;
  userId: string;
  createdAt: string;
  websiteUrl?: string;
  websiteGenerated?: boolean;
}

interface DashboardProps {
  params: Promise<{ id: string; businessId: string }>;
}

export default function Dashboard({ params }: DashboardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'business-info' | 'website' | 'guide'>('business-info');

  useEffect(() => {
    const initializePage = async () => {
      try {
        const resolvedParams = await params;
        console.log('Resolved businessId:', resolvedParams.businessId);
        setBusinessId(resolvedParams.businessId);
      } catch (err) {
        console.error('Error resolving params:', err);
        setError('Failed to load business ID');
        setLoading(false);
      }
    };

    initializePage();
  }, [params]);

  useEffect(() => {
    const checkUserAndLoadBusiness = async () => {
      try {
        // Check user authentication
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }
        setUser(user);

        // Load business data
        if (businessId) {
          const { data: business, error: businessError } = await supabaseClient
            .from('businesses')
            .select('*')
            .eq('businessId', businessId)
            .single();

          if (businessError || !business) {
            setError('Business not found');
            setLoading(false);
            return;
          }

          setBusinessData(business);
        }
      } catch (err) {
        console.error('Error loading business:', err);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      checkUserAndLoadBusiness();
    }
  }, [businessId, router]);

  const handleCreateMenu = () => {
    router.push(`/${user?.id}/${businessId}/create-menu`);
  };

  const handleViewWebsite = () => {
    if (businessData?.websiteUrl) {
      window.open(businessData.websiteUrl, '_blank');
    }
  };

  const handleEditBusiness = () => {
    router.push(`/${user?.id}/create-new`);
  };

  const handleGenerateWebsite = () => {
    router.push(`/${user?.id}/${businessId}/generate-website`);
  };

  const handleBusinessUpdate = (updatedData: BusinessData) => {
    setBusinessData(updatedData);
  };

  if (loading) {
    return (
      <div>
        <NavDash />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
            {businessId && (
              <p className="text-sm text-gray-500 mt-2">Business ID: {businessId}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavDash />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600">{error}</p>
            {businessId && (
              <p className="text-sm text-gray-500 mt-2">Business ID: {businessId}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div>
        <NavDash />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
            <p className="text-gray-600">The business you&apos;re looking for doesn&apos;t exist.</p>
            {businessId && (
              <p className="text-sm text-gray-500 mt-2">Business ID: {businessId}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavDash />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {businessData.businessName}
                </h1>
                <p className="text-gray-600 mb-4">Business Dashboard</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Business ID: {businessData.businessId}</span>
                  <span className="text-sm text-gray-500">Owner: {businessData.ownerName}</span>
                </div>
              </div>
              {businessData.websiteUrl && (
                <button
                  onClick={handleViewWebsite}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Website
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('business-info')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'business-info'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Business Information
                </button>
                <button
                  onClick={() => setActiveTab('website')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'website'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Website
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'guide'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Google Business Profile Guide
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'business-info' && (
                <BusinessTab businessData={businessData} onUpdate={handleBusinessUpdate} />
              )}
              {activeTab === 'website' && (
                <WebsiteTab businessData={businessData} onUpdate={handleBusinessUpdate} />
              )}
              {activeTab === 'guide' && (
                <GuideTab businessData={businessData} />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCreateMenu}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Menu
            </button>
            <button
              onClick={handleEditBusiness}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Edit Business
            </button>
            {businessData.websiteUrl && (
              <button
                onClick={handleViewWebsite}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Guide Tab Component
function GuideTab({ businessData }: { businessData: BusinessData }) {
  const [lang, setLang] = useState<'en' | 'id'>('en');

  // Import GuideOutput component dynamically
  const [GuideOutput, setGuideOutput] = useState<React.ComponentType<{ data: Record<string, unknown> }> | null>(null);

  useEffect(() => {
    import('@/components/guideoutput').then((module) => {
      setGuideOutput(() => module.default);
    });
  }, []);

  if (!GuideOutput) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Transform businessData to match GuideOutput interface
  const guideData = {
    businessName: businessData.businessName,
    ownerName: businessData.ownerName,
    description: businessData.description,
    category: businessData.category,
    products: businessData.products,
    phone: businessData.phone,
    email: businessData.email,
    address: businessData.address,
    whatsapp: businessData.whatsapp,
    instagram: businessData.instagram,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Google Business Profile Setup Guide</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              lang === 'en' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('id')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              lang === 'id' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ID
          </button>
        </div>
      </div>
      <GuideOutput data={guideData} />
    </div>
  );
}
