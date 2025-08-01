'use client';

import { useEffect, useState } from 'react';
import { getBusinessStatus, BusinessStatus } from '../../../lib/api';

export default function StatusPage({ params }: { params: { businessId: string } }) {
  const [status, setStatus] = useState<BusinessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getBusinessStatus(params.businessId);
        setStatus(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [params.businessId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600">Business not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {status.businessName}
            </h1>
            <p className="text-gray-600">Website Generation Status</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{status.progress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: status.progress }}
              ></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                status.status === 'live' ? 'text-green-600' :
                status.status === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {status.status === 'live' ? '✅ Live' :
                 status.status === 'error' ? '❌ Error' :
                 '⏳ Processing'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Business ID:</span>
              <span className="font-mono text-sm">{status.businessId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Subdomain:</span>
              <span className="font-mono text-sm">{status.subdomain}</span>
            </div>
            
            {status.websiteUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Website URL:</span>
                <a 
                  href={status.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {status.websiteUrl}
                </a>
              </div>
            )}
            
            {status.processingTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time:</span>
                <span className="text-sm">{(status.processingTime / 1000).toFixed(1)}s</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {status.message}
            </p>
            
            {status.status === 'live' && status.websiteUrl && (
              <a
                href={status.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Website
              </a>
            )}
            
            {status.status === 'error' && status.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700 text-sm">{status.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 