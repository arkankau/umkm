'use client';

import { useState, useEffect } from 'react';
import { BusinessData } from 'https://umkm-eight.vercel.app/lib/api';

// Extended interface for website preview with businessId
interface WebsitePreviewBusinessData extends BusinessData {
  businessId?: string;
  userId?: string;
  websiteUrl?: string;
  websiteGenerated?: boolean;
  subdomain?: string;
}
import { websiteModificationFallback } from 'https://umkm-eight.vercel.app/lib/website-modification-fallback';

interface WebsitePreviewProps {
  businessData: WebsitePreviewBusinessData;
  onClose: () => void;
}

export default function WebsitePreview({ businessData, onClose }: WebsitePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [isModifying, setIsModifying] = useState(false);
  const [modificationHistory, setModificationHistory] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    const generatePreview = async () => {
      try {
        setLoading(true);
        setError(null);

        // If we have a businessId, try to load saved HTML from database first
        if (businessData.businessId) {
          console.log('Loading saved HTML from database for business:', businessData.businessId);
          
          const response = await fetch('https://umkm-eight.vercel.app/api/get-saved-html', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              businessId: businessData.businessId
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.html) {
              console.log('Found saved HTML in database');
              setPreviewHtml(result.html);
              setLoading(false);
              return;
            }
          }
        }

        // Check if we have saved modifications in localStorage (fallback)
        const previewKey = `website_preview_${businessData.businessName || 'temp'}`;
        const savedPreview = localStorage.getItem(previewKey);
        
        if (savedPreview) {
          try {
            const savedData = JSON.parse(savedPreview);
            console.log('Found saved preview in localStorage:', savedData);
            setPreviewHtml(savedData.html);
            setLoading(false);
            return;
          } catch (parseError) {
            console.log('Failed to parse saved preview, generating new one');
          }
        }

        // Use template-based generation for initial preview (no Gemini API)
        const response = await fetch('https://umkm-eight.vercel.app/api/preview-website-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(businessData),
        });

        if (!response.ok) {
          throw new Error('Failed to generate preview');
        }

        const html = await response.text();
        setPreviewHtml(html);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate preview');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [businessData]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating Website Preview</h3>
            <p className="text-gray-600">Please wait while we create your website...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleModification = async () => {
    if (!modificationRequest.trim()) return;
    
    try {
      setIsModifying(true);
      setError(null);
      
      // Add to modification history
      setModificationHistory(prev => [...prev, modificationRequest]);
      
      // Use fallback system for modification
      const result = await websiteModificationFallback.modifyWithFallback({
        currentHtml: previewHtml,
        modificationRequest: modificationRequest,
        businessData: businessData
      });

      if (result.success) {
        // Save the modified website to database
        const saveResult = await saveWebsiteModification(result.modifiedHtml, modificationRequest);
        
        if (saveResult.success) {
          setPreviewHtml(result.modifiedHtml);
          setModificationRequest('');
          
          if (saveResult.isPreview) {
            setSaveStatus({ type: 'success', message: `✅ Website modified and saved to preview using ${result.method}` });
          } else {
            setSaveStatus({ type: 'success', message: `✅ Website modified and saved to database using ${result.method}` });
          }
          
          // Clear success message after 3 seconds
          setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
          
          console.log(`Website modified and saved successfully using: ${result.method}`);
        } else {
          setSaveStatus({ type: 'error', message: 'Website modified but failed to save. Please try again.' });
          setTimeout(() => setSaveStatus({ type: null, message: '' }), 5000);
        }
      } else {
        setError(result.error || 'Failed to modify website');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to modify website');
    } finally {
      setIsModifying(false);
    }
  };

  const saveWebsiteModification = async (websiteHtml: string, modificationRequest: string) => {
    try {
      console.log('=== SAVE DEBUG START ===');
      console.log('Full businessData object:', businessData);
      console.log('businessData.businessId:', businessData.businessId);
      console.log('businessData.subdomain:', businessData.subdomain);
      console.log('businessData.id:', (businessData as any).id || businessData.businessId);
      console.log('=== SAVE DEBUG END ===');
      
      // Check if we have a businessId (meaning the business is saved to database)
      if (!businessData.businessId) {
        console.log('No businessId found - this is a preview mode, saving to local storage instead');
        
        // Save to localStorage for preview mode
        const previewKey = `website_preview_${businessData.businessName || 'temp'}`;
        localStorage.setItem(previewKey, JSON.stringify({
          html: websiteHtml,
          modificationRequest: modificationRequest,
          timestamp: new Date().toISOString(),
          businessName: businessData.businessName
        }));
        
        return { 
          success: true, 
          message: 'Website modifications saved to preview (not yet submitted to database)',
          isPreview: true
        };
      } else {
        // Clear localStorage since we're saving to database
        const previewKey = `website_preview_${businessData.businessName || 'temp'}`;
        localStorage.removeItem(previewKey);
      }
      
      const requestBody = {
        businessId: businessData.businessId,
        subdomain: businessData.subdomain,
        websiteHtml: websiteHtml,
        modificationRequest: modificationRequest
      };

      console.log('Saving website with data:', {
        businessId: businessData.businessId,
        subdomain: businessData.subdomain,
        htmlLength: websiteHtml.length,
        modificationRequest,
        hasBusinessId: !!businessData.businessId,
        hasSubdomain: !!businessData.subdomain
      });

      const response = await fetch('https://umkm-eight.vercel.app/api/save-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Save failed with status:', response.status, 'Response:', result);
        throw new Error(result.error || 'Failed to save website');
      }

      console.log('Save successful:', result);
      return result;
    } catch (error) {
      console.error('Error saving website:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Website Preview - {businessData.businessName}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const previewKey = `website_preview_${businessData.businessName || 'temp'}`;
                localStorage.removeItem(previewKey);
                window.location.reload();
              }}
              className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              title="Clear saved modifications and reset to original"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 p-4">
          <div className="w-full h-full border rounded-lg overflow-hidden">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        {/* Modification Panel */}
        <div className="p-4 border-t bg-blue-50">
          {/* Save Status */}
          {saveStatus.type && (
            <div className={`mb-4 p-3 rounded-lg ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="text-sm font-medium">{saveStatus.message}</p>
            </div>
          )}
          
          {!businessData.businessId && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
              <p className="text-sm font-medium">
                ⚠️ Please save your business data first to enable website modifications
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💡 Request Website Changes (AI + Fallback System)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  placeholder={businessData.businessId 
                    ? "e.g., change the color to blue, make the font bigger, add a contact form..." 
                    : "Save business data first to enable modifications..."
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isModifying || !businessData.businessId}
                />
                <button
                  onClick={handleModification}
                  disabled={!modificationRequest.trim() || isModifying || !businessData.businessId}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isModifying ? 'Modifying...' : 'Apply Changes'}
                </button>
                <button
                  onClick={() => saveWebsiteModification(previewHtml, 'Manual save')}
                  disabled={isModifying}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Save
                </button>
              </div>
              
              {/* Quick Suggestions */}
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {websiteModificationFallback.getAvailableModifications().slice(0, 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setModificationRequest(suggestion)}
                      className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modification History */}
            {modificationHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Changes:</h4>
                <div className="space-y-1">
                  {modificationHistory.slice(-3).map((request, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                      &quot;{request}&quot;
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              This is a preview of your generated website
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([previewHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${businessData.businessName.toLowerCase().replace(/\s+/g, '-')}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Download HTML
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 