'use client';

import { useState, useEffect } from 'react';
import { BusinessData } from '../lib/api';

interface WebsitePreviewProps {
  businessData: BusinessData;
  onClose: () => void;
}

export default function WebsitePreview({ businessData, onClose }: WebsitePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [isModifying, setIsModifying] = useState(false);
  const [modificationHistory, setModificationHistory] = useState<string[]>([]);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use template-based generation for initial preview (no Gemini API)
        const response = await fetch('/api/preview-website-template', {
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
      
      // Call Gemini API for modification
      const response = await fetch('/api/modify-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentHtml: previewHtml,
          modificationRequest: modificationRequest,
          businessData: businessData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify website');
      }

      const { modifiedHtml } = await response.json();
      setPreviewHtml(modifiedHtml);
      setModificationRequest('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to modify website');
    } finally {
      setIsModifying(false);
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
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💡 Request Website Changes (Powered by AI)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={modificationRequest}
                  onChange={(e) => setModificationRequest(e.target.value)}
                  placeholder="e.g., change the color to blue, make the font bigger, add a contact form..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isModifying}
                />
                <button
                  onClick={handleModification}
                  disabled={!modificationRequest.trim() || isModifying}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isModifying ? 'Modifying...' : 'Apply Changes'}
                </button>
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