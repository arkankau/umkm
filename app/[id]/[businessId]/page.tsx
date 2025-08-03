'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBusinessStatus, BusinessStatus } from '../../../lib/api';
import NavDash from '@/components/dashboardnav';

interface DashboardProps {
  params: Promise<{ id: string; businessId: string }>;
}

export default function Dashboard({ params }: DashboardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<BusinessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string>('');

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
    if (!businessId) {
      console.log('No businessId available yet');
      return;
    }

    console.log('Fetching status for businessId:', businessId);
    const fetchStatus = async () => {
      try {
        const result = await getBusinessStatus(businessId);
        console.log('Status result:', result);
        setStatus(result);
      } catch (err) {
        console.error('Error fetching status:', err);
        setError(err instanceof Error ? err.message : 'Failed to load status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [businessId]);

  const handleCreateMenu = () => {
    router.push(`/${params}/create-menu?businessId=${businessId}`);
  };

  const handleViewWebsite = () => {
    if (status?.websiteUrl) {
      window.open(status.websiteUrl, '_blank');
    }
  };

  const handleEditBusiness = () => {
    router.push(`/${params}/create-new`);
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

  if (!status) {
    return (
      <div>
        <NavDash />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
            <p className="text-gray-600">Business not found</p>
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
                  {status.businessName}
                </h1>
                <p className="text-gray-600 mb-4">Dashboard Bisnis</p>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status.status === 'live' ? 'bg-green-100 text-green-800' :
                    status.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status.status === 'live' ? '✅ Live' :
                     status.status === 'error' ? '❌ Error' :
                     '⏳ Processing'}
                  </span>
                  <span className="text-sm text-gray-500">Domain: {businessId}</span>
                </div>
              </div>
              {status.websiteUrl && (
                <button
                  onClick={handleViewWebsite}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Website
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Website Status</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {status.status === 'live' ? 'Website Anda sudah live dan dapat diakses' :
                 status.status === 'error' ? 'Terjadi kesalahan dalam deployment' :
                 'Website sedang dalam proses deployment'}
              </p>
              {status.websiteUrl && (
                <a
                  href={status.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Lihat Website →
                </a>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Menu Management</h3>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Buat dan kelola menu produk atau layanan Anda
              </p>
              <button
                onClick={handleCreateMenu}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Buat Menu →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Info</h3>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Edit informasi bisnis dan detail kontak
              </p>
              <button
                onClick={handleEditBusiness}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit Info →
              </button>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Bisnis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Bisnis</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Nama Bisnis:</span>
                    <p className="text-gray-900">{status.businessName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Domain:</span>
                    <p className="text-gray-900 font-mono">{businessId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <p className="text-gray-900">{status.status}</p>
                  </div>
                  {status.deployedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Deployed At:</span>
                      <p className="text-gray-900">{new Date(status.deployedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Details</h3>
                <div className="space-y-3">
                  {status.websiteUrl && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Website URL:</span>
                      <p className="text-gray-900">
                        <a 
                          href={status.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {status.websiteUrl}
                        </a>
                      </p>
                    </div>
                  )}
                  {status.deploymentMethod && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Deployment Method:</span>
                      <p className="text-gray-900 capitalize">{status.deploymentMethod}</p>
                    </div>
                  )}
                  {status.processingTime && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Processing Time:</span>
                      <p className="text-gray-900">{(status.processingTime / 1000).toFixed(1)}s</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleCreateMenu}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Buat Menu
            </button>
            <button
              onClick={handleEditBusiness}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Edit Bisnis
            </button>
            {status.websiteUrl && (
              <button
                onClick={handleViewWebsite}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Lihat Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
