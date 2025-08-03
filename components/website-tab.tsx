'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';
import BusinessForm from './BusinessForm';
import WebsitePreview from './WebsitePreview';

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

interface WebsiteTabProps {
  businessData: BusinessData;
  onUpdate?: (updatedData: BusinessData) => void;
}

export default function WebsiteTab({ businessData, onUpdate }: WebsiteTabProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState<'not-generated' | 'generating' | 'generated' | 'error'>(
    businessData.websiteUrl ? 'generated' : 'not-generated'
  );
  const [websiteData, setWebsiteData] = useState<BusinessData>(businessData);
  const [products, setProducts] = useState<any[]>([]);
  const [showProductsMenu, setShowProductsMenu] = useState(false);

  // Transform businessData to match BusinessForm interface
  const transformToBusinessFormData = (data: BusinessData) => ({
    businessName: data.businessName,
    ownerName: data.ownerName,
    description: data.description,
    category: data.category,
    products: data.products,
    phone: data.phone,
    email: data.email,
    address: data.address,
    whatsapp: data.whatsapp,
    instagram: data.instagram,
  });

  // Fetch products for this business
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('business_id', businessData.businessId);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [businessData.businessId]);

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    setWebsiteStatus('generating');

    try {
      // Prepare products information for the prompt
      const productsInfo = products.length > 0 
        ? `\n\nProducts/Services:\n${products.map(p => `- ${p.name}: ${p.description} (Rp ${p.price?.toLocaleString() || '0'})`).join('\n')}`
        : '';

      // Prepare the data with custom prompt and products
      const requestData = {
        ...transformToBusinessFormData(businessData),
        customPrompt: customPrompt.trim() || undefined,
        productsList: products,
        productsInfo: productsInfo
      };

      // Call the website generation API
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate website');
      }

      const result = await response.json();

      if (result.success) {
        // Update business record with website URL
        const { error } = await supabaseClient
          .from('businessesNeo')
          .update({
            websiteUrl: result.url,
            websiteGenerated: true
          })
          .eq('businessId', businessData.businessId);

        if (error) throw error;

        setWebsiteStatus('generated');
        const updatedData = { 
          ...businessData, 
          websiteUrl: result.url, 
          websiteGenerated: true 
        } as BusinessData;
        onUpdate?.(updatedData);
        setWebsiteData(updatedData);
      } else {
        setWebsiteStatus('error');
      }
    } catch (error) {
      console.error('Error generating website:', error);
      setWebsiteStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditWebsite = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: {
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
  }) => {
    try {
      // Update business data with new form data
      const { error } = await supabaseClient
        .from('businessesNeo')
        .update({
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          description: formData.description,
          category: formData.category as 'restaurant' | 'retail' | 'service' | 'other',
          products: formData.products,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
        })
        .eq('businessId', businessData.businessId);

      if (error) throw error;

      const updatedData = { 
        ...businessData, 
        ...formData,
        category: formData.category as 'restaurant' | 'retail' | 'service' | 'other'
      } as BusinessData;
      onUpdate?.(updatedData);
      setWebsiteData(updatedData);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating business data:', error);
      alert('Error updating business data. Please try again.');
    }
  };

  const handleViewWebsite = () => {
    if (websiteData.websiteUrl) {
      window.open(websiteData.websiteUrl, '_blank');
    }
  };

  const handlePreviewWebsite = () => {
    setShowPreview(true);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Website Information</h2>
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <BusinessForm 
            initialData={transformToBusinessFormData(websiteData)}
            onSubmit={handleFormSubmit}
            isEditing={true}
          />
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Website Preview</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
        <WebsitePreview
          businessData={transformToBusinessFormData(websiteData)}
          onClose={() => setShowPreview(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Website</h2>
        {websiteStatus === 'generated' && (
          <div className="flex gap-2">
            <button
              onClick={handleEditWebsite}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Information
            </button>
            <button
              onClick={handlePreviewWebsite}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Preview Website
            </button>
          </div>
        )}
      </div>

      {websiteStatus === 'not-generated' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Generate Website</h3>
          <p className="text-blue-700 mb-4">
            Create a professional website for your business using the information you&apos;ve provided.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Current Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Business Name:</span>
                  <p className="font-medium">{websiteData.businessName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-medium capitalize">{websiteData.category}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{websiteData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{websiteData.address}</p>
                </div>
              </div>
            </div>
            
            {/* Products Menu */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-blue-800">Products Menu</h4>
                <button
                  onClick={() => setShowProductsMenu(!showProductsMenu)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showProductsMenu ? 'Hide' : 'Show'} Products
                </button>
              </div>
              {showProductsMenu && (
                <div className="space-y-3">
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{product.name}</h5>
                              <p className="text-gray-600 text-xs">{product.description}</p>
                              <p className="text-indigo-600 font-bold text-sm">
                                Rp {product.price?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No products added yet. Products will be included in the website generation.</p>
                  )}
                </div>
              )}
            </div>

            {/* Custom Prompt Input */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Custom Instructions (Optional)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Add specific instructions for your website design, layout, or content preferences.
              </p>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., 'Make it modern and minimalist', 'Include a testimonials section', 'Use a warm color scheme'"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-between items-center">

            <button onClick = {() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Form
            </button>
            
            <button onClick = {() => setShowPreview(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Preview
            </button>

            <button
              onClick={handleGenerateWebsite}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Website
            </button>
            </div>
          </div>
        </div>
      )}

      {websiteStatus === 'generating' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Generating Website</h3>
              <p className="text-yellow-700">Please wait while we create your website...</p>
            </div>
          </div>
        </div>
      )}

      {websiteStatus === 'generated' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Website Generated Successfully</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Website Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Website URL:</span>
                  <p className="font-medium">
                    <a 
                      href={websiteData.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {websiteData.websiteUrl}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium text-green-800">Live</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleViewWebsite}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Website
              </button>
              <button
                onClick={handleEditWebsite}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Information
              </button>
              <button
                onClick={handlePreviewWebsite}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {websiteStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Website Generation Failed</h3>
          <p className="text-red-700 mb-4">
            There was an error generating your website. Please try again.
          </p>
          <button
            onClick={handleGenerateWebsite}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 